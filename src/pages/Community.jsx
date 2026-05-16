import { useState, useEffect } from 'react';
import { Camera, Heart, MessageCircle, Send, MoreHorizontal, Dog } from 'lucide-react';

function Community() {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostImagePreview, setNewPostImagePreview] = useState(null);
  const [newPostText, setNewPostText] = useState('');
  const [selectedDog, setSelectedDog] = useState('');
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const res = await fetch('/api/dogs');
      const data = await res.json();
      setDogs(data);
      if (data.length > 0) {
        setSelectedDog(data[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to fetch dogs:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostImage || !newPostText.trim()) {
      alert('请上传图片并填写文字');
      return;
    }

    const formData = new FormData();
    formData.append('image', newPostImage);
    formData.append('content', newPostText);
    formData.append('dog_id', selectedDog);

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setShowCreatePost(false);
        setNewPostImage(null);
        setNewPostImagePreview(null);
        setNewPostText('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST'
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">汪汪社区</h1>
          <p className="text-gray-600 mt-1">分享你家小狗的日常点滴</p>
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md"
        >
          <Camera className="w-5 h-5" />
          发布动态
        </button>
      </div>

      {showCreatePost && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">发布新动态</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择小狗</label>
            <select
              value={selectedDog}
              onChange={(e) => setSelectedDog(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>{dog.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">上传照片</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              {newPostImagePreview ? (
                <div className="relative">
                  <img
                    src={newPostImagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setNewPostImage(null);
                      setNewPostImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">点击上传小狗照片</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">说点什么</label>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="分享你家小狗的趣事..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreatePost}
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-all font-medium"
            >
              发布
            </button>
            <button
              onClick={() => {
                setShowCreatePost(false);
                setNewPostImage(null);
                setNewPostImagePreview(null);
                setNewPostText('');
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Dog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">还没有动态</h3>
            <p className="text-gray-500">成为第一个分享你家小狗日常的人吧！</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                    {post.dog_avatar ? (
                      <img src={post.dog_avatar} alt={post.dog_name} className="w-full h-full object-cover" />
                    ) : (
                      <Dog className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.dog_name}</p>
                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
                <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
              </div>
              
              {post.image_url && (
                <div className="relative">
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center gap-6 mb-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{post.comments || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Community;
