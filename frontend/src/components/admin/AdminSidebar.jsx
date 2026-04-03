import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  Settings, 
  BarChart3, 
  LayoutDashboard, 
  ChevronRight,
  LogOut
} from 'lucide-react';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'guides', label: 'Guides', icon: ShieldCheck },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="w-80 h-full bg-white border-r border-gray-100 flex flex-col p-8 transition-all">
      <div className="flex items-center gap-3 mb-12 px-2">
         <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="size-6" />
         </div>
         <div>
            <h2 className="text-xl font-black text-text-primary tracking-tight">Admin<span className="text-primary">Console</span></h2>
            <p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">GuideGo v1.0</p>
         </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
              activeTab === item.id 
                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                : 'text-text-secondary hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className={`size-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight className="size-4 opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="pt-8 mt-8 border-t border-gray-100">
         <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group"
         >
            <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm tracking-tight">Logout</span>
         </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
