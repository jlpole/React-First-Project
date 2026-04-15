import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;