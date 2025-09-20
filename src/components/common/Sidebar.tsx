// src/components/common/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faStream } from '@fortawesome/free-solid-svg-icons';

// Placeholder untuk Device Status Component
const DeviceStatus = () => (
    <div className="flex items-center p-3 rounded-lg bg-gray-950">
        <span className="h-3 w-3 rounded-full bg-green-500 mr-3 animate-pulse"></span>
        <span className="text-sm font-medium text-green-400">Perangkat Online</span>
    </div>
);

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