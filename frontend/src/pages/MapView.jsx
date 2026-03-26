import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Star, MapPin, Shield, CheckCircle2 } from 'lucide-react';
import { getNearbyGuides } from '../api';
import api from '../api';
import { useSocket } from '../context/SocketContext';
import BookingRequestPopup from '../components/BookingRequestPopup';
import BookingStatus from '../components/BookingStatus';

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

// Custom hook to fly to search location
function ChangeView({ center }) {
  const map = useMap();
  map.flyTo(center, 14);
  return null;
}

const MapView = () => {
  const query = new URLSearchParams(useLocation().search);
  const lat = parseFloat(query.get('lat')) || 20.2619;
  const lng = parseFloat(query.get('lng')) || 85.7865;
  const name = query.get('name') || 'Your Location';

  const locationId = query.get('locationId');

  const [guides, setGuides] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, searching, accepted, ongoing
  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingRequest, setBookingRequest] = useState(null);
  
  const { socket, joinRoom } = useSocket();
  const navigate = useNavigate();

  // Mock roles for testing (In production, this comes from AuthContext)
  const user = JSON.parse(localStorage.getItem('user')) || { id: 'test-user', role: 'tourist' };

  useEffect(() => {
    if (socket && user.id) {
        joinRoom(user.id);

        socket.on('newBooking', (data) => {
            if (user.role === 'guide') {
                setBookingRequest(data);
            }
        });

        socket.on('bookingAccepted', (data) => {
            setBookingStatus('accepted');
            setActiveBooking(data);
            if (data.bookingId) {
                socket.emit('joinBooking', data.bookingId);
            }
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
            alert(`Trip completed! Total Price: ₹${data.totalPrice}`);
        });

        return () => {
            socket.off('newBooking');
            socket.off('bookingAccepted');
            socket.off('tripStarted');
            socket.off('tripEnded');
        };
    }
  }, [socket, user]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await getNearbyGuides(lat, lng);
        setGuides(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGuides();
  }, [lat, lng]);

  useEffect(() => {
    let interval;
    if (user.role === 'guide' && bookingStatus === 'ongoing' && activeBooking?._id) {
        interval = setInterval(() => {
            // In a real app, we'd get actual GPS coordinates
            // Here we'll simulate a slight movement or just send current static for now
            socket.emit('guideLocationUpdate', {
                bookingId: activeBooking._id,
                lat: lat + (Math.random() - 0.5) * 0.001,
                lng: lng + (Math.random() - 0.5) * 0.001
            });
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [bookingStatus, activeBooking, user, socket]);

  const handleBookNow = async () => {
    try {
        if (!locationId) return alert('Location ID missing. Please search again.');
        setBookingStatus('searching');
        const res = await api.post('/bookings/create', {
            locationId,
            lat,
            lng
        });
        setActiveBooking(res.data.data);
    } catch (err) {
        setBookingStatus('idle');
        alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleAcceptTrip = async (bookingId) => {
    try {
        await api.post(`/bookings/accept/${bookingId}`);
        setBookingRequest(null);
        alert('Trip accepted! Go to destination.');
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to accept trip');
    }
  };

  const handleEndTrip = async () => {
    try {
        const res = await api.post('/bookings/end', {
            bookingId: activeBooking._id
        });
        alert(`Trip Completed! Total Price: ₹${res.data.data.totalPrice}`);
        setBookingStatus('completed');
        setActiveBooking(prev => ({ ...prev, ...res.data.data }));
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to end trip');
    }
  };

  const [isOnline, setIsOnline] = useState(false);

  const handleToggleStatus = async () => {
    try {
        const res = await api.put('/guides/toggle-status');
        setIsOnline(res.data.isOnline);
        alert(res.data.message);
    } catch (err) {
        alert('Failed to toggle status');
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <ArrowLeft className="size-6 text-gray-800" />
        </button>
        <div className="flex-1 mx-4 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div className="flex items-center truncate">
                <MapPin className="text-blue-500 mr-2 size-5 shrink-0" />
                <span className="font-semibold text-gray-800 truncate">{name}</span>
            </div>
            {user.role === 'guide' && (
                <button 
                    onClick={handleToggleStatus}
                    className={`ml-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all shadow-sm ${isOnline ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                    {isOnline ? 'Online' : 'Offline'}
                </button>
            )}
        </div>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={14}
        className="flex-1 w-full"
        zoomControl={false}
      >
        <ChangeView center={[lat, lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
            <Popup>You are here</Popup>
        </Marker>

        {guides.map((guide) => (
          <Marker
            key={guide._id}
            position={[guide.location.coordinates[1], guide.location.coordinates[0]]}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <div className="flex items-center mb-2">
                    <img src={guide.profilePhoto} alt={guide.name} className="size-10 rounded-full object-cover mr-2" />
                    <div>
                        <p className="font-bold text-gray-900 m-0">{guide.name}</p>
                        <div className="flex items-center text-xs text-yellow-500">
                            <Star className="fill-current size-3 mr-1" /> {guide.rating}
                        </div>
                    </div>
                </div>
                <button 
                  onClick={handleBookNow}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                    Book Now
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Components based on status */}
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

      {/* Nearby Guides Drawer - Only show when idle */}
      {bookingStatus === 'idle' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-[1000]">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nearby Guides</h3>
                  <span className="text-sm font-medium text-gray-500">{guides.length} available</span>
               </div>

               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {guides.map((guide) => (
                    <div 
                      key={guide._id} 
                      onClick={handleBookNow}
                      className="flex items-center p-3 rounded-2xl border border-gray-50 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer"
                    >
                      <img src={guide.profilePhoto} alt={guide.name} className="size-14 rounded-2xl object-cover shadow-sm bg-white" />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <p className="font-bold text-gray-900">{guide.name}</p>
                          <CheckCircle2 className="size-4 text-blue-500 ml-1" />
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-0.5">
                          <Star className="size-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-semibold">{guide.rating}</span>
                          <span className="mx-2">•</span>
                          <span>{(guide.distance / 1000).toFixed(1)} km away</span>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                        Book
                      </button>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
