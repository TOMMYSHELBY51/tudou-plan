import { useState, useEffect } from 'react';
import { Plus, Dog, Calendar, AlertCircle, CheckCircle, Upload, Camera, ChevronRight, Star, Heart, MessageSquare, Sparkles, X } from 'lucide-react';

function Dashboard() {
  const [dogs, setDogs] = useState([]);
  const [showAddDog, setShowAddDog] = useState(false);
  const [newDog, setNewDog] = useState({ name: '', breed: '', birth_date: '', avatar_file: null, avatar_preview: null });
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState({
    dog_name: '',
    age: '',
    breed_size: '',
    activity_level: '',
    allergy: '',
    skin_issue: '',
    digest_issue: '',
    budget: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const res = await fetch('/api/dogs');
      const data = await res.json();
      setDogs(data);
    } catch (error) {
      console.error('Failed to fetch dogs:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setNewDog({ ...newDog, avatar_file: file, avatar_preview: preview });
    }
  };

  const handleAddDog = async (e) => {
    e.preventDefault();
    try {
      const dogData = {
        name: newDog.name,
        breed: newDog.breed,
        birth_date: newDog.birth_date
      };
      
      const res = await fetch('/api/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dogData),
      });
      
      const data = await res.json();
      
      if (newDog.avatar_file) {
        const formData = new FormData();
        formData.append('image', newDog.avatar_file);
        
        const avatarRes = await fetch(`/api/dogs/${data.id}/avatar`, {
          method: 'POST',
          body: formData
        });
        
        const updatedDog = await avatarRes.json();
        setDogs([updatedDog, ...dogs]);
      } else {
        setDogs([data, ...dogs]);
      }
      
      setShowAddDog(false);
      setNewDog({ name: '', breed: '', birth_date: '', avatar_file: null, avatar_preview: null });
    } catch (error) {
      console.error('Failed to add dog:', error);
    }
  };

  const handleUpdateAvatar = async (dogId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`/api/dogs/${dogId}/avatar`, {
        method: 'POST',
        body: formData
      });

      const updatedDog = await res.json();
      setDogs(dogs.map(d => d.id === dogId ? updatedDog : d));
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  const handleSurveyChange = (field, value) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleStartSurvey = (dog) => {
    const age = calculateAge(dog.birth_date);
    setSurveyAnswers({
      dog_name: dog.name,
      age: age || '',
      breed_size: '',
      activity_level: '',
      allergy: '',
      skin_issue: '',
      digest_issue: '',
      budget: ''
    });
    setRecommendations(null);
    setShowSurvey(true);
  };

  const handleSubmitSurvey = async () => {
    setLoading(true);
    try {
      const answers = {
        ...surveyAnswers,
        age: parseFloat(surveyAnswers.age) || 0
      };
      
      const res = await fetch('/api/dog-foods/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, dog_name: surveyAnswers.dog_name })
      });
      
      const data = await res.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Recommendation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSurvey = () => {
    setRecommendations(null);
    setSurveyAnswers({
      dog_name: '',
      age: '',
      breed_size: '',
      activity_level: '',
      allergy: '',
      skin_issue: '',
      digest_issue: '',
      budget: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">我的小狗</h2>
        <button
          onClick={() => setShowAddDog(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          添加小狗
        </button>
      </div>

      {dogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <Dog className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有添加小狗</h3>
          <p className="text-gray-500 mb-4">点击上方按钮添加你的第一只小狗</p>
          <button
            onClick={() => setShowSurvey(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md"
          >
            <Sparkles className="w-5 h-5" />
            开始狗粮推荐问卷
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                      {dog.avatar_url ? (
                        <img 
                          src={dog.avatar_url} 
                          alt={dog.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Dog className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{dog.name}</h3>
                      <p className="text-sm text-gray-500">{dog.breed || '未设置品种'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>生日: {dog.birth_date || '未设置'}</span>
                  {dog.birth_date && (
                    <span className="ml-2 text-orange-500">({calculateAge(dog.birth_date)}岁)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <label className="flex-1 bg-gray-50 text-gray-600 text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpdateAvatar(dog.id, e)}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-1">
                      <Upload className="w-4 h-4" />
                      更换头像
                    </div>
                  </label>
                  <a
                    href="/stool"
                    className="flex-1 bg-orange-50 text-primary text-center py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-all"
                  >
                    大便分析
                  </a>
                  <a
                    href="/meals"
                    className="flex-1 bg-purple-50 text-secondary text-center py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-all"
                  >
                    饮食记录
                  </a>
                </div>
                <button
                  onClick={() => handleStartSurvey(dog)}
                  className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  智能推荐狗粮
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">不知道选哪种狗粮？</h3>
                <p className="opacity-90">回答几个简单问题，为你的小狗定制专属饮食方案</p>
              </div>
              <button
                onClick={() => setShowSurvey(true)}
                className="bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                开始测试
              </button>
            </div>
          </div>
        </>
      )}

      {showAddDog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">添加新小狗</h3>
            <form onSubmit={handleAddDog}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                      {newDog.avatar_preview ? (
                        <img 
                          src={newDog.avatar_preview} 
                          alt="头像预览" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Dog className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    <label className="flex-1">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
                        <Camera className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600">选择图片</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名字</label>
                  <input
                    type="text"
                    required
                    value={newDog.name}
                    onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="例如：土豆"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">品种</label>
                  <input
                    type="text"
                    value={newDog.breed}
                    onChange={(e) => setNewDog({ ...newDog, breed: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="例如：柯基"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生日</label>
                  <input
                    type="date"
                    value={newDog.birth_date}
                    onChange={(e) => setNewDog({ ...newDog, birth_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddDog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-all"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">狗粮智能推荐</h3>
              <button
                onClick={() => setShowSurvey(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!recommendations ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🐶 小狗名字
                    </label>
                    <input
                      type="text"
                      value={surveyAnswers.dog_name}
                      onChange={(e) => handleSurveyChange('dog_name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="请输入小狗名字"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎂 年龄（岁）
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={surveyAnswers.age}
                      onChange={(e) => handleSurveyChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="例如：2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📏 体型大小
                    </label>
                    <select
                      value={surveyAnswers.breed_size}
                      onChange={(e) => handleSurveyChange('breed_size', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="small">小型犬（≤10kg）</option>
                      <option value="medium">中型犬（10-25kg）</option>
                      <option value="large">大型犬（25-40kg）</option>
                      <option value="giant">巨型犬（≥40kg）</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏃 日常活动量
                    </label>
                    <select
                      value={surveyAnswers.activity_level}
                      onChange={(e) => handleSurveyChange('activity_level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="high">高（经常运动、户外活动多）</option>
                      <option value="medium">中等（每天散步1-2次）</option>
                      <option value="low">低（大部分时间在家）</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🤧 是否有食物过敏史？
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="allergy"
                          value="yes"
                          checked={surveyAnswers.allergy === 'yes'}
                          onChange={() => handleSurveyChange('allergy', 'yes')}
                          className="w-4 h-4 text-primary"
                        />
                        <span>是</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="allergy"
                          value="no"
                          checked={surveyAnswers.allergy === 'no'}
                          onChange={() => handleSurveyChange('allergy', 'no')}
                          className="w-4 h-4 text-primary"
                        />
                        <span>否</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🐾 是否有皮肤问题（如瘙痒、皮屑）？
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="skin_issue"
                          value="yes"
                          checked={surveyAnswers.skin_issue === 'yes'}
                          onChange={() => handleSurveyChange('skin_issue', 'yes')}
                          className="w-4 h-4 text-primary"
                        />
                        <span>是</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="skin_issue"
                          value="no"
                          checked={surveyAnswers.skin_issue === 'no'}
                          onChange={() => handleSurveyChange('skin_issue', 'no')}
                          className="w-4 h-4 text-primary"
                        />
                        <span>否</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💩 是否有肠胃敏感（如易软便、呕吐）？
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="digest_issue"
                          value="yes"
                          checked={surveyAnswers.digest_issue === 'yes'}
                          onChange={() => handleSurveyChange('digest_issue', 'yes')}
                          className="w-4 h-4 text-primary"
                        />
                        <span>是</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="digest_issue"
                          value="no"
                          checked={surveyAnswers.digest_issue === 'no'}
                          onChange={() => handleSurveyChange('digest_issue', 'no')}
                          className="w-4 h-4 text-primary"
                        />
                        <span>否</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💰 预算范围（元/斤）
                    </label>
                    <select
                      value={surveyAnswers.budget}
                      onChange={(e) => handleSurveyChange('budget', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="budget_low">平价（≤25元）</option>
                      <option value="budget_mid">中端（25-50元）</option>
                      <option value="budget_high">高端（≥50元）</option>
                      <option value="budget_any">不限制</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSubmitSurvey}
                    disabled={loading || !surveyAnswers.dog_name || !surveyAnswers.age || !surveyAnswers.breed_size || !surveyAnswers.activity_level}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        获取推荐方案
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      为 {surveyAnswers.dog_name} 定制的饮食方案
                    </h4>
                    <div className="whitespace-pre-line text-green-700 leading-relaxed">
                      {recommendations.recommendText}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-4">推荐狗粮类型</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">{rec.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {rec.priority === 'high' ? '高推荐' : '参考'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {rec.key_features.map((feature, fIndex) => (
                              <span key={fIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>蛋白质: {rec.protein_range} | 脂肪: {rec.fat_range}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {recommendations.matchedFoods && recommendations.matchedFoods.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold mb-4">推荐品牌狗粮</h4>
                      <div className="space-y-4">
                        {recommendations.matchedFoods.map((food) => (
                          <div key={food.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{food.brand}</span>
                                <span className="text-gray-500 text-sm">{food.product_name}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{food.features}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-orange-500">
                                  <Star className="w-4 h-4 inline" />
                                  {food.score?.total_score || 'N/A'}分
                                </span>
                                <span className="text-gray-500">{food.price_range}</span>
                              </div>
                            </div>
                            <a
                              href={food.taobao_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all flex items-center gap-1"
                            >
                              去购买
                              <ChevronRight className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={resetSurvey}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      重新测试
                    </button>
                    <button
                      onClick={() => setShowSurvey(false)}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-all"
                    >
                      完成
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
