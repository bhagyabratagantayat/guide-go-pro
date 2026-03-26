import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, MapPin, Phone, MessageSquare } from 'lucide-react';

const BookingStatus = ({ status, guide, otp, onCancel }) => {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let interval;
        if (status === 'ongoing') {
            interval = setInterval(() => setTick(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    if (status === 'idle') return null;

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-[1000] animate-slide-up">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                
                {status === 'searching' && (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <Loader2 className="size-12 text-blue-600 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Finding your Guide...</h3>
                        <p className="text-gray-500 mb-6">Broadcasting your request to nearby professional guides in Odisha.</p>
                        <button 
                            onClick={onCancel}
                            className="w-full py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                        >
                            Cancel Request
                        </button>
                    </div>
                )}

                {status === 'accepted' && guide && (
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                <ShieldCheck className="size-3 mr-1" /> GUIDE FOUND
                            </div>
                        </div>

                        <div className="flex items-center mb-6">
                            <img src={guide.profilePhoto} alt={guide.guideName} className="size-20 rounded-2xl object-cover shadow-md mr-4" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{guide.guideName}</h3>
                                <p className="text-sm text-gray-500">Your professional guide is arriving</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Share OTP to start</p>
                                <p className="text-3xl font-black text-blue-700 tracking-widest">{otp}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white rounded-xl shadow-sm text-gray-700 hover:text-blue-600 transition-colors">
                                    <Phone className="size-5" />
                                </button>
                                <button className="p-3 bg-white rounded-xl shadow-sm text-gray-700 hover:text-blue-600 transition-colors">
                                    <MessageSquare className="size-5" />
                                </button>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors">
                            Emergency SOS
                        </button>
                    </div>
                )}

                {status === 'ongoing' && (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <div className="size-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                                <Loader2 className="size-8 animate-spin-slow" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Trip in Progress</h3>
                        <p className="text-gray-500 mb-6">You are exploring with {guide?.guideName}.</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                 <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Duration</p>
                                 <p className="text-lg font-bold text-gray-800 tabular-nums">
                                    {Math.floor((Date.now() - new Date(guide?.startTime)) / 1000 / 60)}m 
                                    {(Math.floor((Date.now() - new Date(guide?.startTime)) / 1000) % 60).toString().padStart(2, '0')}s
                                 </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                 <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Current Fare</p>
                                 <p className="text-lg font-bold text-blue-600">₹{guide?.pricePerHour || 500}</p>
                            </div>
                        </div>

                        {JSON.parse(localStorage.getItem('user'))?.role === 'guide' && (
                            <button 
                                onClick={onCancel} // In MapView, this should call handleEndTrip
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                            >
                                End Trip
                            </button>
                        )}
                    </div>
                )}

                {status === 'completed' && (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <ShieldCheck className="size-8" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-1">₹{guide?.totalPrice}</h2>
                        <p className="text-gray-500 mb-6">Total fare for your trip</p>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Guide</span>
                                <span className="font-bold text-gray-900">{guide?.guideName}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-2">
                                <span className="text-gray-400">Duration</span>
                                <span className="font-bold text-gray-900">1 Hour</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingStatus;
