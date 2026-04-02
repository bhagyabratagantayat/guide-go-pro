import { CONFIG } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Info, Users, ShieldCheck, Zap, Crown, ArrowLeft, ArrowRight } from 'lucide-react';

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [guideCount, setGuideCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, countRes] = await Promise.all([
          axios.get(`${CONFIG.BACKEND_URL}/locations`),
          axios.get(`${CONFIG.BACKEND_URL}/locations/${id}/guides-count`)
        ]);
        
        const loc = locRes.data.data.find(l => l._id === id);
        setLocation(loc);
        setGuideCount(countRes.data.count);
      } catch (err) {
        console.error('Failed to fetch place details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!location) return <div className="p-6 text-center">Place not found</div>;

  const tiers = [
    { name: 'Basic', price: 100, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'New verified guides' },
    { name: 'Standard', price: 150, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Expert local guides' },
    { name: 'Pro', price: 200, icon: Crown, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Top-rated professionals' },
  ];

  return (
    <div className="flex-1 bg-surface overflow-y-auto pb-32">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-surface"></div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30"
        >
          <ArrowLeft className="size-5" />
        </button>

        {/* Floating Stats */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest">
              <Users className="size-3" /> Guides Available
            </div>
            <div className="text-2xl font-black text-white mt-1">{guideCount} Experts</div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest">
              <MapPin className="size-3" /> Location
            </div>
            <div className="text-lg font-black text-white mt-1 truncate">Odisha</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-8">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
          <Info className="size-4" /> ABOUT THIS LOCATION
        </div>
        <h1 className="text-4xl font-black text-text-primary mt-2 tracking-tight leading-tight">
          {location.name}
        </h1>
        <p className="text-text-secondary mt-4 leading-relaxed text-base font-medium">
          {location.description}
        </p>

        {/* Pricing Tiers */}
        <div className="mt-10">
          <h3 className="text-xl font-black text-text-primary tracking-tight">Select Experience Tier</h3>
          <p className="text-text-secondary text-sm font-medium mt-1">Choose a guide level that fits your needs</p>
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            {tiers.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <div 
                  key={tier.name}
                  onClick={() => navigate(`/location/${id}/guides?tier=${tier.name}`)}
                  className="group relative bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between active:scale-[0.98]"
                >
                  <div className="flex items-center gap-5">
                    <div className={`size-14 rounded-2xl ${tier.bg} flex items-center justify-center`}>
                      <TierIcon className={`size-7 ${tier.color}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-text-primary tracking-tight">{tier.name}</h4>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{tier.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">₹{tier.price}</div>
                    <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">PER HOUR</div>
                  </div>
                  
                  {/* Hover Indicator */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="size-4 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsPage;
