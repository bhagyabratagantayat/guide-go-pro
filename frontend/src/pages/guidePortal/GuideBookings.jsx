import { CONFIG } from '../../config';
import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Clock, MapPin, CheckCircle2, 
  XCircle, ArrowRight, User, Phone, Navigation,
  Inbox, History, ShieldCheck, Zap, Loader2
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const GuideBookings = () => {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'active';
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otpInputs, setOtpInputs] = useState({});
    const [actionLoading, setActionLoading] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${CONFIG.BACKEND_URL}/bookings/guide-bookings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = res.data.data;
            
            if (filter === 'active') {
                setBookings(data.filter(b => ['pending', 'accepted', 'ongoing'].includes(b.status)));
            } else {
                setBookings(data.filter(b => ['completed', 'cancelled'].includes(b.status)));
            }
        } catch (err) {
            console.error('Failed to fetch guide bookings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const handleStartTrip = async (bookingId) => {
        const otp = otpInputs[bookingId];
        if (!otp || otp.length < 4) return alert('Enter valid 4-digit OTP');

        setActionLoading(bookingId);
        try {
            await axios.post(`${CONFIG.BACKEND_URL}/bookings/start`, { bookingId, otp }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setActionLoading(null);
        }
    };

    const handleEndTrip = async (bookingId) => {
        if (!window.confirm('End this tour session?')) return;
        
        setActionLoading(bookingId);
        try {
            await axios.post(`${CONFIG.BACKEND_URL}/bookings/end`, { bookingId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to end trip');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="px-6 py-8 space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Partner Portal</p>
                <h2 className="text-3xl font-black text-text-primary tracking-tight">Trip <span className="text-primary">Manager</span></h2>
                <div className="flex gap-2 mt-6">
                    <button 
                        onClick={() => window.location.search = '?filter=active'}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === 'active' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white text-text-secondary border border-gray-100'
                        }`}
                    >
                        Active
                    </button>
                    <button 
                        onClick={() => window.location.search = '?filter=past'}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === 'past' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white text-text-secondary border border-gray-100'
                        }`}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="space-y-6 pb-20">
                {loading ? (
                    [1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[32px] animate-pulse" />)
                ) : bookings.length === 0 ? (
                    <div className="py-24 text-center opacity-30 mt-10">
                        <Inbox className="size-16 mx-auto mb-6 text-text-secondary" />
                        <p className="font-black text-xs uppercase tracking-[0.3em]">No {filter} bookings</p>
                    </div>
                ) : bookings.map((booking) => (
                    <Card key={booking._id} className="p-8 border-none shadow-2xl shadow-primary/5 flex flex-col gap-6 relative overflow-hidden group">
                        {/* Status Tag */}
                        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest ${
                            booking.status === 'pending' ? 'bg-amber-500 text-white' : 
                            booking.status === 'accepted' ? 'bg-green-500 text-white' : 
                            booking.status === 'ongoing' ? 'bg-primary text-white animate-pulse' : 
                            'bg-gray-100 text-text-secondary'
                        }`}>
                            {booking.status}
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="size-16 rounded-[24px] bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center text-primary font-black text-xl shrink-0">
                                {booking.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-xl font-black text-text-primary tracking-tight leading-none">{booking.userId?.name || 'User'}</h4>
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-primary opacity-60" />
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest truncate max-w-[150px]">{booking.locationId?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* OTP Entry for accepted bookings */}
                        {booking.status === 'accepted' && (
                            <div className="bg-indigo-50/50 rounded-3xl p-6 border-2 border-indigo-100 border-dashed animate-fade-in">
                                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-[10px] uppercase tracking-widest mb-4">
                                    <ShieldCheck className="size-4" /> Verify Customer OTP
                                </div>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        maxLength="4" 
                                        placeholder="Enter 4-digit code"
                                        className="flex-1 bg-white border border-indigo-100 rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[0.5em] text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={otpInputs[booking._id] || ''}
                                        onChange={(e) => setOtpInputs({ ...otpInputs, [booking._id]: e.target.value })}
                                    />
                                    <button 
                                        disabled={actionLoading === booking._id}
                                        onClick={() => handleStartTrip(booking._id)}
                                        className="size-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                    >
                                        {actionLoading === booking._id ? <Loader2 className="animate-spin size-6" /> : <ArrowRight className="size-8" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {booking.status === 'ongoing' && (
                            <div className="animate-fade-in">
                                <div className="bg-primary/5 rounded-3xl p-6 flex flex-col items-center gap-4 text-center border border-primary/10">
                                    <div className="size-14 bg-primary text-white rounded-full flex items-center justify-center animate-pulse">
                                        <Clock className="size-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-primary uppercase tracking-widest leading-none">Tour in Progress</h4>
                                        <p className="text-text-secondary text-[10px] font-bold mt-2">Duration: {booking.duration}h • Payment: {booking.paymentType}</p>
                                    </div>
                                    <button 
                                        disabled={actionLoading === booking._id}
                                        onClick={() => handleEndTrip(booking._id)}
                                        className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-200"
                                    >
                                        End Mission
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quick Contact */}
                        {['accepted', 'ongoing'].includes(booking.status) && (
                            <div className="flex gap-3">
                                <Button className="flex-1 h-14 bg-slate-100 text-text-primary border-none rounded-2xl">
                                    Navigate <Navigation className="size-4 ml-2" />
                                </Button>
                                <a href={`tel:${booking.userId?.phone}`} className="size-14 bg-green-500 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-green-100">
                                    <Phone size={20} />
                                </a>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default GuideBookings;
