import React from 'react';

const EmptyState = ({ 
  icon: Icon,
  title, 
  message, 
  actionLabel, 
  onAction,
  variant = 'default'
}) => {
  const variants = {
    default: {
      container: 'bg-gray-50 border-2 border-dashed border-gray-300',
      button: 'bg-green-800 hover:bg-green-900 text-white'
    },
    filtered: {
      container: 'bg-blue-50 border-2 border-dashed border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    error: {
      container: 'bg-red-50 border border-red-200',
      button: 'bg-red-600 hover:bg-red-700 text-white'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className="col-span-full text-center py-12">
      <div className={`${currentVariant.container} rounded-lg p-12 max-w-md mx-auto`}>
        {Icon && (
          <Icon className="mx-auto text-gray-400 mb-4" size={48} />
        )}
        
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        )}
        
        <p className="text-gray-600 mb-4">{message}</p>
        
      {actionLabel && onAction && (
  <button 
    onClick={onAction}  
    className={`px-6 py-2 rounded-lg transition-colors ${currentVariant.button}`}
  >
    {actionLabel}  // (e.g., "Retry")
  </button>

)}

        
















      </div>
    </div>
  );
};

export default EmptyState;