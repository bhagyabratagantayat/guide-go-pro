import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, CheckCircle2, XCircle, Eye, 
  ExternalLink, FileText, MapPin, Star, Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { getAdminGuides, approveAdminGuide, rejectAdminGuide } from '../../api';

const AdminGuides = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, verified

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const res = await getAdminGuides();
            setGuides(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch guides', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveAdminGuide(id);
            setGuides(guides.map(g => g._id === id ? { ...g, isVerified: true } : g));
        } catch (err) {
            alert('Approval failed');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject/delete this guide?')) return;
        try {
            await rejectAdminGuide(id);
            setGuides(guides.filter(g => g._id !== id));
        } catch (err) {
            alert('Rejection failed');
        }
    };

    const filteredGuides = guides.filter(g => {
        const matchesSearch = (g.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (g.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || 
                             (filter === 'pending' && !g.isVerified) || 
                             (filter === 'verified' && g.isVerified);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">Expert <span className="text-primary">Verification</span></h2>
                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-40">Review and approve partner applications</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center h-14 bg-white rounded-2xl px-5 w-full md:w-80 shadow-2xl shadow-primary/5 border border-gray-50 focus-within:ring-2 ring-primary/10 transition-all">
                        <Search className="size-4 text-text-secondary opacity-40" />
                        <input 
                            type="text" 
                            placeholder="Search name..."
                            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-text-primary w-full px-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {['all', 'pending', 'verified'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-text-secondary hover:bg-surface border border-gray-50'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />)
                ) : filteredGuides.map((guide) => (
                    <Card key={guide._id} className="p-8 border-none shadow-2xl shadow-primary/5 flex flex-col gap-8 group">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-6">
                                <div className="size-20 rounded-3xl bg-surface border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100 shrink-0">
                                    <img src={guide.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + guide.name} className="size-full object-cover" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-text-primary tracking-tight">{guide.name}</h3>
                                        {guide.isVerified && <CheckCircle2 className="size-5 text-accent" />}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary whitespace-nowrap">
                                            <Star className="size-4 text-amber-500 fill-current" />
                                            {guide.rating || '5.0'}
                                        </div>
                                        <div className="size-1 bg-gray-200 rounded-full" />
                                        <div className="text-[10px] font-black text-text-secondary opacity-40 uppercase tracking-widest">
                                            {guide.tripsCompleted || 0} Trips
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mt-2 px-3 py-1.5 bg-primary/5 rounded-lg w-fit">
                                        <MapPin size={12} />
                                        {guide.languages?.join(', ') || 'English, Hindi'}
                                    </div>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                                guide.isVerified ? 'bg-accent/10 text-accent' : 'bg-amber-50 text-amber-500'
                            }`}>
                                {guide.isVerified ? 'Verified' : 'Pending Review'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-surface rounded-2xl border border-gray-50 flex flex-col gap-1">
                                <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Email</span>
                                <span className="text-[11px] font-bold text-text-primary truncate">{guide.email}</span>
                            </div>
                            <div className="p-4 bg-surface rounded-2xl border border-gray-50 flex flex-col gap-1">
                                <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Pricing</span>
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest">₹{guide.pricePerHour}/hr</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
                            {!guide.isVerified ? (
                                <>
                                    <button 
                                        onClick={() => handleApprove(guide._id)}
                                        className="flex-1 h-14 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95"
                                    >
                                        <CheckCircle2 size={16} />
                                        Approve Profile
                                    </button>
                                    <button 
                                        onClick={() => handleReject(guide._id)}
                                        className="size-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-all active:scale-95"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="flex-1 h-14 bg-surface text-text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] cursor-not-allowed flex items-center justify-center gap-2">
                                        <ShieldCheck size={16} />
                                        Already Verified
                                    </button>
                                    <button 
                                        onClick={() => handleReject(guide._id)}
                                        className="size-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-all active:scale-95"
                                    >
                                        <Trash2 size={20} className="size-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
            
            {!loading && filteredGuides.length === 0 && (
                <div className="py-32 text-center opacity-30">
                    <ShieldCheck className="size-20 mx-auto mb-6 text-text-secondary opacity-20" />
                    <p className="font-black text-xs uppercase tracking-[0.4em]">No guides matching criteria</p>
                </div>
            )}
        </div>
    );
};

export default AdminGuides;
