export async function scoreDogFood(food, weights) {
  try {
    const ingredients = food.ingredients || '';
    const guaranteedAnalysis = food.guaranteed_analysis || '';

    const proteinMatch = guaranteedAnalysis.match(/粗蛋白.*?(\d+(?:\.\d+)?)%/i) ||
                        guaranteedAnalysis.match(/protein.*?(\d+(?:\.\d+)?)%/i);
    const fatMatch = guaranteedAnalysis.match(/粗脂肪.*?(\d+(?:\.\d+)?)%/i) ||
                    guaranteedAnalysis.match(/fat.*?(\d+(?:\.\d+)?)%/i);
    const fiberMatch = guaranteedAnalysis.match(/粗纤维.*?(\d+(?:\.\d+)?)%/i) ||
                      guaranteedAnalysis.match(/fiber.*?(\d+(?:\.\d+)?)%/i);
    const ashMatch = guaranteedAnalysis.match(/粗灰分.*?(\d+(?:\.\d+)?)%/i) ||
                    guaranteedAnalysis.match(/ash.*?(\d+(?:\.\d+)?)%/i);
    const moistureMatch = guaranteedAnalysis.match(/水分.*?(\d+(?:\.\d+)?)%/i) ||
                         guaranteedAnalysis.match(/moisture.*?(\d+(?:\.\d+)?)%/i);

    const protein = proteinMatch ? parseFloat(proteinMatch[1]) : 25;
    const fat = fatMatch ? parseFloat(fatMatch[1]) : 15;
    const fiber = fiberMatch ? parseFloat(fiberMatch[1]) : 4;
    const ash = ashMatch ? parseFloat(ashMatch[1]) : 8;
    const moisture = moistureMatch ? parseFloat(moistureMatch[1]) : 10;

    let proteinScore = Math.min(100, (protein / 30) * 100);
    let fatScore = Math.min(100, (fat / 20) * 100);
    let fiberScore = fiber <= 6 ? (fiber / 6) * 100 : Math.max(0, 100 - (fiber - 6) * 10);
    let ashScore = ash <= 10 ? (1 - ash / 100) * 100 : Math.max(0, 70 - ash);
    let moistureScore = moisture <= 12 ? 100 : Math.max(0, 100 - (moisture - 12) * 5);

    let ingredientScore = 50;
    const harmfulIngredients = ['BHA', 'BHT', 'ethoxyquin', 'TBHQ', 'propylene glycol'];
    const suspiciousIngredients = ['corn', 'wheat', 'soy', 'by-product'];
    const qualityIngredients = ['chicken', 'beef', 'salmon', 'lamb', 'real meat'];

    harmfulIngredients.forEach(ing => {
      if (ingredients.toLowerCase().includes(ing.toLowerCase())) {
        ingredientScore -= 20;
      }
    });

    suspiciousIngredients.forEach(ing => {
      if (ingredients.toLowerCase().includes(ing.toLowerCase())) {
        ingredientScore -= 5;
      }
    });

    qualityIngredients.forEach(ing => {
      if (ingredients.toLowerCase().includes(ing.toLowerCase())) {
        ingredientScore += 10;
      }
    });

    ingredientScore = Math.max(0, Math.min(100, ingredientScore));

    const totalWeight = weights.protein_weight + weights.fat_weight + weights.fiber_weight +
                       weights.ash_weight + weights.moisture_weight + weights.price_weight;

    const normalizedWeights = {
      protein: weights.protein_weight / totalWeight,
      fat: weights.fat_weight / totalWeight,
      fiber: weights.fiber_weight / totalWeight,
      ash: weights.ash_weight / totalWeight,
      moisture: weights.moisture_weight / totalWeight,
      ingredient: weights.price_weight / totalWeight
    };

    const totalScore = (
      proteinScore * normalizedWeights.protein +
      fatScore * normalizedWeights.fat +
      fiberScore * normalizedWeights.fiber +
      ashScore * normalizedWeights.ash +
      moistureScore * normalizedWeights.moisture +
      ingredientScore * normalizedWeights.ingredient
    );

    return {
      total_score: Math.round(totalScore),
      breakdown: {
        protein: { value: protein, score: Math.round(proteinScore) },
        fat: { value: fat, score: Math.round(fatScore) },
        fiber: { value: fiber, score: Math.round(fiberScore) },
        ash: { value: ash, score: Math.round(ashScore) },
        moisture: { value: moisture, score: Math.round(moistureScore) },
        ingredient: { score: Math.round(ingredientScore) }
      },
      grade: totalScore >= 80 ? 'A' : totalScore >= 60 ? 'B' : totalScore >= 40 ? 'C' : 'D'
    };
  } catch (error) {
    console.error('Scoring error:', error);
    throw error;
  }
}
