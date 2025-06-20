import React from 'react';

const HealthBar = ({ percentage }) => {
  const getColor = () => {
    if (percentage > 75) return 'bg-green-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-gray-300 h-2 rounded mt-1">
      <div
        className={`h-2 rounded ${getColor()}`}
        style={`{ width: ${percentage}% }`}
      ></div>
    </div>
  );
};

export default HealthBar;