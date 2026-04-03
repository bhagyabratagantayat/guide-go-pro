import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Search, Trash2, Edit3, 
  ChevronRight, Map as MapIcon, Image as ImageIcon
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getLocations } from '../../api';

const AdminPlaces = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        try {
            const res = await getLocations('');
            setPlaces(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch places', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlaces = places.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">Place <span className="text-primary">Management</span></h2>
                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-40">Add and edit service destinations</p>
                </div>
                <Button className="h-14 px-8 shadow-xl shadow-primary/20">
                    <Plus className="size-5 mr-2" /> Add New Place
                </Button>
            </div>

            <div className="flex items-center h-16 bg-white rounded-2xl px-6 w-full shadow-2xl shadow-primary/5 border border-gray-50 focus-within:ring-2 ring-primary/10 transition-all">
                <Search className="size-5 text-text-secondary opacity-40" />
                <input 
                    type="text" 
                    placeholder="Search destinations..."
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold text-text-primary w-full px-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    [1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse" />)
                ) : filteredPlaces.map((place) => (
                    <Card key={place._id} className="p-0 border-none shadow-2xl shadow-primary/5 overflow-hidden group">
                        <div className="h-40 relative">
                            <img 
                                src={place.imageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'} 
                                className="size-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white">
                                <MapPin size={14} className="text-primary" />
                                <span className="font-black text-sm uppercase tracking-widest">{place.name}</span>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Short Name</p>
                                <p className="text-xs font-bold text-text-primary">{place.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-surface rounded-xl hover:bg-primary hover:text-white transition-all">
                                    <Edit3 size={16} />
                                </button>
                                <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminPlaces;
