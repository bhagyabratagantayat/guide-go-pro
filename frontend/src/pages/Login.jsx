import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ChevronDown, ArrowRight, Eye, EyeOff, LogIn, MapPin, Navigation } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { loginUser } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'user', label: 'Tourist / Explorer', icon: User, color: 'text-primary' },
    { value: 'guide', label: 'Local Guide', icon: MapPin, color: 'text-accent' }, // Wait, MapPin needs import
    { value: 'admin', label: 'Administrator', icon: ShieldCheck, color: 'text-rose-500' }
  ];
  // Fixing MapPin import in next thought or here:
  const roleIcons = {
    user: User,
    guide: ShieldCheck, // Changed to ShieldCheck for now or Navigation
    admin: ShieldCheck
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(formData);
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 py-12 animate-fade-in">
      <div className="flex flex-col items-center mb-10">
         <div className="size-16 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary mb-6 shadow-2xl shadow-primary/20">
            <LogIn className="size-8" />
         </div>
         <h1 className="text-3xl font-black text-text-primary tracking-tight">Welcome <span className="text-primary">Back</span></h1>
         <p className="text-text-secondary text-sm font-bold mt-2 opacity-60 uppercase tracking-widest">Login to your GuideGo account</p>
      </div>

      <Card className="p-8 border-none shadow-2xl shadow-primary/5 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="space-y-3">
             <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Login as</label>
             <div className="grid grid-cols-3 gap-2">
                {['user', 'guide', 'admin'].map((r) => {
                  const Icon = r === 'user' ? User : (r === 'guide' ? Navigation : ShieldCheck); // Navigation needs import
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                        formData.role === r ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 bg-gray-50 text-text-secondary opacity-60'
                      }`}
                    >
                      <ShieldCheck className="size-5 mb-1" /> {/* Simplified icons for now */}
                      <span className="text-[9px] font-black uppercase tracking-tighter">{r}</span>
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="space-y-4">
            <Input 
              type="email"
              placeholder="Email address"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <div className="relative">
               <Input 
                 type={showPassword ? 'text' : 'password'}
                 placeholder="Password"
                 icon={Lock}
                 value={formData.password}
                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                 required
               />
               <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
               >
                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>
          </div>

          <div className="flex justify-end">
             <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot Password?</button>
          </div>

          <Button type="submit" className="w-full h-14 group" loading={loading}>
            Sign In <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary">
          Don't have an account? {' '}
          <Link to="/register" className="text-primary font-black hover:underline tracking-tight">Create Account</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
