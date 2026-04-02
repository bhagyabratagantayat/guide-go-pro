import { CONFIG } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Star, Users, ArrowRight, Search } from 'lucide-react';

const ExplorePage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${CONFIG.BACKEND_URL}/locations`);
        setLocations(res.data.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-indigo-50/50 to-transparent">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Explore</h1>
        <p className="text-text-secondary mt-1">Discover the beauty of Odisha</p>
        
        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search monuments, temples..." 
            className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 shadow-sm border-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories (Quick Filters) */}
      <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar pb-4">
        {['All', 'Historical', 'Religious', 'Nature'].map(cat => (
          <button key={cat} className="px-5 py-2 rounded-full bg-white border border-slate-100 text-sm font-bold whitespace-nowrap shadow-sm hover:border-primary transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Location Grid */}
      <div className="px-4 grid grid-cols-1 gap-6 mt-4">
        {filteredLocations.map((loc) => (
          <div 
            key={loc._id} 
            onClick={() => navigate(`/location/${loc._id}`)}
            className="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer active:scale-[0.98]"
          >
            {/* Image */}
            <div className="h-64 relative">
              <img 
                src={loc.image} 
                alt={loc.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Badge */}
              {loc.isPopular && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" /> Popular
                  </span>
                </div>
              )}

              {/* Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-2xl font-black text-white">{loc.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                  <MapPin className="size-3" />
                  <span>Odisha, India</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center">
                    <Users className="size-4 text-primary" />
                  </div>
                  <div className="size-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center">
                    <span className="text-[10px] font-black">+12</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-text-secondary tracking-tight">Active Guides</span>
              </div>
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ArrowRight className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
