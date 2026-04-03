import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, 
  DollarSign, Camera, CheckCircle2, Save,
  LogOut, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const GuideProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        languages: '',
        pricePerHour: '',
        profilePhoto: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setFormData({
            name: savedUser.name || '',
            email: savedUser.email || '',
            phone: savedUser.phone || '',
            languages: savedUser.languages?.join(', ') || 'English, Hindi',
            pricePerHour: savedUser.pricePerHour || '500',
            profilePhoto: savedUser.profilePhoto || ''
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Profile updated successfully!');
        }, 1500);
    };

    return (
        <div className="px-6 py-8 space-y-8 animate-fade-in pb-32">
            <div className="flex flex-col gap-1 text-center items-center">
                <div className="relative group mb-6">
                    <div className="size-32 rounded-[40px] bg-surface border-8 border-white shadow-2xl overflow-hidden ring-1 ring-gray-100">
                        <img 
                            src={formData.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} 
                            className="size-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                    <button className="absolute bottom-2 right-2 size-10 bg-primary text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-xl active:scale-90 transition-all">
                        <Camera size={16} />
                    </button>
                </div>
                <h2 className="text-3xl font-black text-text-primary tracking-tight">{formData.name}</h2>
                <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-accent/10 rounded-full">
                    <ShieldCheck className="size-4 text-accent" />
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">Verified Multi-lingual Expert</span>
                </div>
            </div>

            <Card className="p-8 border-none shadow-2xl shadow-primary/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1 opacity-40">Public Identity</label>
                            <Input 
                                icon={User} 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1 opacity-40">Expertise & Languages</label>
                            <Input 
                                icon={Globe} 
                                value={formData.languages}
                                onChange={(e) => setFormData({...formData, languages: e.target.value})}
                                placeholder="e.g. English, Hindi, Odia"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1 opacity-40">Hourly Consulting Rate</label>
                            <Input 
                                icon={DollarSign} 
                                value={formData.pricePerHour}
                                onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                                placeholder="Price in ₹"
                                type="number"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1 opacity-40">Contact Support</label>
                            <Input 
                                icon={Phone} 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="Mobile Number"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20" loading={loading}>
                        Save Profile <Save className="size-4 ml-2" />
                    </Button>
                </form>
            </Card>

            <button 
                onClick={handleLogout}
                className="w-full h-14 bg-rose-50 text-rose-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all mb-10"
            >
                <LogOut size={16} />
                Logout Account
            </button>
        </div>
    );
};

export default GuideProfile;
