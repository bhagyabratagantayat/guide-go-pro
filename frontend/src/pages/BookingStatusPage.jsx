import { CONFIG } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Loader2, CheckCircle2, Phone, MessageSquare, Map as MapIcon, ShieldCheck } from 'lucide-react';

const BookingStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [booking, setBooking] = useState(null);
  const [acceptedGuide, setAcceptedGuide] = useState(null);
  const [status, setStatus] = useState('pending'); // pending, accepted, ongoing

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${CONFIG.BACKEND_URL}/bookings/user-bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const current = res.data.data.find(b => b._id === id);
        setBooking(current);
        if (current.status === 'accepted') {
          setStatus('accepted');
          setAcceptedGuide(current.guideId);
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      }
    };
    fetchBooking();

    if (socket) {
      socket.on('bookingAccepted', (data) => {
        if (data.bookingId === id) {
          setStatus('accepted');
          setAcceptedGuide(data);
          // Refresh booking to get OTP etc
          fetchBooking();
        }
      });

      socket.on('tripStarted', () => {
        setStatus('ongoing');
      });
    }

    return () => {
      if (socket) {
        socket.off('bookingAccepted');
        socket.off('tripStarted');
      }
    };
  }, [id, socket]);

  if (!booking) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin size-12 text-primary" /></div>;

  return (
    <div className="flex-1 bg-surface overflow-y-auto pb-32">
      {/* Dynamic Status Header */}
      <div className={`pt-16 px-8 pb-12 text-white transition-colors duration-1000 ${
        status === 'pending' ? 'bg-primary' : 'bg-green-500'
      }`}>
        <div className="flex flex-col items-center text-center">
          {status === 'pending' ? (
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-white/20 rounded-full"></div>
              <div className="relative size-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Loader2 className="size-10 animate-spin" />
              </div>
            </div>
          ) : (
            <div className="size-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 animate-fade-in">
              <CheckCircle2 className="size-12" />
            </div>
          )}
          
          <h1 className="text-3xl font-black mt-8 tracking-tight">
            {status === 'pending' ? 'Finding your Guide...' : 'Guide is on the way!'}
          </h1>
          <p className="text-white/80 mt-2 font-medium">
            {status === 'pending' 
              ? 'Broadcasting your request to all nearby experts' 
              : `Your tour with ${acceptedGuide?.guideName || 'Expert'} is confirmed`}
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-indigo-100/50">
          
          {status === 'accepted' && (
            <div className="animate-fade-in">
              {/* Guide Profile */}
              <div className="flex items-center gap-5 pb-8 border-b border-slate-50">
                <img 
                  src={acceptedGuide?.profilePhoto || 'https://via.placeholder.com/150'} 
                  alt="Guide" 
                  className="size-20 rounded-[24px] object-cover" 
                />
                <div className="flex-1">
                  <h3 className="text-xl font-black text-text-primary tracking-tight">{acceptedGuide?.guideName}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                      <Phone className="size-5" />
                    </button>
                    <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <MessageSquare className="size-5" />
                    </button>
                    <button className="flex-1 py-2 px-4 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                      <MapIcon className="size-4" /> View Map
                    </button>
                  </div>
                </div>
              </div>

              {/* OTP Security Section */}
              <div className="mt-8 bg-indigo-50/50 rounded-3xl p-6 text-center border-2 border-indigo-100 border-dashed">
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                  <ShieldCheck className="size-4" /> Start Verification Code
                </div>
                <div className="flex justify-center gap-4">
                  {booking.otp.split('').map((char, i) => (
                    <div key={i} className="size-14 bg-white rounded-2xl flex items-center justify-center text-3xl font-black text-primary shadow-sm border border-indigo-100">
                      {char}
                    </div>
                  ))}
                </div>
                <p className="text-text-secondary text-xs font-medium mt-4">Share this OTP with your guide once they arrive to start the tour.</p>
              </div>
            </div>
          )}

          {/* Location Summary */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary font-bold">Location</span>
              <span className="text-text-primary font-black">{booking.locationId?.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary font-bold">Duration</span>
              <span className="text-text-primary font-black">{booking.duration} Hours</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary font-bold">Payment</span>
              <span className="text-text-primary h6 flex items-center gap-2">
                {booking.paymentType === 'cash' ? 'Cash on Spot' : 'UPI Payment'}
              </span>
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-lg font-black text-text-primary">Total Price</span>
              <span className="text-2xl font-black text-primary">₹{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full mt-8 py-5 rounded-[24px] bg-slate-100 text-text-secondary font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
};

export default BookingStatusPage;
