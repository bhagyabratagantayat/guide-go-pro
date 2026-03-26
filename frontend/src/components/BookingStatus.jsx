import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, User, Star, X, Info } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const BookingStatus = ({ status, guide, otp, onCancel }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (status === 'ongoing') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-28 left-6 right-6 z-[1000] animate-slide-up">
      <Card hover={false} className="shadow-2xl shadow-primary/10 border-primary/10 overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-8">
           <div className={`size-32 rounded-full blur-3xl opacity-10 ${status === 'searching' ? 'bg-amber-400 animate-pulse' : 'bg-primary'}`} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-2xl flex items-center justify-center ${
                status === 'searching' ? 'bg-amber-50 text-amber-600' : 'bg-primary/5 text-primary'
              }`}>
                {status === 'searching' ? <Clock className="size-6 animate-spin" /> : <ShieldCheck className="size-6" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary leading-tight">
                  {status === 'searching' ? 'Finding a Guide...' : 
                   status === 'accepted' ? 'Guide Arriving' : 'Trip in Progress'}
                </h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60 mt-0.5">
                  {status === 'searching' ? 'Checking availability' : 'Secure Booking Active'}
                </p>
              </div>
            </div>
            {status !== 'ongoing' && (
                <button onClick={onCancel} className="p-2 hover:bg-surface rounded-xl transition-colors">
                    <X className="size-5 text-text-secondary" />
                </button>
            )}
          </div>

          {(status === 'accepted' || status === 'ongoing') && guide && (
            <div className="flex items-center gap-4 bg-surface/50 p-4 rounded-2xl mb-6 border border-white/50">
              <div className="size-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                 <img src={guide.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guide.name}`} className="size-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-text-primary truncate">{guide.guideName || guide.name || 'Expert Guide'}</p>
                <div className="flex items-center text-[10px] text-amber-500 font-black uppercase tracking-widest mt-1">
                  <Star className="size-3 fill-current mr-1" /> {guide.rating || '5.0'}
                </div>
              </div>
              {status === 'accepted' && otp && (
                <div className="text-right">
                  <p className="text-[9px] font-black text-text-secondary uppercase opacity-60">OTP</p>
                  <p className="text-2xl font-black text-primary tracking-tighter">{otp}</p>
                </div>
              )}
            </div>
          )}

          {status === 'ongoing' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary p-5 rounded-[24px] text-white shadow-lg shadow-primary/20">
                <p className="text-[9px] font-black opacity-60 uppercase mb-1 tracking-widest">Duration</p>
                <p className="text-2xl font-black tabular-nums">{formatTime(timer)}</p>
              </div>
              <Card className="bg-white/80 p-5 rounded-[24px] border-primary/10">
                <p className="text-[9px] font-black text-primary uppercase mb-1 tracking-widest">Fare Est.</p>
                <p className="text-2xl font-black text-text-primary">₹{Math.ceil((timer / 3600)) * (guide?.pricePerHour || 500)}</p>
              </Card>
            </div>
          )}

          {status === 'ongoing' && (
            <Button 
              variant="danger"
              className="w-full mt-6"
              onClick={onCancel}
            >
               End Trip & Proceed to Payment
            </Button>
          )}

          {status === 'searching' && (
            <div className="flex items-center gap-3 mt-4 text-amber-600 text-[10px] font-black uppercase tracking-widest p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
               <Info className="size-4 shrink-0" />
               Scanning 32km radius for top-rated guides...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BookingStatus;
