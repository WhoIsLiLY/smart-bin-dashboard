import { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, Recycle, Leaf, Bot, RefreshCw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Enhanced type definitions
interface StatData {
  total: number;
  organik: number;
  anorganik: number;
  percentage: {
    organik: number;
    anorganik: number;
  };
}

interface WeeklyActivity {
  day: string;
  amount: number;
}

interface DashboardData {
  stats: StatData;
  weeklyActivity: WeeklyActivity[];
  lastUpdated: Date;
}

// Custom hook for dashboard data management
const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    stats: { 
      total: 0, 
      organik: 0, 
      anorganik: 0, 
      percentage: { organik: 0, anorganik: 0 }
    },
    weeklyActivity: [
      { day: 'Sen', amount: 0 },
      { day: 'Sel', amount: 0 },
      { day: 'Rab', amount: 0 },
      { day: 'Kam', amount: 0 },
      { day: 'Jum', amount: 0 },
      { day: 'Sab', amount: 0 },
      { day: 'Min', amount: 0 }
    ],
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Enhanced data simulation
      const newTotal = Math.floor(Math.random() * (300 - 150) + 150);
      const organikPercentage = Math.random() * (0.65 - 0.35) + 0.35;
      const newOrganik = Math.floor(newTotal * organikPercentage);
      const newAnorganik = newTotal - newOrganik;
      
      const newActivity = Array.from({ length: 7 }, () => 
        Math.floor(Math.random() * (50 - 10) + 10)
      );

      const newData: DashboardData = {
        stats: {
          total: newTotal,
          organik: newOrganik,
          anorganik: newAnorganik,
          percentage: {
            organik: Math.round((newOrganik / newTotal) * 100),
            anorganik: Math.round((newAnorganik / newTotal) * 100)
          }
        },
        weeklyActivity: [
          { day: 'Sen', amount: newActivity[0] },
          { day: 'Sel', amount: newActivity[1] },
          { day: 'Rab', amount: newActivity[2] },
          { day: 'Kam', amount: newActivity[3] },
          { day: 'Jum', amount: newActivity[4] },
          { day: 'Sab', amount: newActivity[5] },
          { day: 'Min', amount: newActivity[6] }
        ],
        lastUpdated: new Date()
      };

      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, isLoading, refreshData: fetchData };
};

// Enhanced StatCard component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'emerald',
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  trend?: number;
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
  subtitle?: string;
}) => {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-6 rounded-2xl border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

// Main Dashboard Component
const DashboardPage = () => {
  const { data, isLoading, refreshData } = useDashboardData();

  // Chart configurations
  const doughnutData = {
    labels: ['Organik', 'Anorganik'],
    datasets: [{
      data: [data.stats.organik, data.stats.anorganik],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
      hoverBorderWidth: 4,
      cutout: '60%'
    }]
  };

  const barData = {
    labels: data.weeklyActivity.map(item => item.day),
    datasets: [{
      label: 'Jumlah Sampah (kg)',
      data: data.weeklyActivity.map(item => item.amount),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    },
    animation: {
      duration: 800,
      easing: 'easeInOutCubic'
    }
  };

  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom' as const,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Dashboard Analitik
          </h1>
          <p className="text-gray-400 mt-2">
            Terakhir diperbarui: {data.lastUpdated.toLocaleTimeString('id-ID')}
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-all duration-300 text-white font-medium"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sampah" 
          value={`${data.stats.total} kg`}
          icon={Recycle} 
          color="emerald"
          subtitle="Total keseluruhan"
        />
        <StatCard 
          title="Sampah Organik" 
          value={`${data.stats.organik} kg`}
          icon={Leaf} 
          color="blue"
          subtitle={`${data.stats.percentage.organik}% dari total`}
        />
        <StatCard 
          title="Sampah Anorganik" 
          value={`${data.stats.anorganik} kg`}
          icon={Bot} 
          color="orange"
          subtitle={`${data.stats.percentage.anorganik}% dari total`}
        />
        <StatCard 
          title="Rata-rata Harian" 
          value={`${Math.round(data.weeklyActivity.reduce((sum, item) => sum + item.amount, 0) / 7)} kg`}
          icon={TrendingUp} 
          color="purple"
          subtitle="Minggu ini"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Doughnut Chart */}
        <div className="xl:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Komposisi Sampah
            </h3>
            <div className="h-80 relative">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-emerald-500/10 rounded-lg p-3">
                <p className="text-emerald-400 font-bold text-lg">{data.stats.organik} kg</p>
                <p className="text-gray-400 text-sm">Organik</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3">
                <p className="text-red-400 font-bold text-lg">{data.stats.anorganik} kg</p>
                <p className="text-gray-400 text-sm">Anorganik</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="xl:col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Aktivitas Mingguan
            </h3>
            <div className="h-80 relative">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <Bar data={barData} options={chartOptions} />
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Total minggu ini: <span className="text-emerald-400 font-bold">
                  {data.weeklyActivity.reduce((sum, item) => sum + item.amount, 0)} kg
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Dashboard ini diperbarui secara otomatis setiap 10 detik
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;