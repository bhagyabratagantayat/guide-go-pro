import React, { useState, useEffect } from 'react';
import { getAdminGuides, approveAdminGuide, rejectAdminGuide } from '../../api';
import { Check, X, ShieldCheck, Mail, Phone, FileText, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';

const AdminGuides = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const res = await getAdminGuides();
            setGuides(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleApprove = async (id) => {
        try {
            await approveAdminGuide(id);
            setGuides(guides.map(g => g._id === id ? { ...g, isVerified: true } : g));
        } catch (err) { alert('Approval failed'); }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Delete this guide application?')) return;
        try {
            await rejectAdminGuide(id);
            setGuides(guides.filter(g => g._id !== id));
        } catch (err) { alert('Rejection failed'); }
    };

    if (loading) return <div className="p-8 animate-pulse text-text-secondary font-bold">Loading guides...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">Guide <span className="text-primary">Verification</span></h2>
                <p className="text-sm font-bold text-text-secondary opacity-60 mt-2 uppercase tracking-widest">Active & Pending Applications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {guides.map((g) => (
                    <Card key={g._id} className="p-8 border-none shadow-sm hover:shadow-2xl transition-all relative overflow-hidden" hover={false}>
                        {g.isVerified && (
                             <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg">
                                Verified
                             </div>
                        )}
                        <div className="flex items-start gap-6">
                            <div className="size-24 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl shrink-0">
                                <img src={g.profilePhoto} className="size-full object-cover" alt={g.name} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-text-primary mb-1 tracking-tight">{g.name}</h3>
                                <div className="space-y-2 mt-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                                    <div className="flex items-center gap-2 opacity-60"><Mail className="size-3" /> {g.userId?.email || 'N/A'}</div>
                                    <div className="flex items-center gap-2"><FileText className="size-3 text-primary" /> Languages: {g.languages?.join(', ')}</div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    {!g.isVerified ? (
                                        <>
                                            <button 
                                                onClick={() => handleApprove(g._id)}
                                                className="flex-1 h-12 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check className="size-4" /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(g._id)}
                                                className="flex-1 h-12 bg-rose-50 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <X className="size-4" /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleReject(g._id)}
                                            className="w-full h-12 border-2 border-dashed border-rose-100 text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X className="size-4" /> Revoke Access
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminGuides;
