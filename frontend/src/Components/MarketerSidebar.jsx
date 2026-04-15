import { useState, useEffect } from 'react';
import {
  Menu, X, Home, Users, Settings,
  FileText, Bell,
  ChevronRight, ChevronDown, LogOut
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import Logout from '../Components/LogoutButton';

export default function MarketerSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/Marketer/Dashboard',
    },
 
    
  ];

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const toggleSubmenu = (index) => {
    setExpandedMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleMainItemClick = (item, index) => {
    if (item.path) {
      navigate(item.path);
    }
    if (item.submenu) {
      toggleSubmenu(index);
    }
  };

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <div
      className={`${
        isOpen ? 'w-72' : 'w-20'
      } h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm`}
    >

      {/* HEADER */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">

          <div className={`${!isOpen && 'hidden'} flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <Logo />
            </div>
            <span className="font-bold text-xl text-gray-800">
              {user?.name || 'Owner'}
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-600"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-1">

          {menuItems.map((item, index) => (
            <li key={index}>
              <div>

                {/* MAIN ITEM */}
                <button
                  onClick={() => handleMainItemClick(item, index)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                    isActive(item.path)
                      ? 'bg-green-800 text-white shadow-md'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className={`${!isOpen && 'hidden'} font-medium`}>
                      {item.label}
                    </span>
                  </div>

                  <div className={`${!isOpen && 'hidden'} flex items-center gap-2`}>
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        isActive(item.path)
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.submenu && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          expandedMenus[index] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                </button>

                {/* SUBMENU */}
                {item.submenu && isOpen && expandedMenus[index] && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subitem, subindex) => (
                      <li key={subindex}>
                        <button
                          onClick={() => handleNavigate(subitem.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                            isActive(subitem.path)
                              ? 'bg-green-100 text-green-800'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronRight size={14} />
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            </li>
          ))}

        </ul>
      </nav>

      {/* NOTIFICATION CARD - only show when open */}
      {isOpen && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Bell size={18} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-800 mb-1">
                New Updates!
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                Check out the latest features we've added.
              </p>
              <button className="text-xs font-semibold text-orange-600">
                View Details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex-shrink-0"></div>
          <div className={`${!isOpen && 'hidden'} flex-1`}>
            <p className="font-semibold text-sm text-gray-800">
              {user?.email || 'Owner'}
            </p>
          </div>
          {isOpen && (
            <Settings size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* ✅ FIXED LOGOUT - stays inside sidebar whether open or collapsed */}
      <div className="p-4 border-t border-gray-100">
        {isOpen ? (
          <Logout />
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}