import MarketerSidebar from '../../Components/MarketerSidebar';
import { useState, useEffect } from 'react';
import MarketerTopBar from '../../Components/MarketerTopbar';
import MarketerMainContent from '../../Components/MarketerMaintContent';
import toast from 'react-hot-toast'; // ✅ add

function MarketerDashboard() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
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
    <div className="flex">
      <MarketerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MarketerTopBar user={loggedInUser} />
        <MarketerMainContent user={loggedInUser} />
      </div>
    </div>
  );
}

export default MarketerDashboard;