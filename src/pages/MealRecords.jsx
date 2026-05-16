import { useState, useEffect } from 'react';
import { Plus, Utensils, Calendar, Trash2 } from 'lucide-react';

function MealRecords() {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState('');
  const [records, setRecords] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    meal_type: 'breakfast',
    food_description: '',
    food_brand: '',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchDogs();
  }, []);

  useEffect(() => {
    if (selectedDog) {
      fetchRecords(selectedDog);
    }
  }, [selectedDog]);

  const fetchDogs = async () => {
    try {
      const res = await fetch('/api/dogs');
      const data = await res.json();
      setDogs(data);
      if (data.length > 0) {
        setSelectedDog(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch dogs:', error);
    }
  };

  const fetchRecords = async (dogId) => {
    try {
      const res = await fetch(`/api/dogs/${dogId}/meal-records`);
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/meal-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMeal, dog_id: selectedDog }),
      });
      const data = await res.json();
      setRecords([data, ...records]);
      setShowAddMeal(false);
      setNewMeal({
        meal_type: 'breakfast',
        food_description: '',
        food_brand: '',
        amount: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const getMealIcon = (mealType) => {
    return <Utensils className="w-5 h-5 text-primary" />;
  };

  const getMealTypeName = (type) => {
    const types = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '零食'
    };
    return types[type] || type;
  };

  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-700',
      lunch: 'bg-orange-100 text-orange-700',
      dinner: 'bg-purple-100 text-purple-700',
      snack: 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const groupRecordsByDate = (records) => {
    const groups = {};
    records.forEach((record) => {
      const date = new Date(record.recorded_at).toLocaleDateString('zh-CN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    return groups;
  };

  const groupedRecords = groupRecordsByDate(records);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">饮食记录</h2>
        <button
          onClick={() => setShowAddMeal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          添加记录
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">选择小狗</label>
        <select
          value={selectedDog}
          onChange={(e) => setSelectedDog(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent max-w-xs"
        >
          {dogs.map((dog) => (
            <option key={dog.id} value={dog.id}>
              {dog.name}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(groupedRecords).length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <Utensils className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有饮食记录</h3>
          <p className="text-gray-500 mb-4">点击上方按钮添加今天的饮食记录</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([date, dayRecords]) => (
            <div key={date} className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {date}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMealTypeColor(record.meal_type)}`}>
                        {getMealTypeName(record.meal_type)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 mb-1">{record.food_description}</p>
                    {record.food_brand && (
                      <p className="text-sm text-gray-500 mb-1">品牌: {record.food_brand}</p>
                    )}
                    {record.amount && (
                      <p className="text-sm text-gray-500 mb-2">用量: {record.amount}</p>
                    )}
                    {record.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">添加饮食记录</h3>
            <form onSubmit={handleAddMeal}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">餐次</label>
                  <select
                    value={newMeal.meal_type}
                    onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="breakfast">早餐</option>
                    <option value="lunch">午餐</option>
                    <option value="dinner">晚餐</option>
                    <option value="snack">零食</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">食物描述</label>
                  <input
                    type="text"
                    required
                    value={newMeal.food_description}
                    onChange={(e) => setNewMeal({ ...newMeal, food_description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="例如：皇家狗粮 + 鸡胸肉"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">品牌（可选）</label>
                  <input
                    type="text"
                    value={newMeal.food_brand}
                    onChange={(e) => setNewMeal({ ...newMeal, food_brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="例如：皇家"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用量（可选）</label>
                  <input
                    type="text"
                    value={newMeal.amount}
                    onChange={(e) => setNewMeal({ ...newMeal, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="例如：100克"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
                  <textarea
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="2"
                    placeholder="其他备注信息"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddMeal(false)}
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

export default MealRecords;
