import React from "react";

const InfoCardComponent = ({
  title,
  amount,
  value = 0,
  ucl = null,
  lcl = null,
  backgroundColor = null,
  titleColor = "text-gray-600",
  amountColor = "text-black",
  size = "normal",
  onClick,
}) => {
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (ucl === null || lcl === null) return "#f8fafc";

    if (value >= lcl && value <= ucl) {
      return "#d1f2eb";
    } else {
      const upperDeviation = value > ucl ? (value - ucl) / ucl : 0;
      const lowerDeviation = value < lcl ? (lcl - value) / lcl : 0;
      const maxDeviation = Math.max(upperDeviation, lowerDeviation);

      if (maxDeviation < 0.2) {
        return "#fef9e7";
      } else {
        return "#fadbd8";
      }
    }
  };

  const cardSize = size === "small" ? "p-3" : "p-4";
  const titleSize = size === "small" ? "text-sm" : "text-sm";
  const amountSize = size === "small" ? "text-lg" : "text-xl";

  // Calculate progress for the bar
  let progressPercentage = 0;
  if (ucl !== null && lcl !== null && ucl > lcl) {
    progressPercentage = ((value - lcl) / (ucl - lcl)) * 100;
    if (progressPercentage < 0) progressPercentage = 0;
    if (progressPercentage > 100) progressPercentage = 100;
  } else if (ucl !== null && value <= ucl) {
    // Fallback if only UCL is meaningful for a percentage (e.g., 0 to UCL)
    progressPercentage = (value / ucl) * 100;
    if (progressPercentage < 0) progressPercentage = 0;
    if (progressPercentage > 100) progressPercentage = 100;
  }

  return (
    <div
      className={`rounded-lg ${cardSize} shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
      style={{ backgroundColor: getBackgroundColor() }}
      onClick={onClick}
    >
      <h3 className={`${titleColor} ${titleSize} font-medium mb-0.5`}>
        {title}
      </h3>
      <div className={`${amountColor} ${amountSize}   font-semibold`}>
        {amount}
      </div>
      {(ucl !== null || lcl !== null) && (
        <div className="mt-2">
          {/* <div className="flex justify-between text-xs text-gray-500 mb-0.5">
            <span>Progress</span>
            
          </div> */}

          <div className="w-full bg-gray-200 rounded-full h-1 flex items-center justify-between">
            <div
              className="h-1 rounded-full"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor:
                  value >= lcl && value <= ucl
                    ? "#10B981" // Green for within limits
                    : value > ucl || value < lcl
                    ? "#EF4444" // Red for outside limits
                    : "#F59E0B", // Yellow for other cases (e.g., close to limits or default)
              }}
            ></div>
            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCardComponent;
