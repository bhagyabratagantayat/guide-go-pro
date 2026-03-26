import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map as MapIcon, Compass, Star, TrendingUp, History, MapPin, Navigation } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

import { getLocations } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Explorer' };

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length > 2) {
      try {
        const res = await getLocations(val);
        setSuggestions(res.data.data);
      } catch (err) { console.error(err); }
    } else {
      setSuggestions([]);
    }
  };

  const categories = [
    { label: 'Popular', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Nearby', icon: Navigation, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Map', icon: MapIcon, color: 'text-accent', bg: 'bg-accent/5' },
    { label: 'Recent', icon: History, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header & Greeting */}
      <header className="px-6 pt-16 pb-8 animate-fade-in">
         <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
               <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Welcome back</p>
               <h1 className="text-3xl font-black text-text-primary tracking-tight">
                  Hi, <span className="text-primary">{user.name.split(' ')[0]}</span> 👋
               </h1>
            </div>
            <div className="size-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden active:scale-95 transition-transform cursor-pointer" onClick={() => navigate('/profile')}>
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="size-10" />
            </div>
         </div>

         <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors duration-300">
               <Search className="size-5" />
            </div>
            <input 
              type="text"
              placeholder="Search places like Khandagiri..."
              className="w-full bg-white border-2 border-transparent focus:border-primary/20 h-16 pl-14 pr-6 rounded-[24px] text-sm font-bold text-text-primary shadow-sm focus:shadow-xl focus:shadow-primary/5 transition-all outline-none placeholder:text-text-secondary/40 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {suggestions.length > 0 && (
              <Card className="absolute top-20 left-0 right-0 z-50 p-2 border-none shadow-2xl animate-fade-in">
                {suggestions.map((loc) => (
                  <div 
                    key={loc._id} 
                    className="p-4 hover:bg-primary/5 rounded-xl cursor-pointer flex items-center gap-4 transition-colors group"
                    onClick={() => navigate(`/map?lat=${loc.coordinates.coordinates[1]}&lng=${loc.coordinates.coordinates[0]}&name=${loc.name}&locationId=${loc._id}`)}
                  >
                    <div className="size-10 bg-surface rounded-xl flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="font-black text-text-primary text-sm">{loc.name}</p>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{loc.city}</p>
                    </div>
                  </div>
                ))}
              </Card>
            )}
         </div>
      </header>

      {/* Categories Scroll */}
      <section className="px-6 mb-12 overflow-x-auto no-scrollbar animate-slide-up">
         <div className="flex gap-4 min-w-max pb-2">
            {categories.map((cat) => {
               const Icon = cat.icon;
               return (
                  <button key={cat.label} className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-50 shadow-sm active:scale-95 transition-all hover:shadow-md group">
                     <div className={`size-8 ${cat.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`size-4 ${cat.color} group-hover:scale-110 transition-transform`} />
                     </div>
                     <span className="text-xs font-black text-text-primary uppercase tracking-widest">{cat.label}</span>
                  </button>
               );
            })}
         </div>
      </section>

      {/* Featured Destinations */}
      <section className="px-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-text-primary flex items-center gap-2 tracking-tight">
               Top Destinations <TrendingUp className="size-5 text-primary" />
            </h2>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline px-3 py-1 bg-primary/5 rounded-full">View All</button>
         </div>
         
         <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-primary/5 group" hover={true}>
            <div className="relative h-72 cursor-pointer overflow-hidden" onClick={() => navigate('/map')}>
               <img 
                 src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop" 
                 className="size-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 alt="Lingaraj Temple" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-text-primary/90 via-text-primary/20 to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                     <MapPin className="size-4 text-primary" />
                     <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Bhubaneswar, Odisha</p>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-4">Lingaraj Temple</h3>
                  <div className="flex items-center gap-4">
                     <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">Heritage</span>
                     <div className="flex items-center gap-1.5 text-white text-[10px] font-black bg-amber-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/20">
                        <Star className="size-3 text-amber-400 fill-current" /> 4.9
                     </div>
                  </div>
               </div>
            </div>
         </Card>
      </section>

      {/* Full Explorer Call-to-action */}
      <section className="px-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
         <Card className="bg-text-primary p-8 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border-none" onClick={() => navigate('/map')}>
            <div className="relative z-10">
               <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Compass className="size-6 animate-spin-slow" />
               </div>
               <h3 className="text-white text-2xl font-black mb-2 tracking-tight">Interactive Map</h3>
               <p className="text-white/40 text-sm font-bold mb-8 max-w-[200px] leading-relaxed">Discovery nearby local experts in real-time.</p>
               <Button variant="secondary" className="px-8" onClick={() => navigate('/map')}>
                  Open Explorer <Navigation className="size-4" />
               </Button>
            </div>
            <div className="absolute -right-10 -bottom-10 size-64 premium-gradient rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-all duration-1000" />
            <div className="absolute top-10 right-10 text-white/5 group-hover:text-white/10 transition-colors duration-1000">
               <MapIcon size={120} strokeWidth={1} />
            </div>
         </Card>
      </section>
    </div>
  );
};

export default Home;
