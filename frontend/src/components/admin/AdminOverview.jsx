import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../api';
import { 
    Users, 
    ShieldCheck, 
    Calendar, 
    TrendingUp, 
    TrendingDown, 
    Activity,
    IndianRupee,
    ArrowUpRight
} from 'lucide-react';
import Card from '../ui/Card';

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await getAdminStats();
            setStats(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading || !stats) return <div className="p-8 animate-pulse text-text-secondary font-bold">Aggregating platform metrics...</div>;

    const cards = [
        { label: 'Total Tourists', value: stats.users, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Active Guides', value: stats.guides.active, icon: ShieldCheck, color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Total Bookings', value: stats.bookings.total, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Revenue (₹)', value: stats.bookings.completed * 500, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col">
                <h2 className="text-4xl font-black text-text-primary tracking-tighter">System <span className="text-primary">Pulse</span></h2>
                <p className="text-sm font-bold text-text-secondary opacity-60 mt-2 uppercase tracking-widest">Real-time platform performance monitoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <Card key={i} className="p-8 border-none shadow-sm hover:shadow-2xl transition-all group" hover={false}>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`size-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <card.icon className="size-7" />
                            </div>
                            <div className="size-8 bg-gray-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="size-4 text-text-secondary" />
                            </div>
                        </div>
                        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">{card.label}</h4>
                        <div className="text-4xl font-black text-text-primary tracking-tighter">
                            {card.value}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-10 border-none shadow-sm" hover={false}>
                    <h3 className="text-xl font-black text-text-primary mb-8 flex items-center gap-3 tracking-tight">
                        <Activity className="size-6 text-primary" /> Booking Throughput
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Completed', value: stats.bookings.completed, color: 'bg-emerald-500', total: stats.bookings.total },
                            { label: 'Active/Ongoing', value: stats.bookings.active, color: 'bg-primary', total: stats.bookings.total },
                            { label: 'Verified Experts', value: stats.guides.verified, color: 'bg-accent', total: stats.guides.total }
                        ].map((bar, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{bar.label}</span>
                                    <span className="text-sm font-black text-text-primary">{bar.value}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${bar.color} transition-all duration-1000 ease-out`}
                                        style={{ width: `${(bar.value / bar.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-10 border-none shadow-sm flex flex-col items-center justify-center text-center overflow-hidden relative" hover={false}>
                     <div className="absolute -bottom-10 -right-10 size-64 bg-accent/5 rounded-full blur-3xl" />
                     <div className="absolute -top-10 -left-10 size-64 bg-primary/5 rounded-full blur-3xl" />
                     
                     <div className="size-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 relative">
                        <TrendingUp className="size-10" />
                     </div>
                     <h3 className="text-2xl font-black text-text-primary tracking-tight mb-2">Growth Vector</h3>
                     <p className="text-sm font-bold text-text-secondary opacity-60 uppercase tracking-widest max-w-[240px]">Platform activity is up 12% compared to last week.</p>
                     
                     <button className="mt-10 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">
                        Generate PDF Report
                     </button>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
