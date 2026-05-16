const popularDogFoods = [
  {
    brand: "渴望",
    product_name: "原味鸡肉全犬粮",
    ingredients: "新鲜鸡肉(11%)、鸡肉粉(10%)、火鸡肉粉(10%)、新鲜鸡肝(5%)、完整鲱鱼(4%)、新鲜鸡心(4%)、新鲜火鸡肉(4%)、鸡脂肪(4%)、完整鸡蛋(4%)、新鲜比目鱼(4%)、新鲜火鸡肝(3%)、鲱鱼粉(3%)、鸡软骨(3%)、鸡肝油(1%)、南瓜、冬南瓜、胡萝卜、菠菜、花椰菜、苹果、蔓越莓、蓝莓、海带、甘草根、姜黄、牛蒡根、薰衣草、万寿菊、迷迭香",
    guaranteed_analysis: "粗蛋白质≥38%，粗脂肪≥18%，粗纤维≤5%，粗灰分≤9%，水分≤10%，钙≥1.6%，磷≥1.3%，Omega-6≥3.5%，Omega-3≥1%",
    price_range: "高端(约80-100元/斤)",
    price_spec: "1kg: ¥188 | 2.27kg: ¥408 | 6kg: ¥1030",
    taobao_link: "https://s.taobao.com/search?q=渴望原味鸡肉全犬粮",
    source: "加拿大进口",
    features: "鲜肉占比85%，无谷低敏，高蛋白配方"
  },
  {
    brand: "爱肯拿",
    product_name: "鸭肉梨配方全犬粮",
    ingredients: "新鲜鸭肉(12%)、鸭肉粉(10%)、火鸡肉粉(10%)、鸡肉粉(10%)、新鲜鸡肝(4%)、完整鲱鱼(4%)、新鲜鸡心(4%)、鸡脂肪(4%)、完整鸡蛋(4%)、新鲜比目鱼(4%)、鲱鱼粉(3%)、鸡软骨(3%)、南瓜、冬南瓜、梨(4%)、胡萝卜、菠菜、花椰菜、苹果、蔓越莓、蓝莓、海带",
    guaranteed_analysis: "粗蛋白质≥31%，粗脂肪≥17%，粗纤维≤5%，粗灰分≤8%，水分≤10%，钙≥1.4%，磷≥1.1%，Omega-6≥2.5%，Omega-3≥0.8%",
    price_range: "高端(约60-80元/斤)",
    price_spec: "1kg: ¥149 | 2.27kg: ¥339 | 6kg: ¥799",
    taobao_link: "https://s.taobao.com/search?q=爱肯拿鸭肉梨配方全犬粮",
    source: "加拿大进口",
    features: "鲜肉占比高，无谷配方，清热降火"
  },
  {
    brand: "比乐",
    product_name: "原味鲜无谷成犬粮",
    ingredients: "鲜鸡肉(25%)、鸡肉粉(20%)、鸭肉粉(15%)、红薯、豌豆、鸡脂肪、鱼油、胡萝卜、南瓜、维生素、矿物质、益生菌",
    guaranteed_analysis: "粗蛋白质≥36%，粗脂肪≥16%，粗纤维≤5%，粗灰分≤9%，水分≤10%，钙≥1.4%，磷≥1.1%",
    price_range: "中端(约30-40元/斤)",
    price_spec: "1.5kg: ¥98 | 4kg: ¥239 | 10kg: ¥499",
    taobao_link: "https://s.taobao.com/search?q=比乐原味鲜无谷成犬粮",
    source: "国产",
    features: "国货精品，无谷配方，30%鲜肉添加"
  },
  {
    brand: "荒野盛宴",
    product_name: "狼王三文鱼无谷全犬粮",
    ingredients: "三文鱼(25%)、鲑鱼粉(15%)、鸡肉粉(12%)、红薯、豌豆、鸡脂肪、鱼油、蓝莓、蔓越莓、维生素、矿物质",
    guaranteed_analysis: "粗蛋白质≥28%，粗脂肪≥18%，粗纤维≤4%，粗灰分≤7%，水分≤10%，钙≥1.2%，磷≥1.0%",
    price_range: "高端(约50-70元/斤)",
    price_spec: "1.22kg: ¥159 | 2.27kg: ¥299 | 6kg: ¥699",
    taobao_link: "https://s.taobao.com/search?q=荒野盛宴狼王三文鱼无谷全犬粮",
    source: "美国进口",
    features: "三文鱼配方，低敏美毛，无谷配方"
  },
  {
    brand: "皇家",
    product_name: "中型犬成犬粮",
    ingredients: "玉米、鸡肉粉、玉米蛋白粉、动物脂肪、玉米麸质、矿物质、鱼油、大豆油、维生素、氨基酸、抗氧化剂",
    guaranteed_analysis: "粗蛋白质≥26%，粗脂肪≥14%，粗纤维≤4.5%，粗灰分≤8%，水分≤10%，钙≥1.0%，磷≥0.8%",
    price_range: "中高端(约30-40元/斤)",
    price_spec: "1.5kg: ¥92 | 4kg: ¥228 | 10kg: ¥488",
    taobao_link: "https://s.taobao.com/search?q=皇家中型犬成犬粮",
    source: "法国品牌/国内生产",
    features: "精准营养，犬种定制配方"
  },
  {
    brand: "冠能",
    product_name: "成犬全价粮鸡肉配方",
    ingredients: "鸡肉粉、玉米蛋白粉、玉米、动物脂肪、玉米麸质、鱼油、维生素、矿物质、益生菌、抗氧化剂",
    guaranteed_analysis: "粗蛋白质≥30%，粗脂肪≥18%，粗纤维≤4%，粗灰分≤8%，水分≤10%，钙≥1.2%，磷≥1.0%",
    price_range: "中端(约25-35元/斤)",
    price_spec: "1.8kg: ¥95 | 4.5kg: ¥219 | 10kg: ¥439",
    taobao_link: "https://s.taobao.com/search?q=冠能成犬全价粮鸡肉配方",
    source: "美国品牌/国内生产",
    features: "运动犬配方，MCT中链脂肪酸"
  },
  {
    brand: "伯纳天纯",
    product_name: "鸭肉梨配方全犬粮",
    ingredients: "鲜鸭肉(28%)、鸭肉粉(15%)、鸡肉粉(10%)、红薯、豌豆、鸡脂肪、梨(5%)、胡萝卜、南瓜、鱼油、维生素、矿物质、益生菌",
    guaranteed_analysis: "粗蛋白质≥32%，粗脂肪≥15%，粗纤维≤5%，粗灰分≤9%，水分≤10%，钙≥1.3%，磷≥1.0%",
    price_range: "中端(约35-45元/斤)",
    price_spec: "1.5kg: ¥108 | 4kg: ¥249 | 10kg: ¥549",
    taobao_link: "https://s.taobao.com/search?q=伯纳天纯鸭肉梨配方全犬粮",
    source: "国产",
    features: "低温烘焙工艺，冻干涂层技术"
  },
  {
    brand: "馋不腻",
    product_name: "鸡肉无谷全犬粮",
    ingredients: "鲜鸡肉(46%)、鸡肉粉(15%)、兔肉(15%)、红薯、豌豆、鸡脂肪、鱼油、胡萝卜、南瓜、维生素、矿物质、益生菌(30亿)",
    guaranteed_analysis: "粗蛋白质≥32%，粗脂肪≥14%，粗纤维≤5%，粗灰分≤9%，水分≤10%，钙≥1.2%，磷≥0.9%",
    price_range: "中端(约25-35元/斤)",
    price_spec: "1.5kg: ¥89 | 3kg: ¥169 | 10kg: ¥499",
    taobao_link: "https://s.taobao.com/search?q=馋不腻鸡肉无谷全犬粮",
    source: "国产",
    features: "单一肉源，酶解工艺，肠胃敏感犬适配"
  },
  {
    brand: "宠率",
    product_name: "无谷烘焙全犬粮",
    ingredients: "鲜鸡肉(45%)、鲜鸡胸肉(15%)、鹿肉(8.8%)、红薯、豌豆、鸡脂肪、鱼油、胡萝卜、维生素、矿物质",
    guaranteed_analysis: "粗蛋白质≥35%，粗脂肪≥15%，粗纤维≤5%，粗灰分≤9%，水分≤10%，钙≥1.4%，磷≥1.1%",
    price_range: "中端(约17-25元/斤)",
    price_spec: "1.75kg: ¥89 | 7kg: ¥299",
    taobao_link: "https://s.taobao.com/search?q=宠率无谷烘焙全犬粮",
    source: "国产",
    features: "低温烘焙，动物原料占比82.8%"
  },
  {
    brand: "鲜朗",
    product_name: "低温烘焙全犬粮",
    ingredients: "鲜鸡肉(40%)、鸡肉粉(20%)、鲜鸭肉(15%)、红薯、豌豆、鸡脂肪、鱼油、胡萝卜、维生素、矿物质",
    guaranteed_analysis: "粗蛋白质≥34%，粗脂肪≥16%，粗纤维≤5%，粗灰分≤8%，水分≤10%，钙≥1.3%，磷≥1.0%",
    price_range: "中端(约30-40元/斤)",
    price_spec: "1.75kg: ¥99 | 3.5kg: ¥189 | 7kg: ¥369",
    taobao_link: "https://s.taobao.com/search?q=鲜朗低温烘焙全犬粮",
    source: "国产",
    features: "90℃低温慢烘，鲜肉占比81%"
  },
  {
    brand: "比瑞吉",
    product_name: "鸭肉瓜六去泪痕配方",
    ingredients: "鸭肉(25%)、鸡肉粉(15%)、玉米、大米、鸭脂肪、南瓜、冬瓜、黄瓜、丝瓜、苦瓜、西瓜(共6%)、维生素、矿物质",
    guaranteed_analysis: "粗蛋白质≥28%，粗脂肪≥14%，粗纤维≤5%，粗灰分≤8%，水分≤10%，钙≥1.0%，磷≥0.8%",
    price_range: "中端(约25-35元/斤)",
    price_spec: "1.5kg: ¥89 | 4kg: ¥209 | 10kg: ¥459",
    taobao_link: "https://s.taobao.com/search?q=比瑞吉鸭肉瓜六去泪痕配方",
    source: "国产",
    features: "去泪痕专利配方，清热降火"
  },
  {
    brand: "网易严选",
    product_name: "全价全犬粮",
    ingredients: "鲜鸡肉(35%)、鸡肉粉(20%)、鲜鸭肉(15%)、三文鱼(10%)、红薯、豌豆、鸡脂肪、鱼油、维生素、矿物质",
    guaranteed_analysis: "粗蛋白质≥32%，粗脂肪≥15%，粗纤维≤5%，粗灰分≤9%，水分≤10%，钙≥1.2%，磷≥0.9%",
    price_range: "中端(约20-30元/斤)",
    price_spec: "1.8kg: ¥79 | 7.2kg: ¥279",
    taobao_link: "https://s.taobao.com/search?q=网易严选全价全犬粮",
    source: "国产",
    features: "90%动物成分，65℃低温慢煮"
  },
  {
    brand: "疯狂小狗",
    product_name: "冻干夹心全犬粮",
    ingredients: "鸡肉粉(30%)、玉米、大米、鸡脂肪、冻干鸡肉(5%)、冻干鸭肉(3%)、冻干牛肉(2%)、维生素、矿物质",
    guaranteed_analysis: "粗蛋白质≥28%，粗脂肪≥14%，粗纤维≤5%，粗灰分≤8%，水分≤10%，钙≥1.0%，磷≥0.8%",
    price_range: "平价(约15-20元/斤)",
    price_spec: "1.5kg: ¥49 | 10kg: ¥229",
    taobao_link: "https://s.taobao.com/search?q=疯狂小狗冻干夹心全犬粮",
    source: "国产",
    features: "冻干夹心工艺，适口性好"
  },
  {
    brand: "希尔思",
    product_name: "成犬鸡肉配方",
    ingredients: "鸡肉粉、玉米、小麦、动物脂肪、玉米麸质、维生素、矿物质、抗氧化剂",
    guaranteed_analysis: "粗蛋白质≥25%，粗脂肪≥15%，粗纤维≤4%，粗灰分≤7%，水分≤10%，钙≥0.8%，磷≥0.6%",
    price_range: "中高端(约35-45元/斤)",
    price_spec: "1.5kg: ¥108 | 4kg: ¥269 | 10kg: ¥599",
    taobao_link: "https://s.taobao.com/search?q=希尔思成犬鸡肉配方",
    source: "美国品牌/国内生产",
    features: "科学配方，兽医推荐"
  }
];

export default popularDogFoods;
