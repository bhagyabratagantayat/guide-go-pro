import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, MapPin, Inbox } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getUserBookings, getGuideBookings } from '../api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = user.role === 'guide' ? await getGuideBookings() : await getUserBookings();
        setBookings(res.data.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user.role]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-surface px-6 pt-16 pb-32">
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <h1 className="text-3xl font-black text-text-primary">
          Your <span className="text-primary">Trips</span>
        </h1>
        <div className="size-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
          <Calendar className="size-5" />
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-6">
           {[1,2,3].map(i => (
             <Card key={i} className="h-40 animate-pulse bg-gray-100/50" />
           ))}
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="p-6 relative overflow-hidden group animate-fade-in">
              {/* Status Indicator */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                booking.status === 'completed' ? 'bg-accent' : 
                booking.status === 'searching' ? 'bg-amber-400' : 'premium-gradient'
              }`} />
              
              <div className="flex items-center justify-between mb-4">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   booking.status === 'completed' ? 'bg-accent/10 text-accent' :
                   booking.status === 'searching' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'
                 }`}>
                   {booking.status}
                 </div>
                 <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">
                   {formatDate(booking.createdAt)}
                 </p>
              </div>
              
              <h3 className="text-xl font-black text-text-primary mb-1">
                {booking.locationId?.name || 'Heritage Tour'}
              </h3>
              <div className="flex items-center text-xs text-text-secondary font-bold mb-6 italic">
                 <MapPin className="size-3 mr-1 text-primary" /> {booking.locationId?.city || 'Odisha'}
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm">
                       <img 
                         src={user.role === 'guide' 
                            ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.userId?.name}`
                            : (booking.guideId?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.guideId?.name}`)
                         } 
                         alt="person" 
                       />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-text-secondary uppercase opacity-60">
                         {user.role === 'guide' ? 'Tourist' : 'Your Guide'}
                       </p>
                       <p className="text-sm font-black text-text-primary">
                         {user.role === 'guide' ? booking.userId?.name : (booking.guideId?.name || 'Pending...')}
                       </p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-text-secondary uppercase opacity-60">Total Fare</p>
                    <p className="text-lg font-black text-primary">₹{booking.totalPrice || booking.pricePerHour || '--'}</p>
                 </div>
              </div>
            </Card>
          ))}

          {bookings.length === 0 && (
            <div className="pt-20 text-center opacity-30 animate-fade-in">
               <div className="size-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-50">
                  <Inbox className="size-8 text-text-secondary" />
               </div>
               <p className="font-black text-text-secondary uppercase tracking-widest text-[10px]">No trip history found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;
