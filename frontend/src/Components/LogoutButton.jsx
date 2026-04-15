import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // ✅ ADD THIS FUNCTION
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    
    // Redirect to login
    navigate('/login');
  window.location.href = '/login';
  };

 
 
    return (
 <button   onClick={handleLogout}
      disabled={isLoggingOut}
  className="
    inline-flex w-fit-center justify-center
    
    relative overflow-hidden z-10
    px-24 py-3 text-[18px] font-medium
    rounded-xl
        bg-green-800 border border-[#e8e8e8]
        shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
        transition-all duration-200 ease-in
        text-white
        active:text-[#666]
        active:shadow-[inset_4px_4px_12px_#c5c5c5,inset_-4px_-4px_12px_#ffffff]

        hover:text-white hover:border-[#009087]

        before:content-['']
        before:absolute before:left-1/2 before:top-full
        before:w-[140%] before:h-[180%]
        before:bg-black/5
        before:rounded-full
        before:-translate-x-1/2
        before:scale-x-[1.25] before:scale-y-100
        before:transition-all before:duration-500 before:delay-100
        before:ease-[cubic-bezier(0.55,0,0.1,1)]
        before:-z-10

        after:content-['']
        after:absolute after:left-[55%] after:top-[180%]
        after:w-[160%] after:h-[190%]
        after:bg-[#009087]
        after:rounded-full
        after:-translate-x-1/2
        after:scale-x-[1.45] after:scale-y-100
        after:transition-all after:duration-500 after:delay-100
        after:ease-[cubic-bezier(0.55,0,0.1,1)]
        after:-z-10

        hover:before:top-[-35%]
        hover:before:bg-[#b60e32]
        hover:before:scale-x-[0.8]
        hover:before:scale-y-[1.3]

        hover:after:top-[-45%]
        hover:after:bg-[#b60e32]
        hover:after:scale-x-[0.8]
        hover:after:scale-y-[1.3]
      "
    >
      

              {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default Logout;
