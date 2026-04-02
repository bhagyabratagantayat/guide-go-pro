import { CONFIG } from '../config';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(CONFIG.BASE_URL);
        setSocket(newSocket);

        // Auto-join if user exists in localStorage
        const savedUserStr = localStorage.getItem('user');
        if (savedUserStr) {
            try {
                const savedUser = JSON.parse(savedUserStr);
                if (savedUser && savedUser._id) {
                    newSocket.emit('join', savedUser._id);
                }
            } catch (err) {
                console.error('Error auto-joining socket:', err);
            }
        }

        return () => newSocket.close();
    }, []);

    const joinRoom = (userId) => {
        if (socket) {
            socket.emit('join', userId);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, joinRoom }}>
            {children}
        </SocketContext.Provider>
    );
};
