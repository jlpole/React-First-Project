import { useState, useEffect } from 'react';

function MainContent({admin}){
  const [stats, setStats] = useState({
    totalBusiness: 0,
    totalUsers: 0,
    businessChange: '+0%',
    usersChange: '+0%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from: http://localhost:5000/api/admin/dashboard-stats');
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Add authorization if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Dashboard stats received:', result);
      
      if (result.success) {
        setStats({
          totalBusiness: result.data.totalBusiness,
          totalUsers: result.data.totalUsers,
          businessChange: result.data.businessChange,
          usersChange: result.data.usersChange
        });
      } else {
        setError(result.message || 'Failed to load stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="flex-1 p-8 overflow-auto flex justify-center bg-gray-50">
      <div className="max-w-8xl w-full">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back! {admin?.role || "Admin"} 
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { 
              label: 'Total Business', 
              value: loading ? '...' : stats.totalBusiness, 
              change: stats.businessChange, 
              color: 'from-blue-500 to-cyan-500' 
            },
            { 
              label: 'Total Users', 
              value: loading ? '...' : stats.totalUsers, 
              change: stats.usersChange, 
              color: 'from-purple-500 to-pink-500' 
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <p className="text-gray-600">
            Your main content goes here. The sidebar now features a clean white design with expandable/collapsible submenus and a modern top bar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainContent;