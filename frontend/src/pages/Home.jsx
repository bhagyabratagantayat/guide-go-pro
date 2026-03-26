import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import { getLocations } from '../api';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Location permission denied. Using default center.");
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const res = await getLocations(searchTerm);
          setSuggestions(res.data.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (loc) => {
    navigate(`/map?lat=${loc.coordinates.coordinates[1]}&lng=${loc.coordinates.coordinates[0]}&name=${loc.name}&locationId=${loc._id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-gray-900 tracking-tight">
          Find Your <span className="text-blue-600">Local Guide</span>
        </h1>
        <p className="mb-8 text-lg text-gray-600">Discover Odisha like never before with professional local experts.</p>

        <div className="relative">
          <div className="flex items-center w-full p-4 bg-white rounded-2xl shadow-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Search className="text-gray-400 mr-3" />
            <input
              type="text"
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Where are you going? (e.g. Khandagiri)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {suggestions.map((loc) => (
                <div
                  key={loc._id}
                  className="flex items-center p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-0"
                  onClick={() => handleSelect(loc)}
                >
                  <MapPin className="text-blue-500 mr-3 size-5" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{loc.name}</p>
                    <p className="text-sm text-gray-500">{loc.city}, Odisha</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Historical', 'Nature', 'Pilgrimage', 'Beach'].map((cat) => (
             <button key={cat} className="px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all text-gray-700 font-medium">
                {cat}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
