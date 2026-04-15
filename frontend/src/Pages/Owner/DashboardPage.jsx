import OwnerSidebar from '../../Components/OwnerSidebar';
import OwnerTopbar from '../../Components/Ownertopbar';
import OwnerMainContent from '../../Components/Ownerdcontent';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'; // ✅ hot-toast nalang, consistent sa App.jsx

function OwnerDashboard() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
  }, []);

useEffect(() => {
  const showToast = sessionStorage.getItem('showWelcomeToast');
  const userName = sessionStorage.getItem('welcomeName');
  
  if (showToast === 'true') {
    sessionStorage.removeItem('showWelcomeToast'); // ✅ clear agad
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
      <OwnerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OwnerTopbar user={loggedInUser} />
        <OwnerMainContent user={loggedInUser} />
      </div>
      {/* ❌ Remove ToastContainer — naa na sa App.jsx ang <Toaster> */}
    </div>
  );
}

export default OwnerDashboard;