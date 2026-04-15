import React from 'react';

const ActionButton = ({ 
  icon: Icon, 
  label, 
  onClick,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variants = {
    primary: 'bg-green-800 text-white hover:bg-green-900',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'bg-white text-green-800 border-2 border-green-800 hover:bg-green-50'
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon size={20} />}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

export default ActionButton;