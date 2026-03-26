import React from 'react';
import { User, Shield, CreditCard, Settings, ChevronRight, LogOut, Camera, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Explorer', role: 'tourist' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface px-6 pt-16 pb-32">
      <div className="flex flex-col items-center mb-12 animate-fade-in text-center">
         <div className="relative mb-6">
            <div className="size-32 rounded-[40px] overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white">
               <img 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                 className="size-full bg-primary/5" 
                 alt={user.name}
               />
            </div>
            <button className="absolute bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg border-4 border-surface hover:scale-110 active:scale-95 transition-all">
               <Camera className="size-4" />
            </button>
         </div>
         
         <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-black text-text-primary leading-none">{user.name}</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                 {user.role}
               </span>
               <span className="flex items-center gap-1 text-amber-500 font-black text-[10px] bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                 <Star className="size-3 fill-current" /> 4.9
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 animate-slide-up">
         <Card className="p-5 flex flex-col items-center text-center bg-white/40">
            <Award className="size-6 text-primary mb-2" />
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60">Level</p>
            <p className="text-lg font-black text-text-primary">Pro Explorer</p>
         </Card>
         <Card className="p-5 flex flex-col items-center text-center bg-white/40">
            <Star className="size-6 text-amber-500 mb-2" />
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60">Points</p>
            <p className="text-lg font-black text-text-primary">2,450</p>
         </Card>
      </div>

      <div className="space-y-4 animate-slide-up">
         {[
           { icon: User, label: 'Account Information', color: 'text-primary', bg: 'bg-primary/5' },
           { icon: Shield, label: 'Safety & Emergency', color: 'text-amber-500', bg: 'bg-amber-50' },
           { icon: CreditCard, label: 'Payment Methods', color: 'text-accent', bg: 'bg-accent/5' },
           { icon: Settings, label: 'General Settings', color: 'text-text-secondary', bg: 'bg-surface' },
         ].map((item) => (
            <Card key={item.label} className="p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer border-white/80 group">
               <div className={`size-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="size-6" />
               </div>
               <span className="flex-1 font-black text-text-primary text-sm uppercase tracking-widest">{item.label}</span>
               <ChevronRight className="size-5 text-text-secondary opacity-30" />
            </Card>
         ))}

         <Button 
           variant="ghost" 
           className="w-full mt-10 hover:bg-rose-50 hover:text-rose-500 border border-transparent hover:border-rose-100"
           onClick={handleLogout}
         >
            <LogOut className="size-5" />
            Sign Out
         </Button>
      </div>
      
      <p className="text-center mt-12 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-30">
        GuideGo v1.0.4
      </p>
    </div>
  );
};

export default Profile;
