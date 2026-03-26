import React from 'react';
import { Home, Map as MapIcon, Calendar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const FloatingNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MapIcon, label: 'Explore', path: '/map' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 z-[2000] flex justify-center px-6 pointer-events-none">
      <nav className="glass rounded-[32px] p-2 flex items-center shadow-2xl shadow-indigo-100/30 border-white/50 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center justify-center px-6 py-3 rounded-[24px] transition-all duration-500 group ${
                isActive ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-text-secondary hover:text-primary'
              }`}
            >
              <Icon className={`size-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isActive && (
                <span className="text-[9px] font-black mt-1 animate-fade-in uppercase tracking-tighter">{item.label}</span>
              )}
              {!isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingNavbar;
