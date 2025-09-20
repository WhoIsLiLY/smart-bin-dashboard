import { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Filter, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Recycle, 
  Leaf, 
  Bot,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

// Enhanced type definitions
interface ClassificationLog {
  id: number;
  image_path: string;
  label: 'Organik' | 'Anorganik';
  confidence: number;
  timestamp: string;
  date: string;
  processing_time: number;
  model_version: string;
  status: 'success' | 'warning' | 'error';
}

interface FilterOptions {
  label: 'all' | 'Organik' | 'Anorganik';
  confidence: number;
  dateRange: string;
  status: 'all' | 'success' | 'warning' | 'error';
}

// Custom hook for log data management
const useLogData = () => {
  const [logs, setLogs] = useState<ClassificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateRandomLog = useCallback((): ClassificationLog => {
    const labels: ('Organik' | 'Anorganik')[] = ['Organik', 'Anorganik'];
    const statuses: ('success' | 'warning' | 'error')[] = ['success', 'success', 'success', 'warning', 'error'];
    const imageUrls = [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1572901334602-f40b9bff6994?w=150&h=150&fit=crop'
    ];
    
    const now = new Date();
    const label = labels[Math.floor(Math.random() * labels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const confidence = status === 'error' ? 
      Math.random() * 30 + 20 : 
      status === 'warning' ? 
        Math.random() * 20 + 70 : 
        Math.random() * 15 + 85;

    return {
      id: Date.now() + Math.random(),
      image_path: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      label,
      confidence: Math.round(confidence * 100) / 100,
      timestamp: now.toLocaleTimeString('id-ID'),
      date: now.toLocaleDateString('id-ID'),
      processing_time: Math.round((Math.random() * 500 + 100) * 100) / 100,
      model_version: 'v2.1.0',
      status
    };
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Initialize with some dummy data if empty
      if (logs.length === 0) {
        const initialLogs = Array.from({ length: 15 }, () => generateRandomLog());
        setLogs(initialLogs.sort((a, b) => new Date(b.date + ' ' + b.timestamp).getTime() - new Date(a.date + ' ' + a.timestamp).getTime()));
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [logs.length, generateRandomLog]);

  const addNewLog = useCallback(() => {
    const newLog = generateRandomLog();
    setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]); // Keep only last 100 logs
    setLastUpdate(new Date());
  }, [generateRandomLog]);

  useEffect(() => {
    fetchLogs();
    
    // Add new log every 8-15 seconds randomly
    const intervalId = setInterval(() => {
      addNewLog();
    }, Math.random() * 7000 + 8000);

    return () => clearInterval(intervalId);
  }, [fetchLogs, addNewLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, isLoading, lastUpdate, refreshLogs: fetchLogs, clearLogs };
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    success: { color: 'text-green-400 bg-green-400/20', icon: CheckCircle },
    warning: { color: 'text-yellow-400 bg-yellow-400/20', icon: AlertCircle },
    error: { color: 'text-red-400 bg-red-400/20', icon: AlertCircle }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} className="mr-1" />
      {status}
    </div>
  );
};

// Label badge component
const LabelBadge = ({ label }: { label: string }) => {
  const isOrganic = label === 'Organik';
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      isOrganic ? 'text-green-400 bg-green-400/20' : 'text-orange-400 bg-orange-400/20'
    }`}>
      {isOrganic ? <Leaf size={14} className="mr-1" /> : <Bot size={14} className="mr-1" />}
      {label}
    </div>
  );
};

// Confidence bar component
const ConfidenceBar = ({ confidence, status }: { confidence: number; status: string }) => {
  const getColor = () => {
    if (status === 'error') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    if (confidence >= 95) return 'bg-green-500';
    if (confidence >= 85) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold">{confidence.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
};

// Filter component
const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  isVisible 
}: { 
  filters: FilterOptions; 
  onFilterChange: (filters: FilterOptions) => void;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filter & Pencarian</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Label</label>
          <select 
            value={filters.label} 
            onChange={(e) => onFilterChange({...filters, label: e.target.value as any})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">Semua</option>
            <option value="Organik">Organik</option>
            <option value="Anorganik">Anorganik</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Min. Confidence</label>
          <input 
            type="number" 
            min="0" 
            max="100" 
            value={filters.confidence}
            onChange={(e) => onFilterChange({...filters, confidence: Number(e.target.value)})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select 
            value={filters.status} 
            onChange={(e) => onFilterChange({...filters, status: e.target.value as any})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">Semua</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal</label>
          <input 
            type="date" 
            value={filters.dateRange}
            onChange={(e) => onFilterChange({...filters, dateRange: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

// Main LogPage component
const LogPage = () => {
  const { logs, isLoading, lastUpdate, refreshLogs, clearLogs } = useLogData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ClassificationLog | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    label: 'all',
    confidence: 0,
    dateRange: '',
    status: 'all'
  });

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.timestamp.includes(searchTerm) ||
                         log.date.includes(searchTerm);
    const matchesLabel = filters.label === 'all' || log.label === filters.label;
    const matchesConfidence = log.confidence >= filters.confidence;
    const matchesStatus = filters.status === 'all' || log.status === filters.status;
    const matchesDate = !filters.dateRange || log.date === new Date(filters.dateRange).toLocaleDateString('id-ID');

    return matchesSearch && matchesLabel && matchesConfidence && matchesStatus && matchesDate;
  });

  const stats = {
    total: logs.length,
    organik: logs.filter(log => log.label === 'Organik').length,
    anorganik: logs.filter(log => log.label === 'Anorganik').length,
    avgConfidence: logs.length > 0 ? logs.reduce((sum, log) => sum + log.confidence, 0) / logs.length : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Log Klasifikasi Real-time
          </h1>
          <p className="text-gray-400 mt-2">
            Terakhir diperbarui: {lastUpdate.toLocaleTimeString('id-ID')} • {filteredLogs.length} dari {logs.length} log
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              showFilters ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button
            onClick={refreshLogs}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-all duration-300 text-white font-medium"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300 text-white font-medium"
          >
            <Trash2 size={18} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Log</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Recycle className="text-emerald-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Organik</p>
              <p className="text-2xl font-bold text-green-400">{stats.organik}</p>
            </div>
            <Leaf className="text-green-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Anorganik</p>
              <p className="text-2xl font-bold text-orange-400">{stats.anorganik}</p>
            </div>
            <Bot className="text-orange-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Confidence</p>
              <p className="text-2xl font-bold text-blue-400">{stats.avgConfidence.toFixed(1)}%</p>
            </div>
            <CheckCircle className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan label, waktu, atau tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        filters={filters} 
        onFilterChange={setFilters} 
        isVisible={showFilters} 
      />

      {/* Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="text-left p-6 font-semibold text-gray-300">Pratinjau</th>
                <th className="text-left p-6 font-semibold text-gray-300">Label</th>
                <th className="text-left p-6 font-semibold text-gray-300">Kepercayaan</th>
                <th className="text-left p-6 font-semibold text-gray-300">Status</th>
                <th className="text-left p-6 font-semibold text-gray-300">Waktu</th>
                <th className="text-left p-6 font-semibold text-gray-300">Detail</th>
                <th className="text-left p-6 font-semibold text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {isLoading && filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex justify-center">
                      <RefreshCw className="animate-spin text-emerald-500" size={32} />
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Tidak ada log yang ditemukan
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="p-6">
                      <img 
                        src={log.image_path} 
                        alt={log.label} 
                        className="h-16 w-16 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer" 
                        onClick={() => setSelectedLog(log)}
                      />
                    </td>
                    <td className="p-6">
                      <LabelBadge label={log.label} />
                    </td>
                    <td className="p-6 w-32">
                      <ConfidenceBar confidence={log.confidence} status={log.status} />
                    </td>
                    <td className="p-6">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="p-6">
                      <div className="flex items-center text-gray-300">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{log.timestamp}</div>
                          <div className="text-sm text-gray-500">{log.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-400">
                      <div>Proses: {log.processing_time}ms</div>
                      <div>Model: {log.model_version}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors duration-200"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors duration-200">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for image preview */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Detail Klasifikasi</h3>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedLog.image_path} 
                    alt={selectedLog.label} 
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Klasifikasi</label>
                    <LabelBadge label={selectedLog.label} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tingkat Kepercayaan</label>
                    <ConfidenceBar confidence={selectedLog.confidence} status={selectedLog.status} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <StatusBadge status={selectedLog.status} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Waktu Pemrosesan</label>
                    <p className="text-white">{selectedLog.processing_time} ms</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Model Version</label>
                    <p className="text-white">{selectedLog.model_version}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Timestamp</label>
                    <p className="text-white">{selectedLog.date} {selectedLog.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogPage;