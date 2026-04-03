import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ChevronDown, ArrowRight, Eye, EyeOff, LogIn, MapPin, Navigation } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { loginUser, testLogin } from '../api';
import { CONFIG } from '../config';

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

  const handleTestLogin = async (selectedRole) => {
    try {
      setLoading(true);
      setError('');
      const res = await testLogin(selectedRole);
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('role', role);
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Test login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your credentials');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(formData);
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('role', role);
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 py-12 animate-fade-in">
      <div className="flex flex-col items-center mb-10">
         {CONFIG.TEST_MODE && (
           <div className="mb-4 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-2 animate-pulse">
             <ShieldCheck className="size-3 text-amber-500" />
             <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Test Mode Active • Auto-Login Enabled</span>
           </div>
         )}
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

          {CONFIG.TEST_MODE && (
            <div className="pt-6 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-2">
                 <div className="h-px flex-1 bg-gray-100" />
                 <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Quick Access (Dev)</span>
                 <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                  <button 
                    type="button"
                    onClick={() => handleTestLogin('admin')}
                    className="h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95"
                  >
                    <ShieldCheck size={14} /> Login as Admin
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => handleTestLogin('guide')}
                      className="h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent/20 transition-all active:scale-95"
                    >
                      <Navigation size={14} /> Guide
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleTestLogin('user')}
                      className="h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95"
                    >
                      <User size={14} /> Tourist
                    </button>
                  </div>
              </div>
            </div>
          )}
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
