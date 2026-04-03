import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, UserCircle } from 'lucide-react';

const GuideNavbar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/guide/dashboard' },
        { icon: CalendarCheck, label: 'Bookings', path: '/guide/bookings' },
        { icon: UserCircle, label: 'Profile', path: '/guide/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-8 flex items-center justify-between z-[2000] pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                        relative flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-500 group
                        ${isActive ? 'text-primary' : 'text-text-secondary opacity-40'}
                    `}
                >
                    {({ isActive }) => (
                        <>
                            <div className={`
                                size-12 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${isActive ? 'bg-primary/10 scale-110 shadow-xl shadow-primary/5' : 'group-hover:bg-surface group-hover:scale-105'}
                            `}>
                                <item.icon className={`size-6 transition-transform ${isActive ? 'animate-bounce-subtle' : ''}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            {isActive && (
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-1.5 bg-primary rounded-full animate-fade-in" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default GuideNavbar;
