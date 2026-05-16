import { Outlet, Link, useLocation } from 'react-router-dom';
import { Dog, Upload, Utensils, Star, Settings, Users } from 'lucide-react';

function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: Dog },
    { path: '/stool', label: '大便分析', icon: Upload },
    { path: '/meals', label: '饮食记录', icon: Utensils },
    { path: '/dog-food', label: '狗粮评分', icon: Star },
    { path: '/community', label: '汪汪社区', icon: Users },
    { path: '/settings', label: '设置', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Dog className="w-8 h-8" />
            土豆计划
          </h1>
          <p className="text-sm text-gray-500 mt-1">小狗健康监测系统</p>
        </div>
        <ul className="space-y-2 px-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === path
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
