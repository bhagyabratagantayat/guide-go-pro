import { CONFIG } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Languages, Award, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

const GuideListPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tier = searchParams.get('tier') || 'Basic';
  const navigate = useNavigate();
  
  const [guides, setGuides] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const [locRes, guideRes] = await Promise.all([
          axios.get(`${CONFIG.BACKEND_URL}/locations`),
          axios.get(`${CONFIG.BACKEND_URL}/guides/nearby?lat=20.2619&lng=85.7865`) // Using center as demo
        ]);
        
        const loc = locRes.data.data.find(l => l._id === id);
        setLocation(loc);
        
        // Filter guides by tier
        const filtered = guideRes.data.data.filter(g => g.tier === tier);
        setGuides(filtered);
      } catch (err) {
        console.error('Failed to fetch guides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [id, tier]);

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="flex-1 bg-surface overflow-y-auto pb-32">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft className="size-6 text-text-primary" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-primary tracking-tight">{tier} Guides</h1>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{location?.name}</p>
          </div>
        </div>
      </div>

      {/* Guide List */}
      <div className="px-6 mt-6 space-y-6">
        {guides.length === 0 ? (
          <div className="text-center py-12">
            <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              < Award className="size-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mt-4">No {tier} guides online</h3>
            <p className="text-sm text-text-secondary px-6">Specialized guides in this tier are currently offline. Try another tier!</p>
          </div>
        ) : (
          guides.map((guide) => (
            <div 
              key={guide._id} 
              className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 overflow-hidden relative group"
            >
              <div className="flex items-start gap-5">
                {/* Photo */}
                <div className="relative">
                  <img src={guide.profilePhoto} alt={guide.name} className="size-20 rounded-[24px] object-cover" />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 size-6 rounded-full border-4 border-white"></div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-black text-text-primary tracking-tight">{guide.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="size-3 fill-amber-500" />
                      <span className="text-xs font-black">{guide.rating}</span>
                    </div>
                    <span className="text-slate-200">•</span>
                    <span className="text-xs font-bold text-text-secondary">{guide.tripsCompleted}+ Trips</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                      <Languages className="size-3 text-primary" /> {guide.languages?.join(', ') || 'English, Hindi'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                      <Award className="size-3 text-primary" /> {guide.experience} Years Exp.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                <div>
                  <div className="text-2xl font-black text-primary">₹{guide.pricePerHour}</div>
                  <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Base Rate</div>
                </div>
                <button 
                  onClick={() => navigate(`/location/${id}/book/${guide._id}`)}
                  className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  Select <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuideListPage;
