import React from 'react';

const FilterSelect = ({ 
  value, 
  onChange, 
  options = [],
  placeholder = 'Select...',
  className = ''
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default FilterSelect;