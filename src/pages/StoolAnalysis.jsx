import { useState, useEffect } from 'react';
import { Upload, Dog, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

function StoolAnalysis() {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [records, setRecords] = useState([]);
  const [result, setResult] = useState(null);

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
      const res = await fetch(`/api/dogs/${dogId}/stool-records`);
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !selectedDog) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('dog_id', selectedDog);

    try {
      const res = await fetch('/api/stool-analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      fetchRecords(selectedDog);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case '健康':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case '轻微异常':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case '需要关注':
      case '需立即就医':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">大便健康分析</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            上传大便图片
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择小狗</label>
            <select
              value={selectedDog}
              onChange={(e) => setSelectedDog(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="stool-image"
              />
              <label htmlFor="stool-image" className="cursor-pointer">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div className="text-gray-500">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>点击或拖拽图片到此处</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || analyzing}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI分析中...
              </>
            ) : (
              '开始分析'
            )}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(result.health_status)}
                <span className="font-semibold text-lg">{result.health_status}</span>
              </div>
              <p className="text-gray-700 mb-3">{result.analysis_result}</p>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>建议：</strong>{result.suggestions}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            历史记录
          </h3>

          {records.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Dog className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>暂无记录</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {records.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.health_status)}
                      <span className="font-medium">{record.health_status}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.recorded_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  {record.image_path && (
                    <img
                      src={record.image_path}
                      alt="Stool"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm text-gray-600">{record.analysis_result}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoolAnalysis;
