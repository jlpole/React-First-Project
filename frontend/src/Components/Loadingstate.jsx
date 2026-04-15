import React from 'react';

const LoadingState = ({ 
  message = 'Loading...', 
  size = 'md',
  color = 'green' 
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const colors = {
    green: 'border-green-800',
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    red: 'border-red-600'
  };

  return (
    <div className="col-span-full text-center py-12">
      <div className={`inline-block animate-spin rounded-full ${sizes[size]} border-b-2 ${colors[color]} mb-4`}></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;