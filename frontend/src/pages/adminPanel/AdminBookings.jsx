import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Search, Filter, Clock, CheckCircle2, 
  XCircle, ArrowRight, User, MapPin
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { getAdminBookings } from '../../api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        try {
            const res = await getAdminBookings(statusFilter === 'all' ? '' : statusFilter);
            setBookings(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.guideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-50 text-emerald-500';
            case 'ongoing': return 'bg-primary/10 text-primary';
            case 'accepted': return 'bg-accent/10 text-accent';
            case 'pending': return 'bg-amber-50 text-amber-500';
            case 'cancelled': return 'bg-rose-50 text-rose-500';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">Booking <span className="text-primary">Ledger</span></h2>
                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-40">Monitor all transactions and trips</p>
                </div>
                <div className="flex items-center h-14 bg-white rounded-2xl px-5 w-full md:w-80 shadow-2xl shadow-primary/5 border border-gray-50 focus-within:ring-2 ring-primary/10 transition-all">
                    <Search className="size-4 text-text-secondary opacity-40" />
                    <input 
                        type="text" 
                        placeholder="Search trip ID or users..."
                        className="bg-transparent border-none focus:ring-0 text-xs font-bold text-text-primary w-full px-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['all', 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            statusFilter === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-text-secondary hover:bg-surface border border-gray-50'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <Card className="p-0 border-none shadow-2xl shadow-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Trip ID</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Tourist</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 text-center flex items-center justify-center gap-2">
                                    <ArrowRight size={12} />
                                </th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Guide</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse h-20 bg-surface/10 border-b border-white"></tr>)
                            ) : filteredBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-surface/30 transition-colors">
                                    <td className="px-8 py-6 font-black text-[10px] text-text-secondary opacity-40 uppercase tracking-tighter">
                                        #{booking._id.slice(-8)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-surface flex items-center justify-center text-primary">
                                                <User size={14} />
                                            </div>
                                            <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">{booking.userId?.name || 'Tourist'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                         <ArrowRight className="size-4 text-gray-200 mx-auto" />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-surface flex items-center justify-center text-accent">
                                                <ShieldCheck size={14} />
                                            </div>
                                            <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">{booking.guideId?.name || 'Guide'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-black text-primary uppercase">₹{booking.totalPrice?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                                            {booking.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                            {booking.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredBookings.length === 0 && (
                        <div className="py-24 text-center opacity-30">
                            <CalendarCheck className="size-16 mx-auto mb-6 text-text-secondary opacity-10" />
                            <p className="font-black text-[10px] uppercase tracking-[0.4em]">No bookings matched</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminBookings;
