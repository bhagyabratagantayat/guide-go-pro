import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

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
