// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Halaman (DashboardPage/LogPage) akan dirender di sini */}
      </main>
    </div>
  );
};

export default MainLayout;