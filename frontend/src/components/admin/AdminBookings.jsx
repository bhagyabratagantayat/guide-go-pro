import React, { useState, useEffect } from 'react';
import { getAdminBookings } from '../../api';
import { IndianRupee, Clock, MapPin, User, Shield } from 'lucide-react';
import Card from '../ui/Card';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getAdminBookings(filter);
            setBookings(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'ongoing': return 'bg-primary/5 text-primary border-primary/10';
            case 'cancelled': return 'bg-rose-50 text-rose-500 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">System <span className="text-primary">Bookings</span></h2>
                    <p className="text-sm font-bold text-text-secondary opacity-60 mt-2 uppercase tracking-widest">Platform Activity Log</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl shadow-inner">
                    {['', 'ongoing', 'completed', 'cancelled'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === s ? 'bg-white shadow-sm text-primary' : 'text-text-secondary opacity-50'
                            }`}
                        >
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-8 animate-pulse text-text-secondary font-bold">Refreshing activity...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((b) => (
                        <Card key={b._id} className="p-6 border-none shadow-sm hover:shadow-xl transition-all" hover={false}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-50">Transaction ID</span>
                                    <span className="font-mono text-xs font-bold text-text-primary">#{b._id.slice(-8).toUpperCase()}</span>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(b.status)}`}>
                                            {b.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-text-secondary border border-gray-100">
                                        <User className="size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest opacity-50">Tourist</span>
                                        <span className="font-black text-text-primary text-sm tracking-tight">{b.touristId?.name || 'Unknown'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                                        <Shield className="size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest opacity-50">Expert Guide</span>
                                        <span className="font-black text-text-primary text-sm tracking-tight">{b.guideId?.name || 'Pending'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="flex items-center text-xl font-black text-primary tracking-tighter">
                                        <IndianRupee className="size-4" /> {b.totalPrice || 0}
                                    </div>
                                    <span className="text-[9px] font-bold text-text-secondary opacity-60 mt-1 uppercase tracking-widest">
                                        {new Date(b.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {bookings.length === 0 && (
                        <div className="text-center py-24 opacity-20 italic font-black uppercase tracking-widest">
                            No bookings found for this filter
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
