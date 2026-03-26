import React, { useState, useEffect } from 'react';
import { Settings, TrendingUp, Users, MapPin, DollarSign, ArrowUpRight, Save, Activity } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getAdminStats, getAdminConfig, updateAdminConfig } from '../api';

const Admin = () => {
  const [stats, setStats] = useState({ totalBookings: 0, totalGuides: 0, totalUsers: 0, totalRevenue: 0 });
  const [config, setConfig] = useState({ pricePerHour: 500 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, configRes] = await Promise.all([getAdminStats(), getAdminConfig()]);
        setStats(statsRes.data.data);
        setConfig(configRes.data.data || { pricePerHour: 500 });
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateConfig = async () => {
    setSaving(true);
    try {
      await updateAdminConfig(config);
      alert('Pricing updated successfully!');
    } catch (err) {
      alert('Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-6 pt-16 pb-32">
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <h1 className="text-3xl font-black text-text-primary">
          Admin <span className="text-primary">Console</span>
        </h1>
        <div className="size-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
          <Settings className="size-5 animate-spin-slow" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
           <Card className="h-64 animate-pulse bg-gray-100/50" />
           <div className="grid grid-cols-2 gap-4">
              <Card className="h-32 animate-pulse bg-gray-100/50" />
              <Card className="h-32 animate-pulse bg-gray-100/50" />
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-text-primary text-white border-none group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Activity size={80} />
               </div>
               <TrendingUp className="size-6 text-primary mb-2" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Revenue</p>
               <h3 className="text-2xl font-black">₹{stats.totalRevenue?.toLocaleString() || '0'}</h3>
               <ArrowUpRight className="absolute bottom-4 right-4 size-4 text-accent" />
            </Card>
            <Card className="p-6 bg-white border-gray-100">
               <Users className="size-6 text-primary mb-2" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Total Guides</p>
               <h3 className="text-2xl font-black text-text-primary">{stats.totalGuides || '0'}</h3>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-white border-gray-100">
               <MapPin className="size-6 text-accent mb-2" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Trips Found</p>
               <h3 className="text-2xl font-black text-text-primary">{stats.totalBookings || '0'}</h3>
            </Card>
            <Card className="p-6 bg-white border-gray-100">
               <div className="size-6 bg-rose-50 text-rose-500 rounded flex items-center justify-center mb-2">
                  <Users className="size-3" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Total Users</p>
               <h3 className="text-2xl font-black text-text-primary">{stats.totalUsers || '0'}</h3>
            </Card>
          </div>

          {/* Configuration Section */}
          <Card className="p-8 border-none shadow-2xl shadow-primary/5">
             <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                   <DollarSign className="size-5" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-text-primary">Fare Management</h3>
                   <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Global Pricing Control</p>
                </div>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 block">Price per hour (₹)</label>
                   <Input 
                     type="number"
                     placeholder="500"
                     value={config.pricePerHour}
                     onChange={(e) => setConfig({ ...config, pricePerHour: e.target.value })}
                     icon={DollarSign}
                   />
                </div>
                
                <p className="text-xs text-text-secondary font-medium leading-relaxed italic opacity-60">
                  Changing this value will update the hourly rate for all new bookings across the platform immediately.
                </p>

                <Button 
                  className="w-full h-14" 
                  onClick={handleUpdateConfig}
                  loading={saving}
                >
                  <Save className="size-4 mr-2" />
                  Save Changes
                </Button>
             </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Admin;
