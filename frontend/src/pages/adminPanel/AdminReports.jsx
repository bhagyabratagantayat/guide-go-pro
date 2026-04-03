import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BarChart3, PieChart, Download, 
  Calendar, FileText, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getAdminReports } from '../../api';

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Assuming there's an API for this or we mock it for now
                const res = await getAdminReports();
                setReports(res.data.data || res.data);
            } catch (err) {
                console.error('Failed to fetch reports', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const stats = [
        { label: 'Daily Revenue', value: '₹42,350', change: '+12.5%', isUp: true },
        { label: 'Avg Booking Value', value: '₹1,280', change: '+3.2%', isUp: true },
        { label: 'Cancellation Rate', value: '4.8%', change: '-0.5%', isUp: false },
        { label: 'Partner Growth', value: '18', change: '+4', isUp: true },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">System <span className="text-primary">Analytics</span></h2>
                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-40">Financial and performance insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="h-14 px-6">
                        <Calendar className="size-4 mr-2" /> Last 30 Days
                    </Button>
                    <Button className="h-14 px-8 shadow-xl shadow-primary/20">
                        <Download className="size-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="p-8 border-none shadow-2xl shadow-primary/5">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 opacity-50">{s.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-black text-text-primary">{s.value}</h3>
                            <div className={`flex items-center text-[10px] font-black ${s.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {s.change}
                                {s.isUp ? <ArrowUpRight size={10} className="ml-0.5" /> : <ArrowDownRight size={10} className="ml-0.5" />}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-none shadow-2xl shadow-primary/5 min-h-[450px]">
                    <div className="flex items-center justify-between mb-10">
                         <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <BarChart3 size={20} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary">Revenue Trends</h4>
                         </div>
                         <div className="flex gap-1.5">
                            {['Week', 'Month', 'Year'].map(t => (
                                <button key={t} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${t === 'Month' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'}`}>{t}</button>
                            ))}
                         </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center opacity-10">
                        <TrendingUp size={120} className="text-primary" />
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-2xl shadow-primary/5 min-h-[450px]">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="size-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                            <PieChart size={20} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary">Booking Distribution</h4>
                    </div>
                    <div className="flex-1 flex items-center justify-center opacity-10">
                        <FileText size={100} className="text-accent" />
                    </div>
                </Card>
            </div>

            <Card className="p-8 border-none shadow-2xl shadow-primary/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary mb-8 ml-2">Recent Reports Generated</h4>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 bg-surface rounded-2xl flex items-center justify-between group hover:bg-primary/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-text-primary">Monthly_Revenue_Audit_0{i}.pdf</span>
                                    <span className="text-[8px] font-bold text-text-secondary opacity-40 uppercase mt-1">Generated on March {20-i}, 2026</span>
                                </div>
                            </div>
                            <Download size={16} className="text-text-secondary group-hover:text-primary transition-colors mr-4" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default AdminReports;
