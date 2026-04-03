import React, { useState, useEffect } from 'react';
import { getAdminReports } from '../../api';
import { BarChart3, TrendingUp, IndianRupee, Calendar, Download } from 'lucide-react';
import Card from '../ui/Card';

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await getAdminReports();
            setReports(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading || !reports) return <div className="p-8 animate-pulse text-text-secondary font-bold">Mining analytics data...</div>;

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-4xl font-black text-text-primary tracking-tighter">Finance & <span className="text-primary">Scale</span></h2>
                    <p className="text-sm font-bold text-text-secondary opacity-60 mt-2 uppercase tracking-widest">Revenue performance and daily velocity</p>
                </div>
                <button className="h-14 px-8 bg-black text-white rounded-2xl flex items-center gap-4 text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                    <Download className="size-5" /> Export Statements
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-10 border-none shadow-sm lg:col-span-2" hover={false}>
                    <h3 className="text-xl font-black text-text-primary mb-10 flex items-center gap-3 tracking-tight">
                        <TrendingUp className="size-6 text-primary" /> Daily Booking Velocity
                    </h3>
                    <div className="flex items-end justify-between h-64 gap-4 px-4">
                        {reports.dailyStats.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div className="w-full relative flex flex-col items-center justify-end h-full">
                                    <div 
                                        className="w-full bg-primary/10 rounded-t-xl group-hover:bg-primary transition-all duration-700 relative"
                                        style={{ height: `${(day.count / Math.max(...reports.dailyStats.map(d => d.count), 1)) * 100}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {day.count} trips
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-6 opacity-40">
                                    {day._id.split('-').slice(1).join('/')}
                                </span>
                            </div>
                        ))}
                        {reports.dailyStats.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center opacity-10 font-black uppercase tracking-[0.3em]">
                                Insufficient Data Points
                            </div>
                        )}
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="p-10 border-none shadow-sm bg-primary text-white" hover={false}>
                        <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center mb-10 shadow-xl backdrop-blur-md">
                            <IndianRupee className="size-7 text-white" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Gross Revenue</h4>
                        <div className="text-4xl font-black tracking-tighter">
                            ₹{reports.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-[9px] font-bold mt-6 opacity-40 uppercase tracking-widest">Lifetime platform earnings</p>
                    </Card>

                    <Card className="p-10 border-none shadow-sm flex flex-col items-center justify-center text-center py-16" hover={false}>
                        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-text-secondary mb-6 italic font-black text-xl">
                            %
                        </div>
                        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Conversion Rate</h4>
                        <div className="text-3xl font-black text-text-primary tracking-tight">8.4%</div>
                        <p className="text-[9px] font-bold text-text-secondary opacity-40 mt-3 uppercase tracking-widest">Search-to-Booking</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
