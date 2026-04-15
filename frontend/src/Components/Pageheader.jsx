import React from 'react';

const PageHeader = ({ 
  title, 
  description,
  action 
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default PageHeader;