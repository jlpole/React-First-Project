import { Search, Bell, HelpCircle, Settings } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-600">
          <HelpCircle size={20} />
        </button>
        
        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 ring-2 ring-gray-100 cursor-pointer hover:ring-gray-200 transition-all"></div>
        </div>
      </div>
    </div>
  );
}