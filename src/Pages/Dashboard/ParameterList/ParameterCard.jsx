import React from 'react';

const ParameterCard = ({ 
  title = "Parameter", 
  amount = "0", 
  value = 0,
  ucl = null,
  lcl = null,
  backgroundColor = null,
  titleColor = "text-gray-600",
  amountColor = "text-black",
  size = "normal"
}) => {
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (ucl === null || lcl === null) return '#f8fafc';
    
    if (value >= lcl && value <= ucl) {
      return '#d1f2eb';
    } else {
      const upperDeviation = value > ucl ? (value - ucl) / ucl : 0;
      const lowerDeviation = value < lcl ? (lcl - value) / lcl : 0;
      const maxDeviation = Math.max(upperDeviation, lowerDeviation);
      
      if (maxDeviation < 0.2) {
        return '#fef9e7';
      } else {
        return '#fadbd8';
      }
    }
  };

  const cardSize = size === "small" ? "p-3" : "p-4";
  const titleSize = size === "small" ? "text-xs" : "text-sm";
  const amountSize = size === "small" ? "text-lg" : "text-xl";

  return (
    <div 
      className={`rounded-lg ${cardSize} shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <h3 className={`${titleColor} ${titleSize} font-medium mb-1`}>
        {title}
      </h3>
      <div className={`${amountColor} ${amountSize} font-bold`}>
        {amount}
      </div>
    </div>
  );
};

export default ParameterCard;