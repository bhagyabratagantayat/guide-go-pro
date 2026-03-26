import React, { useState, useEffect } from 'react';
import { Navigation, Calendar, History, Star, TrendingUp, ArrowRight, UserCheck, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toggleGuideStatus, getGuideBookings } from '../api';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({ totalEarnings: 0, totalTrips: 0, rating: 4.9 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Expert Guide' };

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const bookingsRes = await getGuideBookings();
        const bookings = bookingsRes.data.data;
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
  }, []);

  const handleToggle = async () => {
    try {
      const res = await toggleGuideStatus();
      setIsOnline(res.data.isOnline);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-surface px-6 pt-16 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <div className="space-y-1">
          <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Partner Dashboard</p>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Expert <span className="text-primary">Portal</span></h1>
        </div>
        <div 
          onClick={handleToggle}
          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border-4 ${
            isOnline ? 'bg-accent text-white border-accent/20 shadow-xl shadow-accent/20' : 'bg-white text-text-secondary border-gray-100 shadow-sm'
          }`}
        >
          {isOnline ? 'Active' : 'Offline'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 animate-slide-up">
         <Card className="p-6 bg-text-primary text-white border-none relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <TrendingUp size={64} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Earnings</p>
            <h3 className="text-2xl font-black">₹{stats.totalEarnings.toLocaleString()}</h3>
         </Card>
         <Card className="p-6 bg-white border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60 mb-2">Rating</p>
            <div className="flex items-center gap-2">
               <h3 className="text-2xl font-black text-text-primary">{stats.rating}</h3>
               <Star className="size-4 text-amber-500 fill-current" />
            </div>
         </Card>
      </div>

      {/* Main Actions */}
      <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
         <section>
            <h2 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4 opacity-60 ml-1">Live Actions</h2>
            <Card 
              className="bg-primary p-8 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border-none shadow-2xl shadow-primary/20"
              onClick={() => navigate('/map')}
            >
               <div className="relative z-10 text-white">
                  <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                     <Navigation className="size-6 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Open Trip Explorer</h3>
                  <p className="text-white/60 text-xs font-bold mb-8 max-w-[200px] leading-relaxed">
                    View incoming booking requests and track active trips.
                  </p>
                  <Button variant="secondary" className="px-8 border-none">
                     Go to Map <ArrowRight className="size-4" />
                  </Button>
               </div>
               <div className="absolute -right-10 -bottom-10 size-64 bg-white rounded-full blur-[120px] opacity-10" />
            </Card>
         </section>

         <section>
            <h2 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4 opacity-60 ml-1">Account Checks</h2>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { label: 'Verified Status', icon: ShieldCheck, color: 'text-accent', active: true },
                 { label: 'Booking History', icon: History, color: 'text-primary', active: false, link: '/bookings' },
                 { label: 'Identity Proof', icon: UserCheck, color: 'text-amber-500', active: true },
               ].map((item, i) => (
                  <Card 
                    key={i} 
                    className="p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group"
                    onClick={() => item.link && navigate(item.link)}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`size-10 bg-surface rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                           <item.icon className="size-5" />
                        </div>
                        <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.1em]">{item.label}</span>
                     </div>
                     <div className={`size-2 rounded-full ${item.active ? 'bg-accent' : 'bg-gray-200'}`} />
                  </Card>
               ))}
            </div>
         </section>
      </div>

      <p className="text-center mt-12 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-30">
        Guide Management System v1.1
      </p>
    </div>
  );
};

export default GuideDashboard;
