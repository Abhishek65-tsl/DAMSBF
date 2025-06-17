import React from "react";

const AlertCard = ({ count, type, color }) => {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800", 
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800"
  };

  return (
    <div className={`${colorMap[color]} px-3 py-2 rounded-lg flex items-center gap-2`}>
      <span className="font-bold text-lg">{count}</span>
      <span className="text-sm">{type}</span>
    </div>
  );
};

export default AlertCard;