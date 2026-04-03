import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Navigation, Layers, List, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { getNearbyGuides, createBooking } from '../api';
import { useSocket } from '../context/SocketContext';
import BookingRequestPopup from '../components/BookingRequestPopup';
import BookingStatus from '../components/BookingStatus';
import GuideCard from '../components/GuideCard';
import Card from '../components/ui/Card';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const GuideIcon = (photo) => L.divIcon({
  html: `<div class="relative group">
          <div class="size-12 rounded-[18px] overflow-hidden border-2 border-white shadow-2xl shadow-primary/20 transform group-hover:scale-110 transition-transform duration-500">
            <img src="${photo}" class="size-full object-cover" />
          </div>
          <div class="absolute -bottom-1 -right-1 size-4 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
             <div class="size-1 bg-white rounded-full animate-pulse"></div>
          </div>
         </div>`,
  className: 'custom-guide-icon',
  iconSize: [48, 48],
  iconAnchor: [24, 48]
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center]);
  return null;
}

const MapView = () => {
  const query = new URLSearchParams(useLocation().search);
  const lat = parseFloat(query.get('lat')) || 20.2619;
  const lng = parseFloat(query.get('lng')) || 85.7865;
  const name = query.get('name') || 'Odisha';
  const locationId = query.get('locationId');

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingRequest, setBookingRequest] = useState(null);
  const [isListView, setIsListView] = useState(false);

  const { socket, joinRoom } = useSocket();
  const navigate = useNavigate();
  let user = { id: 'test-user', role: 'user' };
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) user = JSON.parse(savedUser);
  } catch (err) { console.error('Error parsing user data', err); }

  useEffect(() => {
    if (socket && user.id) {
        joinRoom(user.id);
        socket.on('newBooking', (data) => { if (user.role === 'guide') setBookingRequest(data); });
        socket.on('bookingAccepted', (data) => {
            setBookingStatus('accepted');
            setActiveBooking(data);
            if (data.bookingId) socket.emit('joinBooking', data.bookingId);
        });
        socket.on('updateGuideLocation', (data) => {
            setGuides(prev => prev.map(g => 
                g._id === activeBooking?.guideId ? { ...g, location: { ...g.location, coordinates: [data.lng, data.lat] } } : g
            ));
        });
        socket.on('tripStarted', (data) => {
            setBookingStatus('ongoing');
            setActiveBooking(prev => ({ ...prev, ...data }));
        });
        socket.on('tripEnded', (data) => {
            setBookingStatus('completed');
            setActiveBooking(prev => ({ ...prev, ...data }));
        });
        socket.on('guideStatusUpdate', () => {
            fetchGuides();
        });
        return () => {
            socket.off('newBooking'); socket.off('bookingAccepted');
            socket.off('tripStarted'); socket.off('tripEnded');
            socket.off('guideStatusUpdate');
        };
    }
  }, [socket, user]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await getNearbyGuides(lat, lng);
      setGuides(res.data.data || []);
    } catch (err) { 
      console.error(err);
      setError('Failed to load expert guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [lat, lng]);

  const handleBookNow = async () => {
    try {
        if (!locationId) return alert('Please search for a location first.');
        setBookingStatus('searching');
        const res = await createBooking({ locationId, lat, lng });
        setActiveBooking(res.data.data);
    } catch (err) {
        setBookingStatus('idle');
        alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-surface font-inter">
      
      {/* STEP 1: Full-screen background map layer */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={[lat, lng]} zoom={14} className="w-full h-full" zoomControl={false}>
          <ChangeView center={[lat, lng]} />
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={DefaultIcon}>
              <Popup className="premium-popup">Current Location</Popup>
          </Marker>
          {guides.filter(g => g?.location?.coordinates?.length === 2).map((guide) => (
            <Marker
              key={guide._id}
              position={[guide.location.coordinates[1], guide.location.coordinates[0]]}
              icon={GuideIcon(guide.profilePhoto)}
            >
              <Popup className="premium-popup">
                <div className="p-0 min-w-[280px]">
                  <GuideCard guide={guide} onBook={handleBookNow} />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {loading && (
          <div className="absolute inset-0 z-[1001] bg-surface/40 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Initializing Map...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 z-[1001] bg-surface/90 backdrop-blur-xl flex items-center justify-center p-12 text-center">
             <div className="max-w-xs">
                <div className="size-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
                   <MapPin size={32} />
                </div>
                <h3 className="text-xl font-black text-text-primary mb-2">Map Error</h3>
                <p className="text-xs font-medium text-text-secondary opacity-60 mb-8">{error}</p>
                <button onClick={fetchGuides} className="w-full h-14 bg-text-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all">
                   Try Again
                </button>
             </div>
          </div>
        )}
      </div>

      {/* STEP 2: Overlay UI (Top Card) */}
      <div className="absolute top-8 left-0 right-0 z-[1000] px-6 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto max-w-lg mx-auto">
          <button
            onClick={() => navigate('/')}
            className="size-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-all border border-white"
          >
            <ArrowLeft className="size-6 text-text-primary" />
          </button>
          <Card className="flex-1 p-3 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-between border-white shadow-2xl" hover={false}>
              <div className="flex items-center gap-3 truncate px-2">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-primary size-5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] leading-none mb-1 opacity-60">Destination</span>
                    <span className="font-black text-text-primary truncate text-sm leading-none">{name}</span>
                  </div>
              </div>
          </Card>
        </div>
      </div>

      {/* STEP 2: Right-side controls */}
      <div className="absolute top-32 right-6 z-[1000] flex flex-col gap-3">
         {[Layers, Navigation].map((Icon, i) => (
           <button key={i} className="size-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-text-primary shadow-2xl active:scale-90 transition-all border border-white">
              <Icon className="size-5" />
           </button>
         ))}
         <button 
           onClick={() => setIsListView(!isListView)}
           className={`size-12 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 ${isListView ? 'bg-primary text-white border-primary' : 'bg-white/90 backdrop-blur-md text-text-primary border-white'}`}
         >
            <List className="size-5" />
         </button>
      </div>

      {/* STEP 3 & 5: Bottom Section (Guides List) with safe area spacing */}
      <div className={`fixed bottom-0 left-0 right-0 z-[1500] transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${
        bookingStatus === 'idle' ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div 
          className={`bg-white/95 backdrop-blur-xl rounded-t-[40px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] border-t border-white transition-all duration-700 px-8 pt-10 pb-32 overflow-hidden ${
             isListView ? 'max-h-[85vh]' : 'max-h-[160px]'
          }`}
        >
            {/* Handle for drawer */}
            <div 
              onClick={() => setIsListView(!isListView)}
              className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
            />

            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Local Experts</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="size-1.5 bg-accent rounded-full animate-pulse " />
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{guides.length} Professional Guides Nearby</span>
                  </div>
                </div>
                <div className="flex -space-x-4">
                   {guides.slice(0, 3).map((g, i) => (
                      <div key={i} className="size-10 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-surface rotate-3 hover:rotate-0 transition-transform">
                         <img src={g.profilePhoto} className="size-full object-cover" />
                      </div>
                   ))}
                </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-16">
                {guides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} onBook={handleBookNow} />
                ))}
                {guides.length === 0 && (
                  <div className="text-center py-16 opacity-30">
                     <Search className="size-12 text-text-secondary mx-auto mb-4" />
                     <p className="font-black text-text-secondary uppercase tracking-[0.2em] text-[10px]">No active guides in this area</p>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* Popups & Components */}
      <BookingStatus 
        status={bookingStatus}
        guide={activeBooking}
        otp={activeBooking?.otp}
        onCancel={() => setBookingStatus('idle')}
      />

      <BookingRequestPopup 
        request={bookingRequest}
        onAccept={(id) => navigate(`/trip/${id}`)}
        onDecline={() => setBookingRequest(null)}
      />

    </div>
  );
};

export default MapView;
