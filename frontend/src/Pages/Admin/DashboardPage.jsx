import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar';
import Topbar from '../../Components/Topbar';
import MainContent from '../../Components/DashboardContent';
import toast from 'react-hot-toast'; // ✅ add

const AdminDashboard = () => {
  const [user, setAdmin] = useState(null);

  useEffect(() => {
    const getuser = localStorage.getItem('user');
    if (getuser) setAdmin(JSON.parse(getuser));
  }, []);

  // ✅ add this
  useEffect(() => {
    const showToast = sessionStorage.getItem('showWelcomeToast');
    const userName = sessionStorage.getItem('welcomeName');

    if (showToast === 'true') {
      sessionStorage.removeItem('showWelcomeToast');
      sessionStorage.removeItem('welcomeName');

      setTimeout(() => {
        toast.success(`Welcome, ${userName}! Glad to have you here.`, {
          duration: 4000,
          style: {
            background: '#15803d',
            color: '#ffffff',
          },
        });
      }, 300);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 p-8 overflow-auto flex justify-center bg-gray-50">
          <div className="max-w-8xl w-full">
            <MainContent admin={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;