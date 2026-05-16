import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2 } from 'lucide-react';

function Settings() {
  const [weights, setWeights] = useState({
    protein_weight: 30,
    fat_weight: 20,
    fiber_weight: 15,
    ash_weight: 10,
    moisture_weight: 10,
    price_weight: 15
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const res = await fetch('/api/scoring-weights');
      const data = await res.json();
      setWeights(data);
    } catch (error) {
      console.error('Failed to fetch weights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/scoring-weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save weights:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleWeightChange = (key, value) => {
    setWeights({ ...weights, [key]: parseFloat(value) || 0 });
  };

  const totalWeight = weights.protein_weight + weights.fat_weight + weights.fiber_weight +
                      weights.ash_weight + weights.moisture_weight + weights.price_weight;

  const getWeightColor = (weight) => {
    if (weight >= 30) return 'bg-red-100';
    if (weight >= 20) return 'bg-orange-100';
    if (weight >= 10) return 'bg-blue-100';
    return 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">评分权重设置</h2>

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold text-lg">狗粮评分权重配置</h3>
            <p className="text-sm text-gray-500">调整各成分在综合评分中的权重占比</p>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { key: 'protein_weight', label: '粗蛋白', description: '蛋白质含量，狗狗的主要营养来源', max: 50 },
            { key: 'fat_weight', label: '粗脂肪', description: '提供能量和必需脂肪酸', max: 40 },
            { key: 'fiber_weight', label: '粗纤维', description: '促进消化系统健康', max: 30 },
            { key: 'ash_weight', label: '粗灰分', description: '矿物质含量指标', max: 20 },
            { key: 'moisture_weight', label: '水分', description: '含水量影响营养密度', max: 20 },
            { key: 'price_weight', label: '配料评分', description: '根据配料表评估食材质量', max: 40 },
          ].map(({ key, label, description, max }) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="font-medium text-gray-800">{label}</label>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={max}
                    value={weights[key]}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getWeightColor(weights[key])}`}
                  style={{ width: `${(weights[key] / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">权重总计：</span>
            <span className={`font-bold text-lg ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
          </div>
          {totalWeight !== 100 && (
            <p className="text-sm text-red-500 mt-2">
              权重总和必须等于100%，请调整各成分权重
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || totalWeight !== 100}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                保存设置
              </>
            )}
          </button>
          {saved && (
            <span className="text-green-600 font-medium">保存成功！</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mt-8">
        <h3 className="font-semibold text-lg mb-4">建议权重配置</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setWeights({
              protein_weight: 30,
              fat_weight: 20,
              fiber_weight: 15,
              ash_weight: 10,
              moisture_weight: 10,
              price_weight: 15
            })}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-left"
          >
            <p className="font-medium">均衡营养型</p>
            <p className="text-xs text-gray-500">注重营养均衡</p>
          </button>
          <button
            onClick={() => setWeights({
              protein_weight: 40,
              fat_weight: 25,
              fiber_weight: 10,
              ash_weight: 5,
              moisture_weight: 5,
              price_weight: 15
            })}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-left"
          >
            <p className="font-medium">高蛋白型</p>
            <p className="text-xs text-gray-500">适合运动量大的狗狗</p>
          </button>
          <button
            onClick={() => setWeights({
              protein_weight: 25,
              fat_weight: 15,
              fiber_weight: 20,
              ash_weight: 15,
              moisture_weight: 15,
              price_weight: 10
            })}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-left"
          >
            <p className="font-medium">消化健康型</p>
            <p className="text-xs text-gray-500">注重肠胃健康</p>
          </button>
          <button
            onClick={() => setWeights({
              protein_weight: 20,
              fat_weight: 15,
              fiber_weight: 10,
              ash_weight: 10,
              moisture_weight: 10,
              price_weight: 35
            })}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-left"
          >
            <p className="font-medium">配料质量型</p>
            <p className="text-xs text-gray-500">更注重食材来源</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
