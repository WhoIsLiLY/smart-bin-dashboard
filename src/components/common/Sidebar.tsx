import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faStream } from '@fortawesome/free-solid-svg-icons';
import { socket } from '../../services/socket';

// --- Komponen Baru untuk Status Perangkat ---
const DeviceStatus = () => {
  const [status, setStatus] = useState('offline');
  const [deviceId, setDeviceId] = useState('N/A');

  useEffect(() => {
    // Handler untuk menerima update status
    const handleStatusUpdate = (data: { status: string; id: string }) => {
      setStatus(data.status);
      setDeviceId(data.id);
    };

    // Dengarkan event dari server
    socket.on('device_status_update', handleStatusUpdate);
    
    // Meminta status awal saat komponen pertama kali dimuat
    // (menggunakan 'connect' event dari socket.io)
    socket.on('connect', () => {
      // Tidak perlu fetch manual, server akan mengirim status saat kita terhubung
      console.log("Terhubung ke server, menunggu status perangkat...");
    });


    // Cleanup listener saat komponen unmount
    return () => {
      socket.off('device_status_update', handleStatusUpdate);
      socket.off('connect');
    };
  }, []);

  const isOnline = status === 'online';
  const statusConfig = {
    color: isOnline ? 'bg-green-500' : 'bg-red-500',
    text: isOnline ? 'Perangkat Online' : 'Perangkat Offline',
    textColor: isOnline ? 'text-green-400' : 'text-red-400'
  };

  return (
    <div className="flex items-center p-3 rounded-lg bg-gray-900 transition-all">
      <span className={`h-3 w-3 rounded-full mr-3 ${statusConfig.color} ${isOnline ? 'animate-pulse' : ''}`}></span>
      <div>
        <span className={`text-sm font-medium ${statusConfig.textColor}`}>{statusConfig.text}</span>
        <p className="text-xs text-gray-500">{deviceId}</p>
      </div>
    </div>
  );
};


const Sidebar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-emerald-600 text-white font-semibold shadow-lg'
        : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center mb-10">
        <h1 className="text-2xl font-bold text-emerald-500">SmartBin AI</h1>
      </div>
      <nav className="space-y-2">
        <NavLink to="/" className={navLinkClass}>
          <FontAwesomeIcon icon={faChartPie} className="w-6 text-center" />
          <span className="ml-3">Dashboard</span>
        </NavLink>
        <NavLink to="/log" className={navLinkClass}>
          <FontAwesomeIcon icon={faStream} className="w-6 text-center" />
          <span className="ml-3">Log Klasifikasi</span>
        </NavLink>
      </nav>
      <div className="mt-auto">
        <DeviceStatus />
      </div>
    </aside>
  );
};

export default Sidebar;
