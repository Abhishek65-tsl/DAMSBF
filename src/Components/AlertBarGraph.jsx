import React, { useState } from "react";

const AlertBarGraph = ({
  data = [
    { name: "Charge", value: 7 },
    { name: "Valve", value: 3 },
    { name: "Cooling", value: 5 },
    { name: "Hydraulic", value: 9 },
  ],
  maxValue = 10,
  darkMode = false, // Add darkMode as a prop
}) => {
  // Theme-aware color classes
  const themeClasses = {
    container: darkMode 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900',
    title: darkMode 
      ? 'text-gray-200' 
      : 'text-gray-700',
    axis: darkMode 
      ? 'bg-gray-300' 
      : 'bg-gray-800',
    ticks: darkMode 
      ? 'text-gray-400' 
      : 'text-gray-500',
    bars: darkMode 
      ? 'bg-blue-400 hover:bg-blue-300' 
      : 'bg-blue-800 hover:bg-blue-700',
    labels: darkMode 
      ? 'text-blue-300' 
      : 'text-blue-800',
  };

  return (
    <div
      className={`
        flex-col font-sans select-none rounded-lg p-4 shadow-lg transition-all duration-300
        ${themeClasses.container}
      `}
      style={{
        width: "250px",
        height: "150px",
        marginTop: "-30px",
      }}
    >
      {/* X-axis Label */}
      <div className={`mt-6 text-center font-bold transition-colors duration-300 ${themeClasses.title}`}>
        Alert Section
      </div>

      {/* Graph Area */}
      <div className="mt-0.5 flex items-end gap-4 h-[80%] pl-6 pr-4 relative">
        {/* Y-axis Line */}
        <div className={`absolute left-6 bottom-0 w-0.5 h-full z-0 transition-colors duration-300 ${themeClasses.axis}`} />
        
        {/* X-axis Line */}
        <div className={`absolute left-6 bottom-0 h-0.5 w-[calc(100%-1rem)] z-0 transition-colors duration-300 ${themeClasses.axis}`} />

        {/* Y-axis Ticks */}
        <div className={`absolute left-0 bottom-0 top-0 flex flex-col justify-between text-xs transition-colors duration-300 ${themeClasses.ticks}`}>
          {[...Array(6)].map((_, i) => {
            const val = maxValue - i * 2;
            return <div key={val}>{val}</div>;
          })}
        </div>

        {/* Bars */}
        {data.map(({ name, value }) => {
          const heightPercent = (value / maxValue) * 100;

          return (
            <div key={name} className="flex flex-col items-center justify-end h-full relative z-10">
              <div
                className={`
                  w-10 rounded-t-md text-white text-sm font-bold flex items-center justify-center 
                  transition-all duration-300 cursor-pointer transform hover:scale-105
                  ${themeClasses.bars}
                `}
                style={{ height: `${heightPercent}%` }}
                title={`${name}: ${value}`}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis Labels */}
      <div className={`flex justify-around mt-4 pl-5 text-sm font-medium transition-colors duration-300 ${themeClasses.labels}`}>
        {data.map(({ name }) => (
          <div key={name} className="w-15 px-1">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple component with toggle button
const AlertBarGraphWithToggle = (props) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`
          mb-4 px-4 py-2 rounded-md font-medium transition-all duration-300
          ${darkMode 
            ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
          }
        `}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <AlertBarGraph {...props} darkMode={darkMode} />
    </div>
  );
};

export default AlertBarGraph;
export { AlertBarGraphWithToggle };