import { Search, Bell, HelpCircle, Settings } from 'lucide-react';

export default function TopbarBusiness() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Business Details</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
    
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
     
          </div>
       
        </div>
      </div>
    </div>
  );
}