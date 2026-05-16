import { useState, useEffect } from 'react';
import { Plus, Dog, Calendar, AlertCircle, CheckCircle, Upload, Camera } from 'lucide-react';

function Dashboard() {
  const [dogs, setDogs] = useState([]);
  const [showAddDog, setShowAddDog] = useState(false);
  const [newDog, setNewDog] = useState({ name: '', breed: '', birth_date: '', avatar_file: null, avatar_preview: null });

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

  const getLatestStoolStatus = (dogId) => {
    return null;
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>
          ))}
        </div>
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
    </div>
  );
}

export default Dashboard;
