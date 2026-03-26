import React from 'react';
import { Bell, MapPin, X, Check, ShieldAlert } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const BookingRequestPopup = ({ request, onAccept, onDecline }) => {
  if (!request) return null;

  return (
    <div className="fixed top-24 left-6 right-6 z-[2500] animate-slide-up">
      <Card hover={false} className="p-8 shadow-[0_32px_64px_-16px_rgba(79,70,229,0.3)] border-primary/20 relative overflow-hidden">
        {/* Pulsing decoration */}
        <div className="absolute top-0 right-0 p-6">
           <div className="size-24 bg-primary rounded-full blur-3xl opacity-10 animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
               <Bell className="size-3.5 text-white animate-bounce" />
               <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Priority Request</span>
            </div>
            <button onClick={onDecline} className="p-2 hover:bg-surface rounded-xl transition-colors">
               <X className="size-5 text-text-secondary opacity-40 hover:opacity-100" />
            </button>
          </div>

          <div className="flex items-center gap-5 mb-8">
             <div className="size-20 rounded-[28px] overflow-hidden border-2 border-white shadow-xl">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.userName}`} className="size-full bg-surface" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-text-primary leading-tight">{request.userName}</h3>
                <div className="flex items-center text-text-secondary font-black text-[10px] uppercase tracking-widest mt-2">
                   <MapPin className="size-3.5 text-rose-500 mr-1.5" />
                   {(request.distance / 1000).toFixed(1)}km from your location
                </div>
             </div>
          </div>

          <Card className="p-4 bg-amber-50 rounded-2xl mb-10 border-amber-100/50 flex items-center gap-3">
             <ShieldAlert className="size-5 text-amber-600 shrink-0" />
             <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-relaxed">
                Acceptance will start a new professional session.
             </p>
          </Card>

          <div className="flex gap-4">
             <Button 
               variant="ghost" 
               className="flex-1"
               onClick={onDecline}
             >
                Ignore
             </Button>
             <Button 
               className="flex-[2]"
               onClick={() => onAccept(request.bookingId)}
             >
                <Check className="size-4" />
                Accept Trip
             </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingRequestPopup;
