import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Clock, Banknote, X, Check } from 'lucide-react';

const BookingRequestPopup = ({ request, onAccept, onReject }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) {
      onReject();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onReject]);

  return (
    <div className="fixed inset-x-6 bottom-32 z-[3000] animate-slide-up">
      <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-primary/40 border-4 border-primary/10 relative overflow-hidden">
        {/* Progress bar background */}
        <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-primary/10 rounded-[20px] flex items-center justify-center">
              <Bell className="size-6 text-primary animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black text-primary uppercase tracking-widest">New Mission Request</h3>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mt-0.5">Expires in {timeLeft}s</p>
            </div>
          </div>
          <button onClick={onReject} className="size-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
            <X className="size-5 text-slate-300" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl">
            <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <MapPin className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Destination</p>
              <p className="text-base font-black text-text-primary">{request.locationName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-3xl">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="size-3 text-text-secondary" />
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Duration</span>
              </div>
              <p className="text-base font-black text-text-primary">{request.duration} Hours</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl">
              <div className="flex items-center gap-2 mb-1">
                <Banknote className="size-3 text-text-secondary" />
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Earnings</span>
              </div>
              <p className="text-base font-black text-primary">₹{request.totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => onAccept(request.bookingId)}
            className="w-full bg-primary text-white py-5 rounded-[28px] font-black text-base uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Accept Tour <Check className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestPopup;
