import React from 'react';
import { Star, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const GuideCard = ({ guide, onBook }) => {
  return (
    <Card className="flex items-center gap-5 p-5 group animate-fade-in mb-4">
      <div className="relative shrink-0">
        <div className="size-20 rounded-[28px] overflow-hidden shadow-2xl border-2 border-white transform transition-transform duration-500 group-hover:scale-105">
          <img 
            src={guide.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guide.name}`} 
            className="size-full object-cover" 
            alt={guide.name}
          />
        </div>
        {guide.isOnline && (
          <div className="absolute -bottom-1 -right-1 size-5 bg-accent rounded-full border-4 border-white shadow-lg shadow-accent/20" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-lg font-black text-text-primary leading-tight truncate">
            {guide.name}
          </h4>
          {guide.isVerified && <ShieldCheck className="size-4 text-primary" />}
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center text-amber-500 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="size-3 fill-current mr-1" />
            {guide.rating || '5.0'}
          </div>
          <div className="flex items-center text-text-secondary font-bold text-[10px] uppercase tracking-widest">
            <MapPin className="size-3 text-rose-500 mr-1" />
            {guide.distance ? `${(guide.distance / 1000).toFixed(1)} km` : 'Local'}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-60">Price / Hour</span>
              <span className="text-lg font-black text-primary leading-none">₹{guide.pricePerHour || 500}</span>
           </div>
           
           <Button 
             size="sm" 
             className="px-4"
             onClick={onBook}
           >
             Book Trip <ChevronRight className="size-4" />
           </Button>
        </div>
      </div>
    </Card>
  );
};

export default GuideCard;
