import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, UserPlus, Phone, MapPin, ShieldCheck, Navigation } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { registerUser } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 py-12 animate-fade-in">
      <div className="flex flex-col items-center mb-10">
         <div className="size-16 bg-accent/10 rounded-[24px] flex items-center justify-center text-accent mb-6 shadow-2xl shadow-accent/20">
            <UserPlus className="size-8" />
         </div>
         <h1 className="text-3xl font-black text-text-primary tracking-tight">Create <span className="text-accent">Account</span></h1>
         <p className="text-text-secondary text-sm font-bold mt-2 opacity-60 uppercase tracking-widest">Join the GuideGo community</p>
      </div>

      <Card className="p-8 border-none shadow-2xl shadow-primary/5 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="flex gap-4 p-1 bg-gray-50 rounded-2xl">
            {['user', 'guide'].map((r) => (
               <button
                 key={r}
                 type="button"
                 onClick={() => setFormData({ ...formData, role: r })}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   formData.role === r ? 'bg-white shadow-sm text-primary' : 'text-text-secondary opacity-50'
                 }`}
               >
                 {r === 'user' ? 'Tourist' : 'Guide'}
               </button>
            ))}
          </div>

          <div className="space-y-4">
            <Input 
              type="text"
              placeholder="Full Name"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input 
              type="email"
              placeholder="Email address"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input 
              type="password"
              placeholder="Create Password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full h-14 bg-accent hover:bg-accent/90" loading={loading}>
            Get Started <ArrowRight className="size-4 ml-2" />
          </Button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary">
          Already have an account? {' '}
          <Link to="/login" className="text-accent font-black hover:underline tracking-tight">Sign In</Link>
        </div>
      </Card>
      
      {formData.role === 'guide' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl max-w-md mx-auto">
           <div className="flex gap-3">
              <ShieldCheck className="size-5 text-blue-500 shrink-0" />
              <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider">
                Guide accounts require manual approval by an administrator before you can start accepting trips.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Register;
