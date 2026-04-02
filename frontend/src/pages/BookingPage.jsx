import { CONFIG } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CreditCard, Banknote, ShieldCheck, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const BookingPage = () => {
  const { locId, guideId } = useParams();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState(null);
  const [location, setLocation] = useState(null);
  const [duration, setDuration] = useState(1);
  const [paymentType, setPaymentType] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, guideRes] = await Promise.all([
          axios.get(`${CONFIG.BACKEND_URL}/locations`),
          axios.get(`${CONFIG.BACKEND_URL}/guides/${guideId}`)
        ]);
        
        const loc = locRes.data.data.find(l => l._id === locId);
        setLocation(loc);
        setGuide(guideRes.data.data);
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locId, guideId]);

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      // For demo, we are using the location's center coordinates
      const [lng, lat] = location.coordinates.coordinates;
      
      const res = await axios.post(`${CONFIG.BACKEND_URL}/bookings/create`, {
        locationId: locId,
        guideId, // Pre-selected guide
        duration,
        paymentType,
        lat,
        lng
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.data.success) {
        // Redirect to a waiting/status page
        navigate(`/booking-status/${res.data.data._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin size-12 text-primary" /></div>;

  return (
    <div className="flex-1 bg-surface overflow-y-auto pb-32">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100/50 transition-colors">
            <ArrowLeft className="size-6 text-text-primary" />
          </button>
          <h1 className="text-xl font-black text-text-primary tracking-tight">Finalize Booking</h1>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        {/* Quick Summary Card */}
        <div className="bg-primary/95 backdrop-blur-md rounded-[32px] p-6 text-white shadow-xl shadow-primary/20 border border-white/10">
          <div className="flex items-center gap-4">
            <img src={guide.profilePhoto} alt={guide.name} className="size-16 rounded-2xl object-cover border-2 border-white/20" />
            <div>
              <h3 className="text-lg font-black">{guide.name}</h3>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{location?.name}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center text-sm font-bold bg-white/10 rounded-2xl p-4">
            <span>Rate</span>
            <span>₹{guide.pricePerHour} / hour</span>
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <h3 className="text-lg font-black text-text-primary tracking-tight">Select Duration</h3>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[1, 2, 3, 4].map((h) => (
              <button
                key={h}
                onClick={() => setDuration(h)}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${
                  duration === h 
                    ? 'bg-indigo-50 border-2 border-primary text-primary' 
                    : 'bg-white border-2 border-slate-50 text-text-secondary'
                }`}
              >
                <Clock className="size-4" /> {h} {h === 1 ? 'Hour' : 'Hours'}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-black text-text-primary tracking-tight">Payment Option</h3>
          <div className="grid grid-cols-1 gap-3 mt-4">
            <button
              onClick={() => setPaymentType('cash')}
              className={`flex items-center gap-4 p-4 rounded-[24px] font-bold text-sm transition-all border-2 text-left ${
                paymentType === 'cash' 
                  ? 'bg-indigo-50 border-primary text-primary' 
                  : 'bg-white border-slate-50 text-text-secondary'
              }`}
            >
              <div className={`p-3 rounded-xl ${paymentType === 'cash' ? 'bg-primary/10' : 'bg-slate-50'}`}>
                <Banknote className="size-5" />
              </div>
              <div className="flex-1">
                <div className="text-base font-black">Pay on Spot</div>
                <div className="text-[10px] uppercase opacity-60">Cash after trip</div>
              </div>
              {paymentType === 'cash' && <ShieldCheck className="size-5" />}
            </button>

            <button
              onClick={() => setPaymentType('upi')}
              className={`flex items-center gap-4 p-4 rounded-[24px] font-bold text-sm transition-all border-2 text-left ${
                paymentType === 'upi' 
                  ? 'bg-indigo-50 border-primary text-primary' 
                  : 'bg-white border-slate-50 text-text-secondary'
              }`}
            >
              <div className={`p-3 rounded-xl ${paymentType === 'upi' ? 'bg-primary/10' : 'bg-slate-50'}`}>
                <CreditCard className="size-5" />
              </div>
              <div className="flex-1">
                <div className="text-base font-black">UPI Payment</div>
                <div className="text-[10px] uppercase opacity-60">Instant digital pay</div>
              </div>
              {paymentType === 'upi' && <ShieldCheck className="size-5" />}
            </button>
          </div>
        </div>

        {/* Summary & Action */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-text-primary tracking-tighter">₹{duration * guide.pricePerHour}</div>
            <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Amount</div>
          </div>
          <button 
            disabled={bookingLoading}
            onClick={handleBooking}
            className="bg-primary text-white h-16 w-48 rounded-[24px] font-black text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {bookingLoading ? <Loader2 className="animate-spin size-6" /> : <>Book Now <ArrowRight className="size-6" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
