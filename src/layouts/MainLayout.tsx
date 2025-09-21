// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#374151', // bg-gray-700
            color: '#f9fafb',      // text-gray-50
          },
        }}
      />
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Halaman (DashboardPage/LogPage) akan dirender di sini */}
      </main>
    </div>
  );
};

export default MainLayout;