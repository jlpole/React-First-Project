import React from 'react';

const StatCard = ({ 
  label, 
  value, 
  color = 'gray',
  icon: Icon 
}) => {
  const colors = {
    gray: 'text-gray-900',
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  const textColor = colors[color] || colors.gray;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`${textColor} opacity-20`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;