import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShieldCheck, MapPin, 
  FileText, LogOut, Menu, X, Bell, Search, Settings, 
  CalendarCheck
} from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: ShieldCheck, label: 'Guides', path: '/admin/guides' },
        { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings' },
        { icon: MapPin, label: 'Places', path: '/admin/places' },
        { icon: FileText, label: 'Reports', path: '/admin/reports' },
    ];

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <ShieldCheck className="size-6" />
                        </div>
                        <h1 className="text-xl font-black text-text-primary tracking-tighter">GuideGo <span className="text-primary">Admin</span></h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all
                                    ${isActive 
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'}
                                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <item.icon className="size-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-8 border-t border-gray-50 flex flex-col gap-2">
                         <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-text-secondary hover:bg-surface hover:text-text-primary transition-all">
                            <Settings className="size-5" />
                            Settings
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
                        >
                            <LogOut className="size-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-8 py-4 flex items-center justify-between">
                    <button 
                        className="lg:hidden p-2 text-text-primary"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center h-12 bg-surface rounded-2xl px-4 w-96 border border-gray-50 group focus-within:ring-2 ring-primary/10 transition-all">
                        <Search className="size-4 text-text-secondary opacity-40 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search everything..."
                            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-text-primary w-full px-3 placeholder:text-text-secondary placeholder:opacity-40"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative size-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-text-secondary hover:text-primary transition-all active:scale-95 shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 size-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                             <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-text-primary leading-none uppercase tracking-tighter">{user.name || 'Admin User'}</p>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1 opacity-70">Super Admin</p>
                             </div>
                             <div className="size-12 rounded-2xl bg-surface border-4 border-white shadow-md overflow-hidden ring-1 ring-gray-100">
                                <img 
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                                    className="size-full object-cover"
                                    alt="Admin"
                                />
                             </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 lg:p-12 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
