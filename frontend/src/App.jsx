import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapView from './pages/MapView';
import { SocketProvider } from './context/SocketContext';
import './index.css';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
