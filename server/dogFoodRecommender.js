export const dogFoodRecommendations = {
  puppy: {
    name: "幼犬粮",
    description: "专为成长发育期的小狗设计",
    key_features: ["高蛋白含量", "高钙磷比例", "DHA益智因子", "易消化配方"],
    protein_range: "≥30%",
    fat_range: "≥18%",
    suitable_for: "0-12个月幼犬"
  },
  adult: {
    name: "成犬粮",
    description: "满足成年犬日常营养需求",
    key_features: ["均衡营养", "维护肌肉", "支持关节健康", "控制体重"],
    protein_range: "≥26%",
    fat_range: "≥14%",
    suitable_for: "1-7岁成犬"
  },
  senior: {
    name: "老年犬粮",
    description: "关爱老年犬健康",
    key_features: ["易消化蛋白质", "关节保护", "抗氧化配方", "低热量"],
    protein_range: "≥24%",
    fat_range: "≥12%",
    suitable_for: "7岁以上老年犬"
  },
  small: {
    name: "小型犬粮",
    description: "针对小型犬特殊需求",
    key_features: ["小颗粒设计", "高能量密度", "牙齿护理", "毛发护理"],
    protein_range: "≥28%",
    fat_range: "≥16%",
    suitable_for: "体重≤10kg小型犬"
  },
  large: {
    name: "大型犬粮",
    description: "支持大型犬骨骼健康",
    key_features: ["关节保护配方", "控制生长速度", "大颗粒设计", "强健骨骼"],
    protein_range: "≥26%",
    fat_range: "≥14%",
    suitable_for: "体重≥25kg大型犬"
  },
  active: {
    name: "高活动量犬粮",
    description: "为运动犬提供充足能量",
    key_features: ["高能量", "快速恢复", "肌肉支持", "电解质平衡"],
    protein_range: "≥30%",
    fat_range: "≥20%",
    suitable_for: "运动量较大的犬只"
  },
  low_activity: {
    name: "低活动量/减肥犬粮",
    description: "帮助控制体重",
    key_features: ["低热量", "高纤维", "饱腹感强", "体重管理"],
    protein_range: "≥24%",
    fat_range: "≤12%",
    suitable_for: "室内犬、体重超标犬"
  },
  sensitive_skin: {
    name: "皮肤敏感专用粮",
    description: "改善皮肤问题",
    key_features: ["Omega-3丰富", "单一蛋白源", "无谷物", "添加益生菌"],
    protein_range: "≥28%",
    fat_range: "≥16%",
    suitable_for: "皮肤敏感、易过敏犬只"
  },
  sensitive_digest: {
    name: "肠胃敏感专用粮",
    description: "呵护消化系统",
    key_features: ["易消化蛋白", "益生菌添加", "低致敏性", "肠道保护"],
    protein_range: "≥26%",
    fat_range: "≥14%",
    suitable_for: "肠胃敏感、易软便犬只"
  },
  grain_free: {
    name: "无谷配方粮",
    description: "不含谷物更健康",
    key_features: ["无玉米小麦", "高肉含量", "低GI配方", "易消化"],
    protein_range: "≥30%",
    fat_range: "≥16%",
    suitable_for: "谷物过敏、追求天然饮食犬只"
  }
};

export const analyzeDogFood = (answers) => {
  const recommendations = [];
  const breedSize = answers.breed_size;
  const age = answers.age;
  const activityLevel = answers.activity_level;
  const hasAllergy = answers.allergy === 'yes';
  const hasSkinIssue = answers.skin_issue === 'yes';
  const hasDigestIssue = answers.digest_issue === 'yes';
  const budget = answers.budget;

  if (age < 1) {
    recommendations.push({ ...dogFoodRecommendations.puppy, priority: 'high' });
  } else if (age >= 7) {
    recommendations.push({ ...dogFoodRecommendations.senior, priority: 'high' });
  } else {
    recommendations.push({ ...dogFoodRecommendations.adult, priority: 'high' });
  }

  if (breedSize === 'small') {
    recommendations.push({ ...dogFoodRecommendations.small, priority: 'high' });
  } else if (breedSize === 'large' || breedSize === 'giant') {
    recommendations.push({ ...dogFoodRecommendations.large, priority: 'high' });
  }

  if (activityLevel === 'high') {
    recommendations.push({ ...dogFoodRecommendations.active, priority: 'high' });
  } else if (activityLevel === 'low') {
    recommendations.push({ ...dogFoodRecommendations.low_activity, priority: 'medium' });
  }

  if (hasAllergy || hasSkinIssue) {
    recommendations.push({ ...dogFoodRecommendations.sensitive_skin, priority: 'high' });
    recommendations.push({ ...dogFoodRecommendations.grain_free, priority: 'medium' });
  }

  if (hasDigestIssue) {
    recommendations.push({ ...dogFoodRecommendations.sensitive_digest, priority: 'high' });
  }

  const uniqueRecs = recommendations.filter((rec, index, self) =>
    index === self.findIndex(t => t.name === rec.name)
  );

  return uniqueRecs.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export const generateRecommendText = (answers, dogName) => {
  const age = answers.age;
  const breedSize = answers.breed_size;
  const activityLevel = answers.activity_level;
  const hasAllergy = answers.allergy === 'yes';
  const hasSkinIssue = answers.skin_issue === 'yes';
  const hasDigestIssue = answers.digest_issue === 'yes';
  const budget = answers.budget;

  let text = `亲爱的${dogName}家长，根据您的描述，我们为${dogName}推荐以下饮食方案：\n\n`;

  text += `【基础判断】\n`;
  if (age < 1) {
    text += `• ${dogName}目前${Math.round(age * 12)}个月大，处于快速成长期，需要高蛋白高能量的幼犬粮支持发育。\n`;
  } else if (age >= 7) {
    text += `• ${dogName}已经${age}岁啦，进入了中老年阶段，需要易消化、关节保护的老年犬配方。\n`;
  } else {
    text += `• ${dogName}正值壮年(${age}岁)，需要均衡营养的成犬粮来维持健康活力。\n`;
  }

  if (breedSize === 'small') {
    text += `• 作为小型犬，${dogName}适合小颗粒、高能量密度的配方，方便进食且能满足高代谢需求。\n`;
  } else if (breedSize === 'large' || breedSize === 'giant') {
    text += `• ${dogName}是大型犬，需要特别关注关节健康，建议选择含葡萄糖胺和软骨素的配方。\n`;
  }

  text += `\n【营养需求】\n`;
  if (activityLevel === 'high') {
    text += `• ${dogName}运动量较大，需要高蛋白(≥30%)高脂肪(≥20%)的配方来补充能量。\n`;
  } else if (activityLevel === 'low') {
    text += `• ${dogName}日常活动量较少，建议选择低热量、高纤维配方，帮助控制体重。\n`;
  } else {
    text += `• ${dogName}活动量适中，选择均衡营养的标准配方即可。\n`;
  }

  if (hasAllergy) {
    text += `• ${dogName}有过敏史，建议选择单一蛋白源、无谷物的低敏配方。\n`;
  }
  if (hasSkinIssue) {
    text += `• ${dogName}有皮肤问题，推荐富含Omega-3的配方，可以帮助改善皮肤健康。\n`;
  }
  if (hasDigestIssue) {
    text += `• ${dogName}肠胃比较敏感，建议选择易消化蛋白和益生菌添加的配方。\n`;
  }

  text += `\n【选购建议】\n`;
  text += `1. 查看成分表，确保动物蛋白排在前几位\n`;
  text += `2. 根据预算选择合适价位的产品\n`;
  text += `3. 首次更换建议逐步过渡，观察${dogName}的适应情况\n`;
  text += `4. 保持充足的新鲜饮水\n`;

  return text;
};
