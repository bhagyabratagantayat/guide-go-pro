import React from 'react';
import { Bell, MapPin, X } from 'lucide-react';

const BookingRequestPopup = ({ request, onAccept, onDecline }) => {
    if (!request) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-sm z-[2000] px-4 animate-slide-up">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-500 p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                        <Bell className="size-4 text-blue-600 mr-2" />
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">New Request</span>
                    </div>
                    <button onClick={onDecline} className="text-gray-400 hover:text-gray-600">
                        <X className="size-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{request.userName}</h3>
                    <div className="flex items-center text-gray-600">
                        <MapPin className="size-4 text-red-500 mr-1" />
                        <span className="text-sm">{(request.distance / 1000).toFixed(1)} km away from you</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onDecline}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        Ignore
                    </button>
                    <button
                        onClick={() => onAccept(request.bookingId)}
                        className="flex-[2] py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                    >
                        Accept Trip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingRequestPopup;
