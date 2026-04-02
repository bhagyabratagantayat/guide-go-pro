import { CONFIG } from '../../config';
import React, { useState, useEffect } from 'react';
import { 
  Navigation, Calendar, History, Star, TrendingUp, 
  ArrowRight, UserCheck, ShieldCheck, MapPin, 
  CircleDot, Clock, CheckCircle2, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toggleGuideStatus, getGuideBookings, updateGuideLocation } from '../../api';
import { useSocket } from '../../context/SocketContext';
import BookingRequestPopup from '../../components/guide/BookingRequestPopup';

const GuideDashboard = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [isOnline, setIsOnline] = useState(false);
    const [stats, setStats] = useState({ totalEarnings: 0, totalTrips: 0, rating: 4.9 });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    
    // Booking Request State
    const [incomingRequest, setIncomingRequest] = useState(null);
    const [activeBooking, setActiveBooking] = useState(null);
    
    let user = { name: 'Expert Guide' };
    try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) user = JSON.parse(savedUser);
    } catch (err) { console.error('Error parsing user data', err); }

    useEffect(() => {
        const fetchGuideData = async () => {
            try {
                const bookingsRes = await axios.get(`${CONFIG.BACKEND_URL}/bookings/guide-bookings`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const bookings = bookingsRes.data.data;
                const active = bookings.find(b => ['accepted', 'ongoing'].includes(b.status));
                if (active) setActiveBooking(active);

                const earnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
                setStats({
                    totalEarnings: earnings,
                    totalTrips: bookings.length,
                    rating: 4.9
                });
            } catch (err) {
                console.error('Failed to fetch guide data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuideData();

        if (socket) {
            socket.on('newBookingRequest', (data) => {
                // If not already on a booking, show the request
                if (!activeBooking) {
                    setIncomingRequest(data);
                }
            });

            socket.on('bookingTaken', (data) => {
                if (incomingRequest?.bookingId === data.bookingId) {
                    setIncomingRequest(null);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('newBookingRequest');
                socket.off('bookingTaken');
            }
        };
    }, [socket, activeBooking, incomingRequest]);

    const handleAccept = async (bookingId) => {
        try {
            const res = await axios.post(`${CONFIG.BACKEND_URL}/bookings/accept/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setActiveBooking(res.data.data);
                setIncomingRequest(null);
                // navigate(`/guide/active-session/${bookingId}`); // Future: detailed mission view
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept booking');
            setIncomingRequest(null);
        }
    };

    const handleToggle = async () => {
        // ... (keep handleToggle as is but use axios with interceptors if needed, or keep existing api calls)
        setSyncing(true);
        try {
            if (!isOnline) {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            await updateGuideLocation(latitude, longitude);
                            const res = await toggleGuideStatus();
                            setIsOnline(res.data.isOnline);
                        } catch (err) {
                            alert('Location sync failed');
                        } finally { setSyncing(false); }
                    }, () => {
                        alert('Location permission required to go active');
                        setSyncing(false);
                    });
                } else {
                    alert('Geolocation not supported');
                    setSyncing(false);
                }
            } else {
                const res = await toggleGuideStatus();
                setIsOnline(res.data.isOnline);
                setSyncing(false);
            }
        } catch (err) {
            alert('Status update failed');
            setSyncing(false);
        }
    };

    return (
        <div className="px-6 py-8 space-y-10 relative">
            {/* Incoming Request Popup */}
            {incomingRequest && (
                <BookingRequestPopup 
                    request={incomingRequest} 
                    onAccept={handleAccept} 
                    onReject={() => setIncomingRequest(null)} 
                />
            )}

            {/* Active Task Indicator */}
            {activeBooking && (
                <div className="bg-primary/10 border-2 border-primary/20 rounded-[32px] p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <MapPin className="size-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-primary uppercase tracking-widest">Active Mission</h4>
                                <p className="text-text-primary text-base font-black">Trip to {activeBooking.locationId?.name || 'Assigned Site'}</p>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/guide/bookings')} className="px-4 py-2 text-[10px] h-10">Manage</Button>
                    </div>
                </div>
            )}

            {/* Header */}
            {/* ... rest of the dashboard UI */}
            <div className="flex items-center justify-between animate-fade-in">
                <div className="space-y-1">
                    <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Expert Portal</p>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight leading-none">Partner <span className="text-primary">Space</span></h1>
                    <p className="text-[9px] font-black text-text-secondary opacity-40 uppercase tracking-widest mt-1">ID: {user._id?.slice(-8) || 'PENDING'}</p>
                </div>
                <button 
                  onClick={handleToggle}
                  disabled={syncing}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-4 flex items-center gap-2 shadow-xl ${
                    isOnline 
                      ? 'bg-accent text-white border-accent/20 shadow-accent/20' 
                      : 'bg-white text-text-secondary border-gray-100 shadow-surface shadow-primary/5'
                  } ${syncing ? 'opacity-50 scale-95' : 'active:scale-95'}`}
                >
                    {syncing ? (
                        <>
                            <CircleDot className="size-3 animate-spin" />
                            Working...
                        </>
                    ) : isOnline ? (
                        <>
                            <div className="size-2 bg-white rounded-full animate-pulse" />
                            Live & Active
                        </>
                    ) : (
                        <>
                            <Clock className="size-3" />
                            Go Online
                        </>
                    )}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
                <Card className="p-6 bg-text-primary text-white border-none relative overflow-hidden group shadow-2xl shadow-primary/10">
                    <TrendingUp className="absolute -right-4 -top-4 size-20 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Total Earnings</p>
                    <h3 className="text-2xl font-black tracking-tight">₹{stats.totalEarnings.toLocaleString()}</h3>
                </Card>
                <Card className="p-6 bg-white border-gray-50 shadow-2xl shadow-primary/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 mb-2">Rating</p>
                    <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-text-primary tracking-tight">{stats.rating}</h3>
                        <Star className="size-4 text-amber-500 fill-current" />
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <section>
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4 opacity-40 ml-1">Live Actions</h3>
                    <Card 
                        className="bg-primary p-10 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border-none shadow-2xl shadow-primary/20"
                        onClick={() => navigate('/map')}
                    >
                        <div className="relative z-10 text-white">
                            <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                                <Navigation className="size-7 animate-pulse text-white shadow-xl shadow-white/10" />
                            </div>
                            <h3 className="text-2xl font-black mb-2 tracking-tight">Open Trip Explorer</h3>
                            <p className="text-white/60 text-xs font-bold mb-8 max-w-[200px] leading-relaxed">
                                View nearby travelers and manage your active missions.
                            </p>
                            <Button variant="secondary" className="px-10 border-none h-12">
                                Launch Map <ArrowRight className="size-4" />
                            </Button>
                        </div>
                        <div className="absolute -right-20 -bottom-20 size-80 bg-white rounded-full blur-[120px] opacity-10" />
                    </Card>
                </section>

                <section>
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4 opacity-40 ml-1">Quick Checks</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'Booking Request Flow', icon: Calendar, color: 'text-primary', path: '/guide/bookings' },
                            { label: 'Verification Identity', icon: UserCheck, color: 'text-accent', status: 'Verified' },
                            { label: 'Service History', icon: History, color: 'text-amber-500', path: '/guide/bookings?filter=past' },
                        ].map((item, i) => (
                            <Card 
                                key={i} 
                                className="p-5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group hover:bg-surface/50"
                                onClick={() => item.path && navigate(item.path)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 bg-surface rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                        <item.icon className="size-6" />
                                    </div>
                                    <span className="text-xs font-black text-text-primary uppercase tracking-widest">{item.label}</span>
                                </div>
                                {item.status ? (
                                    <div className="px-3 py-1.5 bg-accent/10 rounded-lg text-accent text-[8px] font-black uppercase tracking-widest">{item.status}</div>
                                ) : (
                                    <ArrowRight size={16} className="text-gray-200 group-hover:text-primary transition-colors" />
                                )}
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
            
            <p className="text-center mt-20 text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-20">
                Authorized Partner Space v1.2
            </p>
        </div>
    );
};

export default GuideDashboard;
