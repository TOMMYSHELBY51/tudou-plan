import { useState, useEffect } from 'react';
import { Plus, Star, TrendingUp, Loader2, Download, BarChart3, Check, X, ShoppingCart, List, LayoutGrid } from 'lucide-react';

function DogFoodAnalysis() {
  const [foods, setFoods] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [scoringFoodId, setScoringFoodId] = useState(null);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResult, setCompareResult] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [newFood, setNewFood] = useState({
    brand: '',
    product_name: '',
    ingredients: '',
    guaranteed_analysis: ''
  });
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'overview'
  const [allScores, setAllScores] = useState(null);
  const [loadingAllScores, setLoadingAllScores] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dog-foods');
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitPopularFoods = async () => {
    try {
      const res = await fetch('/api/init-popular-foods', { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      fetchFoods();
    } catch (error) {
      console.error('Failed to init foods:', error);
    }
  };

  const handleRefreshPopularFoods = async () => {
    try {
      const res = await fetch('/api/refresh-popular-foods', { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      fetchFoods();
    } catch (error) {
      console.error('Failed to refresh foods:', error);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dog-foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFood),
      });
      const data = await res.json();
      setFoods([data, ...foods]);
      setShowAddFood(false);
      setNewFood({
        brand: '',
        product_name: '',
        ingredients: '',
        guaranteed_analysis: ''
      });
    } catch (error) {
      console.error('Failed to add food:', error);
    }
  };

  const handleScore = async (foodId) => {
    setScoringFoodId(foodId);
    try {
      const res = await fetch(`/api/dog-foods/${foodId}/score`);
      const data = await res.json();
      setScores({ ...scores, [foodId]: data.score });
    } catch (error) {
      console.error('Failed to score food:', error);
    } finally {
      setScoringFoodId(null);
    }
  };

  const toggleSelectFood = (foodId) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
    } else {
      if (selectedFoods.length < 5) {
        setSelectedFoods([...selectedFoods, foodId]);
      }
    }
  };

  const handleCompare = async () => {
    if (selectedFoods.length < 2) {
      alert('请至少选择2款狗粮进行对比');
      return;
    }
    
    setComparing(true);
    try {
      const res = await fetch(`/api/dog-foods/compare?ids=${selectedFoods.join(',')}`);
      const data = await res.json();
      setCompareResult(data);
    } catch (error) {
      console.error('Failed to compare:', error);
    } finally {
      setComparing(false);
    }
  };

  const handleGetAllScores = async () => {
    setLoadingAllScores(true);
    try {
      const res = await fetch('/api/dog-foods/all-scores');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('All scores data:', data);
      setAllScores(data);
    } catch (error) {
      console.error('Failed to get all scores:', error);
      alert('获取评分失败: ' + error.message);
    } finally {
      setLoadingAllScores(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-red-100 text-red-700'
    };
    return colors[grade] || 'bg-gray-100 text-gray-700';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriceRangeColor = (priceRange) => {
    if (priceRange?.includes('高端')) return 'bg-purple-100 text-purple-700';
    if (priceRange?.includes('中高端')) return 'bg-blue-100 text-blue-700';
    if (priceRange?.includes('中端')) return 'bg-green-100 text-green-700';
    if (priceRange?.includes('平价')) return 'bg-gray-100 text-gray-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">狗粮成分分析</h2>
        <div className="flex gap-3">
          <button
            onClick={handleInitPopularFoods}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all shadow-md"
          >
            <Download className="w-5 h-5" />
            导入热门狗粮
          </button>
          <button
            onClick={handleRefreshPopularFoods}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all shadow-md"
          >
            <TrendingUp className="w-5 h-5" />
            刷新数据
          </button>
          <button
            onClick={() => setShowAddFood(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            添加狗粮
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">评分说明</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              列表视图
            </button>
            <button
              onClick={() => {
                setActiveTab('overview');
                if (!allScores) {
                  handleGetAllScores();
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              整体对比
            </button>
          </div>
        </div>
        <p className="text-gray-600 mt-4">
          系统会根据狗粮的成分表（粗蛋白、粗脂肪、粗纤维、粗灰分、水分等）和配料表进行综合评分。
          评分权重可以在设置页面进行调整。
        </p>
        {activeTab === 'list' && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedFoods([]);
                setCompareResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                compareMode
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              {compareMode ? '退出对比' : '对比模式'}
            </button>
            {compareMode && (
              <button
                onClick={handleCompare}
                disabled={selectedFoods.length < 2 || comparing}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all disabled:bg-gray-300"
              >
                {comparing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    对比中...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    对比选中 ({selectedFoods.length}/5)
                  </>
                )}
              </button>
            )}
          </div>
        )}
        {activeTab === 'overview' && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGetAllScores}
              disabled={loadingAllScores}
              className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all disabled:bg-gray-300"
            >
              {loadingAllScores ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  加载中...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  刷新评分
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            14款狗粮整体对比
          </h3>
          
          {loadingAllScores ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : allScores && allScores.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">平均评分</p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.round(allScores.reduce((sum, f) => sum + f.score.total_score, 0) / allScores.length)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">A等级数量</p>
                  <p className="text-3xl font-bold mt-1">
                    {allScores.filter(f => f.score.grade === 'A').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">最高评分</p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.max(...allScores.map(f => f.score.total_score))}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">覆盖品牌</p>
                  <p className="text-3xl font-bold mt-1">{allScores.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">评分等级分布</h4>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map(grade => {
                      const count = allScores.filter(f => f.score.grade === grade).length;
                      const percentage = (count / allScores.length * 100).toFixed(1);
                      const colors = { 'A': 'bg-green-500', 'B': 'bg-blue-500', 'C': 'bg-yellow-500', 'D': 'bg-red-500' };
                      return (
                        <div key={grade}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium ${getGradeColor(grade).split(' ')[1]}`}>{grade}等级</span>
                            <span className="text-gray-600">{count}款 ({percentage}%)</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors[grade]} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">价格区间分布</h4>
                  <div className="space-y-2">
                    {['高端', '中高端', '中端', '平价'].map(range => {
                      const count = allScores.filter(f => f.price_range?.includes(range)).length;
                      const percentage = (count / allScores.length * 100).toFixed(1);
                      const colors = { '高端': 'bg-purple-500', '中高端': 'bg-blue-500', '中端': 'bg-green-500', '平价': 'bg-gray-500' };
                      return (
                        <div key={range}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{range}</span>
                            <span className="text-gray-600">{count}款 ({percentage}%)</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors[range]} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold">排名</th>
                      <th className="text-left py-3 px-4 font-semibold">品牌/产品</th>
                      <th className="text-center py-3 px-4 font-semibold">综合评分</th>
                      <th className="text-center py-3 px-4 font-semibold">等级</th>
                      <th className="text-center py-3 px-4 font-semibold">价格区间</th>
                      <th className="text-left py-3 px-4 font-semibold">价格规格</th>
                      <th className="text-center py-3 px-4 font-semibold">来源</th>
                      <th className="text-center py-3 px-4 font-semibold">购买</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScores.map((food, index) => (
                      <tr key={food.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-primary font-medium">{food.brand}</p>
                          <p className="font-medium text-sm">{food.product_name}</p>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`text-xl font-bold ${getScoreColor(food.score.total_score)}`}>
                            {food.score.total_score}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(food.score.grade)}`}>
                            {food.score.grade}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriceRangeColor(food.price_range)}`}>
                            {food.price_range || '未知'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          {food.price_spec || '-'}
                        </td>
                        <td className="text-center py-3 px-4 text-xs text-gray-600">
                          {food.source || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {food.taobao_link ? (
                            <a
                              href={food.taobao_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-all"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              购买
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">📊 综合分析</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 参与评分的14款狗粮平均评分为 {Math.round(allScores.reduce((sum, f) => sum + f.score.total_score, 0) / allScores.length)} 分</li>
                  <li>• A等级狗粮 {allScores.filter(f => f.score.grade === 'A').length} 款，B等级 {allScores.filter(f => f.score.grade === 'B').length} 款</li>
                  <li>• 最高分 {Math.max(...allScores.map(f => f.score.total_score))} 分（{allScores.find(f => f.score.total_score === Math.max(...allScores.map(f => f.score.total_score)))?.brand}）</li>
                  <li>• 中端价位狗粮占比最高，达 {(allScores.filter(f => f.price_range?.includes('中端')).length / allScores.length * 100).toFixed(0)}%</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无数据，请点击"刷新评分"按钮获取所有狗粮评分</p>
            </div>
          )}
        </div>
      )}

      {compareResult && activeTab === 'list' && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            对比结果
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">排名</th>
                  <th className="text-left py-3 px-4">品牌/产品</th>
                  <th className="text-center py-3 px-4">综合评分</th>
                  <th className="text-center py-3 px-4">等级</th>
                  <th className="text-center py-3 px-4">蛋白质</th>
                  <th className="text-center py-3 px-4">脂肪</th>
                  <th className="text-center py-3 px-4">纤维</th>
                  <th className="text-center py-3 px-4">灰分</th>
                  <th className="text-center py-3 px-4">水分</th>
                  <th className="text-center py-3 px-4">配料</th>
                  <th className="text-left py-3 px-4">价格区间</th>
                  <th className="text-left py-3 px-4">价格规格</th>
                  <th className="text-center py-3 px-4">购买</th>
                </tr>
              </thead>
              <tbody>
                {compareResult.map((food, index) => (
                  <tr key={food.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-primary font-medium">{food.brand}</p>
                      <p className="font-medium">{food.product_name}</p>
                      {food.source && <p className="text-xs text-gray-500">{food.source}</p>}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`text-2xl font-bold ${getScoreColor(food.score.total_score)}`}>
                        {food.score.total_score}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(food.score.grade)}`}>
                        {food.score.grade}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm">
                      {food.score.breakdown.protein.value}%<br/>
                      <span className="text-gray-500">({food.score.breakdown.protein.score}分)</span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm">
                      {food.score.breakdown.fat.value}%<br/>
                      <span className="text-gray-500">({food.score.breakdown.fat.score}分)</span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm">
                      {food.score.breakdown.fiber.value}%<br/>
                      <span className="text-gray-500">({food.score.breakdown.fiber.score}分)</span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm">
                      {food.score.breakdown.ash.value}%<br/>
                      <span className="text-gray-500">({food.score.breakdown.ash.value}分)</span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm">
                      {food.score.breakdown.moisture.value}%<br/>
                      <span className="text-gray-500">({food.score.breakdown.moisture.score}分)</span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm">
                      {food.score.breakdown.ingredient.score}分
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriceRangeColor(food.price_range)}`}>
                        {food.price_range || '未知'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {food.price_spec || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {food.taobao_link ? (
                        <a
                          href={food.taobao_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-all"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          购买
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : foods.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有添加狗粮</h3>
              <p className="text-gray-500 mb-4">点击"导入热门狗粮"按钮一键添加热门产品，或手动添加</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
            <div 
              key={food.id} 
              className={`bg-white rounded-2xl shadow-md p-6 transition-all ${
                compareMode && selectedFoods.includes(food.id) 
                  ? 'ring-2 ring-primary' 
                  : compareMode 
                    ? 'hover:ring-2 hover:ring-gray-300 cursor-pointer' 
                    : ''
              }`}
              onClick={() => compareMode && toggleSelectFood(food.id)}
            >
              {compareMode && (
                <div className="absolute top-4 right-4">
                  {selectedFoods.includes(food.id) ? (
                    <Check className="w-6 h-6 text-primary" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded" />
                  )}
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-primary font-medium">{food.brand}</p>
                  <h3 className="font-bold text-lg">{food.product_name}</h3>
                  {food.source && (
                    <p className="text-xs text-gray-500 mt-1">{food.source}</p>
                  )}
                </div>
                {scores[food.id] && (
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-sm font-bold ${getGradeColor(scores[food.id].grade)}`}>
                      {scores[food.id].grade}
                    </span>
                    <p className={`text-2xl font-bold mt-1 ${getScoreColor(scores[food.id].total_score)}`}>
                      {scores[food.id].total_score}
                    </p>
                  </div>
                )}
              </div>

              {food.features && (
                <div className="mb-3">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                    {food.features}
                  </span>
                </div>
              )}

              {food.price_range && (
                <div className="mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${getPriceRangeColor(food.price_range)}`}>
                    {food.price_range}
                  </span>
                </div>
              )}

              {food.price_spec && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">价格规格：</p>
                  <p className="text-xs text-gray-600">{food.price_spec}</p>
                </div>
              )}

              {food.ingredients && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">配料表：</p>
                  <p className="text-xs text-gray-500 line-clamp-3">{food.ingredients}</p>
                </div>
              )}

              {food.guaranteed_analysis && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">保证值：</p>
                  <p className="text-xs text-gray-500">{food.guaranteed_analysis}</p>
                </div>
              )}

              {scores[food.id] && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>蛋白质: <span className="font-medium">{scores[food.id].breakdown.protein.value}%</span> ({scores[food.id].breakdown.protein.score}分)</div>
                    <div>脂肪: <span className="font-medium">{scores[food.id].breakdown.fat.value}%</span> ({scores[food.id].breakdown.fat.score}分)</div>
                    <div>纤维: <span className="font-medium">{scores[food.id].breakdown.fiber.value}%</span> ({scores[food.id].breakdown.fiber.score}分)</div>
                    <div>灰分: <span className="font-medium">{scores[food.id].breakdown.ash.value}%</span> ({scores[food.id].breakdown.ash.score}分)</div>
                    <div>水分: <span className="font-medium">{scores[food.id].breakdown.moisture.value}%</span> ({scores[food.id].breakdown.moisture.score}分)</div>
                    <div>配料: <span className="font-medium">评分</span> ({scores[food.id].breakdown.ingredient.score}分)</div>
                  </div>
                </div>
              )}

              {!compareMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScore(food.id);
                  }}
                  disabled={scoringFoodId === food.id}
                  className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2 mb-2"
                >
                  {scoringFoodId === food.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      评分中...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      {scores[food.id] ? '重新评分' : '开始评分'}
                    </>
                  )}
                </button>
              )}

              {food.taobao_link && (
                <a
                  href={food.taobao_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-secondary text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                  onClick={(e) => compareMode && e.stopPropagation()}
                >
                  <ShoppingCart className="w-4 h-4" />
                  淘宝购买
                </a>
              )}
            </div>
          ))}
            </div>
          )}
        </>
      )}

      {showAddFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-6">添加狗粮产品</h3>
            <form onSubmit={handleAddFood}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                    <input
                      type="text"
                      required
                      value={newFood.brand}
                      onChange={(e) => setNewFood({ ...newFood, brand: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="例如：皇家"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
                    <input
                      type="text"
                      required
                      value={newFood.product_name}
                      onChange={(e) => setNewFood({ ...newFood, product_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="例如：小型犬成犬粮"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">配料表</label>
                  <textarea
                    value={newFood.ingredients}
                    onChange={(e) => setNewFood({ ...newFood, ingredients: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                    placeholder="例如：鸡肉、玉米、小麦、鸡肉脂肪、鱼油..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">保证分析值</label>
                  <textarea
                    value={newFood.guaranteed_analysis}
                    onChange={(e) => setNewFood({ ...newFood, guaranteed_analysis: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                    placeholder="例如：粗蛋白质≥26%，粗脂肪≥14%，粗纤维≤4.5%，粗灰分≤8%，水分≤10%"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddFood(false)}
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
    </div>
  );
}

export default DogFoodAnalysis;
