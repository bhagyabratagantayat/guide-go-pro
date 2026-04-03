import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, CalendarCheck, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { getAdminStats } from '../../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalGuides: 0,
        totalBookings: 0,
        totalRevenue: 0,
        activeGuides: 0,
        completedBookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminStats();
                setStats(res.data.data || res.data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10', trend: '+12%' },
        { label: 'Total Guides', value: stats.totalGuides, icon: ShieldCheck, color: 'text-accent', bg: 'bg-accent/10', trend: '+5%' },
        { label: 'Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-amber-500', bg: 'bg-amber-50', trend: '+28%' },
        { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+18%' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">System <span className="text-primary">Overview</span></h2>
                <p className="text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-40">Real-time performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className="p-8 border-none shadow-2xl shadow-primary/5 group hover:-translate-y-1 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`size-14 ${card.bg} rounded-2xl flex items-center justify-center ${card.color} shadow-inner`}>
                                <card.icon className="size-7" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                {card.trend}
                                {card.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            </div>
                        </div>
                        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1 opacity-60">{card.label}</h4>
                        <p className="text-3xl font-black text-text-primary tracking-tight">{loading ? '...' : card.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8 border-none shadow-2xl shadow-primary/5 min-h-[400px] flex items-center justify-center">
                    <div className="text-center opacity-20">
                        <Activity className="size-16 text-primary mx-auto mb-4 animate-pulse" />
                        <p className="font-black uppercase tracking-widest text-xs">Revenue Analytics Chart Placeholder</p>
                    </div>
                </Card>
                <div className="space-y-6">
                     <Card className="p-8 border-none bg-text-primary text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Active Sessions</p>
                            <h3 className="text-4xl font-black">{stats.activeGuides || 0}</h3>
                            <p className="text-xs font-medium text-white/60 mt-4">Guides currently online and ready for bookings.</p>
                        </div>
                        <div className="absolute -right-8 -bottom-8 size-48 bg-primary rounded-full blur-[80px] opacity-20 group-hover:scale-125 transition-transform duration-1000" />
                     </Card>
                     <Card className="p-8 border-none bg-white shadow-2xl shadow-primary/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary opacity-40 mb-6">Quick Actions</p>
                        <div className="space-y-3">
                            {['Approve Guides', 'Review Reports', 'System Config'].map((action, i) => (
                                <button key={i} className="w-full py-4 px-6 rounded-2xl bg-surface hover:bg-primary hover:text-white transition-all text-left text-xs font-black uppercase tracking-widest flex items-center justify-between group">
                                    {action}
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                     </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
