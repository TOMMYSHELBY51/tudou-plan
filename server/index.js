import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { analyzeStoolImage } from './aiService.js';
import { scoreDogFood } from './dogFoodScorer.js';
import popularDogFoods from './dogFoodData.js';
import { analyzeDogFood, generateRecommendText } from './dogFoodRecommender.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbPath = path.join(__dirname, 'data', 'db.json');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const defaultData = {
  dogs: [],
  stool_records: [],
  meal_records: [],
  dog_food_products: [],
  scoring_weights: [{
    id: 1,
    protein_weight: 30,
    fat_weight: 20,
    fiber_weight: 15,
    ash_weight: 10,
    moisture_weight: 10,
    price_weight: 15,
    updated_at: new Date().toISOString()
  }]
};

const adapter = new JSONFile(dbPath);
const db = new Low(adapter, defaultData);

let nextId = {
  dogs: 1,
  stool_records: 1,
  meal_records: 1,
  dog_food_products: 1,
  scoring_weights: 1
};

async function initializeDatabase() {
  await db.read();
  if (db.data.dogs.length > 0) {
    nextId.dogs = Math.max(...db.data.dogs.map(d => d.id)) + 1;
  }
  if (db.data.stool_records.length > 0) {
    nextId.stool_records = Math.max(...db.data.stool_records.map(d => d.id)) + 1;
  }
  if (db.data.meal_records.length > 0) {
    nextId.meal_records = Math.max(...db.data.meal_records.map(d => d.id)) + 1;
  }
  if (db.data.dog_food_products.length > 0) {
    nextId.dog_food_products = Math.max(...db.data.dog_food_products.map(d => d.id)) + 1;
  }
  if (db.data.scoring_weights.length > 0) {
    nextId.scoring_weights = Math.max(...db.data.scoring_weights.map(d => d.id)) + 1;
  }
  console.log('Database initialized');
}

const stoolStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'stool');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const uploadStool = multer({ storage: stoolStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 10 * 1024 * 1024 } });

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'posts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const uploadPost = multer({ storage: postStorage, limits: { fileSize: 10 * 1024 * 1024 } });

async function saveDb() {
  await db.write();
}

app.get('/api/dogs', async (req, res) => {
  try {
    await db.read();
    const dogs = [...db.data.dogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/dogs', async (req, res) => {
  try {
    await db.read();
    const { name, breed, birth_date, avatar_url } = req.body;
    const newDog = {
      id: nextId.dogs++,
      name,
      breed,
      birth_date,
      avatar_url,
      created_at: new Date().toISOString()
    };
    db.data.dogs.push(newDog);
    await saveDb();
    res.json(newDog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/dogs/:id/avatar', uploadAvatar.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const imagePath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    await db.read();
    const dogIndex = db.data.dogs.findIndex(d => d.id === parseInt(id));
    if (dogIndex === -1) {
      return res.status(404).json({ error: '未找到小狗' });
    }

    db.data.dogs[dogIndex].avatar_url = imagePath;
    await saveDb();

    res.json(db.data.dogs[dogIndex]);
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

app.get('/api/dogs/:id/stool-records', async (req, res) => {
  try {
    await db.read();
    const records = db.data.stool_records
      .filter(r => r.dog_id === parseInt(req.params.id))
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stool-analyze', uploadStool.single('image'), async (req, res) => {
  try {
    const { dog_id } = req.body;
    const imagePath = req.file ? `/uploads/stool/${req.file.filename}` : null;

    let analysisResult = null;
    let healthStatus = null;
    let suggestions = null;

    if (req.file) {
      const fullPath = path.join(__dirname, req.file.path);
      const result = await analyzeStoolImage(fullPath);
      analysisResult = result.analysis;
      healthStatus = result.status;
      suggestions = result.suggestions;
    }

    const newRecord = {
      id: nextId.stool_records++,
      dog_id: parseInt(dog_id),
      image_path: imagePath,
      analysis_result: analysisResult,
      health_status: healthStatus,
      suggestions: suggestions,
      recorded_at: new Date().toISOString()
    };

    await db.read();
    db.data.stool_records.push(newRecord);
    await saveDb();

    res.json(newRecord);
  } catch (error) {
    console.error('Stool analysis error:', error);
    res.status(500).json({ error: '分析失败' });
  }
});

app.get('/api/dogs/:id/meal-records', async (req, res) => {
  try {
    await db.read();
    const records = db.data.meal_records
      .filter(r => r.dog_id === parseInt(req.params.id))
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/meal-records', async (req, res) => {
  try {
    await db.read();
    const { dog_id, meal_type, food_description, food_brand, amount, notes } = req.body;
    const newRecord = {
      id: nextId.meal_records++,
      dog_id: parseInt(dog_id),
      meal_type,
      food_description,
      food_brand,
      amount,
      notes,
      recorded_at: new Date().toISOString()
    };
    db.data.meal_records.push(newRecord);
    await saveDb();
    res.json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dog-foods', async (req, res) => {
  try {
    await db.read();
    const foods = [...db.data.dog_food_products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/dog-foods', async (req, res) => {
  try {
    await db.read();
    const { brand, product_name, ingredients, guaranteed_analysis } = req.body;
    const newFood = {
      id: nextId.dog_food_products++,
      brand,
      product_name,
      ingredients,
      guaranteed_analysis,
      created_at: new Date().toISOString()
    };
    db.data.dog_food_products.push(newFood);
    await saveDb();
    res.json(newFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dog-foods/:id/score', async (req, res) => {
  try {
    await db.read();
    const food = db.data.dog_food_products.find(f => f.id === parseInt(req.params.id));
    if (!food) {
      return res.status(404).json({ error: '未找到该狗粮产品' });
    }

    const weights = db.data.scoring_weights.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0] || {
      protein_weight: 30,
      fat_weight: 20,
      fiber_weight: 15,
      ash_weight: 10,
      moisture_weight: 10,
      price_weight: 15
    };

    const scoreResult = await scoreDogFood(food, weights);
    res.json({ ...food, score: scoreResult });
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({ error: '评分失败' });
  }
});

app.get('/api/scoring-weights', async (req, res) => {
  try {
    await db.read();
    const weights = db.data.scoring_weights.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
    res.json(weights || {
      protein_weight: 30,
      fat_weight: 20,
      fiber_weight: 15,
      ash_weight: 10,
      moisture_weight: 10,
      price_weight: 15
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/scoring-weights', async (req, res) => {
  try {
    await db.read();
    const { protein_weight, fat_weight, fiber_weight, ash_weight, moisture_weight, price_weight } = req.body;
    const newWeights = {
      id: nextId.scoring_weights++,
      protein_weight,
      fat_weight,
      fiber_weight,
      ash_weight,
      moisture_weight,
      price_weight,
      updated_at: new Date().toISOString()
    };
    db.data.scoring_weights.push(newWeights);
    await saveDb();
    res.json(newWeights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/init-popular-foods', async (req, res) => {
  try {
    await db.read();
    const addedFoods = [];
    const updatedFoods = [];
    
    for (const food of popularDogFoods) {
      const existsIndex = db.data.dog_food_products.findIndex(
        f => f.brand === food.brand && f.product_name === food.product_name
      );
      
      if (existsIndex === -1) {
        const newFood = {
          id: nextId.dog_food_products++,
          brand: food.brand,
          product_name: food.product_name,
          ingredients: food.ingredients,
          guaranteed_analysis: food.guaranteed_analysis,
          price_range: food.price_range,
          price_spec: food.price_spec,
          taobao_link: food.taobao_link,
          source: food.source,
          features: food.features,
          created_at: new Date().toISOString()
        };
        db.data.dog_food_products.push(newFood);
        addedFoods.push(newFood);
      } else {
        const existingFood = db.data.dog_food_products[existsIndex];
        if (!existingFood.taobao_link || !existingFood.price_spec) {
          existingFood.price_spec = food.price_spec;
          existingFood.taobao_link = food.taobao_link;
          updatedFoods.push(existingFood);
        }
      }
    }
    
    await saveDb();
    res.json({ 
      message: `成功添加 ${addedFoods.length} 款，更新 ${updatedFoods.length} 款热门狗粮`,
      added: addedFoods,
      updated: updatedFoods
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/refresh-popular-foods', async (req, res) => {
  try {
    await db.read();
    let addedCount = 0;
    let updatedCount = 0;
    
    for (const food of popularDogFoods) {
      const existsIndex = db.data.dog_food_products.findIndex(
        f => f.brand === food.brand && f.product_name === food.product_name
      );
      
      if (existsIndex === -1) {
        const newFood = {
          id: nextId.dog_food_products++,
          brand: food.brand,
          product_name: food.product_name,
          ingredients: food.ingredients,
          guaranteed_analysis: food.guaranteed_analysis,
          price_range: food.price_range,
          price_spec: food.price_spec,
          taobao_link: food.taobao_link,
          source: food.source,
          features: food.features,
          created_at: new Date().toISOString()
        };
        db.data.dog_food_products.push(newFood);
        addedCount++;
      } else {
        const existingFood = db.data.dog_food_products[existsIndex];
        existingFood.price_spec = food.price_spec;
        existingFood.taobao_link = food.taobao_link;
        updatedCount++;
      }
    }
    
    await saveDb();
    res.json({ 
      message: `成功添加 ${addedCount} 款，更新 ${updatedCount} 款热门狗粮`,
      addedCount,
      updatedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dog-foods/all-scores', async (req, res) => {
  try {
    await db.read();
    const foods = db.data.dog_food_products;
    
    const weights = db.data.scoring_weights.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0] || {
      protein_weight: 30,
      fat_weight: 20,
      fiber_weight: 15,
      ash_weight: 10,
      moisture_weight: 10,
      price_weight: 15
    };

    const scoredFoods = await Promise.all(
      foods.map(async food => {
        const scoreResult = await scoreDogFood(food, weights);
        return { ...food, score: scoreResult };
      })
    );

    const sortedFoods = scoredFoods.sort((a, b) => b.score.total_score - a.score.total_score);
    res.json(sortedFoods);
  } catch (error) {
    console.error('Get all scores error:', error);
    res.status(500).json({ error: '获取评分失败' });
  }
});

app.get('/api/community/posts', async (req, res) => {
  try {
    await db.read();
    const posts = db.data.community_posts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(post => {
        const dog = db.data.dogs.find(d => d.id === post.dog_id);
        return {
          ...post,
          dog_name: dog ? dog.name : '未知',
          dog_avatar: dog ? dog.avatar_url : null
        };
      });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community/posts', uploadPost.single('image'), async (req, res) => {
  try {
    await db.read();
    const { content, dog_id } = req.body;
    const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : null;

    const newPost = {
      id: Date.now(),
      dog_id: parseInt(dog_id),
      content,
      image_url: imagePath,
      likes: 0,
      liked_by: [],
      comments: 0,
      created_at: new Date().toISOString()
    };

    db.data.community_posts.push(newPost);
    await saveDb();

    const dog = db.data.dogs.find(d => d.id === parseInt(dog_id));
    res.json({
      ...newPost,
      dog_name: dog ? dog.name : '未知',
      dog_avatar: dog ? dog.avatar_url : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community/posts/:id/like', async (req, res) => {
  try {
    await db.read();
    const { id } = req.params;
    const postIndex = db.data.community_posts.findIndex(p => p.id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    db.data.community_posts[postIndex].likes += 1;
    await saveDb();

    res.json({ likes: db.data.community_posts[postIndex].likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/dog-foods/recommend', async (req, res) => {
  try {
    await db.read();
    const { answers, dog_name } = req.body;
    
    const recommendations = analyzeDogFood(answers);
    const recommendText = generateRecommendText(answers, dog_name);
    
    const matchedFoods = [];
    for (const rec of recommendations) {
      let matched = db.data.dog_food_products.filter(food => {
        const features = food.features.toLowerCase();
        if (rec.name.includes('幼犬') && features.includes('幼犬')) return true;
        if (rec.name.includes('老年') && features.includes('老年')) return true;
        if (rec.name.includes('小型') && features.includes('小型')) return true;
        if (rec.name.includes('无谷') && features.includes('无谷')) return true;
        if (rec.name.includes('皮肤敏感') && features.includes('低敏')) return true;
        if (rec.name.includes('肠胃敏感') && features.includes('益生菌')) return true;
        if (rec.name.includes('活动量') && features.includes('高蛋白')) return true;
        return false;
      });
      matchedFoods.push(...matched);
    }
    
    const uniqueFoods = matchedFoods.filter((food, index, self) => 
      index === self.findIndex(f => f.id === food.id)
    );
    
    const weights = db.data.scoring_weights.sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )[0] || {
      protein_weight: 30,
      fat_weight: 20,
      fiber_weight: 15,
      ash_weight: 10,
      moisture_weight: 10,
      price_weight: 15
    };
    
    const scoredFoods = await Promise.all(
      uniqueFoods.map(async (food) => {
        const scoreResult = await scoreDogFood(food, weights);
        return { ...food, score: scoreResult };
      })
    );
    
    scoredFoods.sort((a, b) => b.score.total_score - a.score.total_score);
    
    res.json({
      recommendations,
      recommendText,
      matchedFoods: scoredFoods.slice(0, 5)
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: '推荐失败' });
  }
});

app.get('/api/dog-foods/compare', async (req, res) => {
  try {
    await db.read();
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ error: '请提供要对比的狗粮ID' });
    }
    
    const idList = ids.split(',').map(id => parseInt(id));
    const foods = db.data.dog_food_products.filter(f => idList.includes(f.id));
    
    const weights = db.data.scoring_weights.sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )[0] || {
      protein_weight: 30,
      fat_weight: 20,
      fiber_weight: 15,
      ash_weight: 10,
      moisture_weight: 10,
      price_weight: 15
    };
    
    const comparedFoods = await Promise.all(
      foods.map(async (food) => {
        const scoreResult = await scoreDogFood(food, weights);
        return { ...food, score: scoreResult };
      })
    );
    
    comparedFoods.sort((a, b) => b.score.total_score - a.score.total_score);
    
    res.json(comparedFoods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
