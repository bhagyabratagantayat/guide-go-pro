import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Navigation, Layers, List, Search } from 'lucide-react';
import { getNearbyGuides, createBooking, acceptBooking, endTrip, toggleGuideStatus } from '../api';
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
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingRequest, setBookingRequest] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const { socket, joinRoom } = useSocket();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { id: 'test-user', role: 'tourist' };

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
        return () => {
            socket.off('newBooking'); socket.off('bookingAccepted');
            socket.off('tripStarted'); socket.off('tripEnded');
        };
    }
  }, [socket, user]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await getNearbyGuides(lat, lng);
        setGuides(res.data.data);
      } catch (err) { console.error(err); }
    };
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

  const handleAcceptTrip = async (bookingId) => {
    try {
        await acceptBooking(bookingId);
        setBookingRequest(null);
    } catch (err) { alert(err.response?.data?.message || 'Failed to accept trip'); }
  };

  const handleEndTrip = async () => {
    try {
        const res = await endTrip(activeBooking._id);
        setBookingStatus('completed');
        setActiveBooking(prev => ({ ...prev, ...res.data.data }));
    } catch (err) { alert(err.response?.data?.message || 'Failed to end trip'); }
  };

  const handleToggleStatus = async () => {
    try {
        const res = await toggleGuideStatus();
        setIsOnline(res.data.isOnline);
    } catch (err) { alert('Operation failed'); }
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-surface">
      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 z-[1000] flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="size-12 glass rounded-2xl shadow-xl flex items-center justify-center hover:bg-white active:scale-90 transition-all border border-white/50"
        >
          <ArrowLeft className="size-6 text-text-primary" />
        </button>
        <Card className="flex-1 p-3 rounded-2xl flex items-center justify-between border-white/50" hover={false}>
            <div className="flex items-center gap-2 truncate px-2">
                <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="text-primary size-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] leading-none mb-1">Destination</span>
                  <span className="font-black text-text-primary truncate text-sm leading-none">{name}</span>
                </div>
            </div>
            {user.role === 'guide' && (
                <button 
                    onClick={handleToggleStatus}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-lg ${isOnline ? 'bg-accent text-white shadow-accent/20' : 'bg-gray-100 text-text-secondary opacity-50'}`}
                >
                    {isOnline ? 'Active' : 'Offline'}
                </button>
            )}
        </Card>
      </div>

      {/* Map Controls */}
      <div className="absolute top-24 right-6 z-[1000] flex flex-col gap-3">
         {[Layers, Navigation].map((Icon, i) => (
           <button key={i} className="size-11 glass rounded-2xl flex items-center justify-center text-text-primary shadow-xl hover:bg-white active:scale-90 transition-all border border-white/50">
              <Icon className="size-5" />
           </button>
         ))}
         <button 
           onClick={() => setIsListView(!isListView)}
           className={`size-11 rounded-2xl flex items-center justify-center shadow-xl transition-all border border-white/50 ${isListView ? 'bg-primary text-white' : 'glass text-text-primary'}`}
         >
            <List className="size-5" />
         </button>
      </div>

      <div className="flex-1 w-full relative">
        <MapContainer center={[lat, lng]} zoom={14} className="w-full h-full" zoomControl={false}>
          <ChangeView center={[lat, lng]} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={DefaultIcon}>
              <Popup className="premium-popup">Current Location</Popup>
          </Marker>
          {guides.map((guide) => (
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
      </div>

      <BookingStatus 
        status={bookingStatus}
        guide={activeBooking}
        otp={activeBooking?.otp}
        onCancel={bookingStatus === 'ongoing' ? handleEndTrip : () => setBookingStatus('idle')}
      />

      <BookingRequestPopup 
        request={bookingRequest}
        onAccept={handleAcceptTrip}
        onDecline={() => setBookingRequest(null)}
      />

      {/* Bottom Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 z-[1500] transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${
        bookingStatus === 'idle' ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className={`glass rounded-t-[48px] shadow-[0_-20px_50px_-20px_rgba(79,70,229,0.1)] border-t border-white/50 transition-all duration-700 px-8 pt-10 pb-32 overflow-hidden ${
          isListView ? 'max-h-[85vh]' : 'max-h-[145px]'
        }`}>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-text-secondary opacity-10 rounded-full" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-text-primary leading-tight">Local Experts</h3>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{guides.length} Professional Guides Nearby</span>
                </div>
                <div className="flex -space-x-4">
                   {guides.slice(0, 3).map((g, i) => (
                      <div key={i} className="size-10 rounded-2xl border-4 border-white overflow-hidden shadow-sm bg-surface">
                         <img src={g.profilePhoto} className="size-full object-cover" />
                      </div>
                   ))}
                </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-10">
                {guides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} onBook={handleBookNow} />
                ))}
                {guides.length === 0 && (
                  <div className="text-center py-16 opacity-20">
                     <Search className="size-14 text-text-secondary mx-auto mb-4 border-2 border-text-secondary rounded-full p-3" />
                     <p className="font-black text-text-secondary uppercase tracking-[0.2em] text-xs">No active guides in this area</p>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
