import React from "react";

const AlertBarGraph = ({
  data = [
    { name: "Charge", value: 7 },
    { name: "Valve", value: 3 },
    { name: "Cooling", value: 5 },
    { name: "Hydraulic", value: 9 },
  ],
  maxValue = 10,
}) => {
  return (
    <div
      className="flex-col font-sans select-none"
      style={{
        width: "250px",       // ← Change width here
        height: "150px",      // ← Change height here
        marginTop: "-30px",    // ← Move down (use negative value like -10px to move up)
        // marginBottom: "10px", // ← Optional: to move it further down
      }}
    >
      {/* X-axis Label */}
      <div className="mt-6 text-center font-bold text-gray-700">Alert Section</div>

      {/* Graph Area */}
      <div className="mt-0.5 flex items-end gap-4 h-[80%] pl-6 pr-4 relative">
        {/* Y-axis Line */}
        <div className="absolute left-6 bottom-0 w-0.5 h-full bg-gray-800 z-0" />
        {/* X-axis Line */}
        <div className="absolute left-6 bottom-0 h-0.5 w-[calc(100%-1rem)] bg-gray-800 z-0" />

        {/* Y-axis Ticks */}
        <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-between text-xs text-gray-500">
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
                className="w-10 bg-blue-800 rounded-t-md text-white text-sm font-bold flex items-center justify-center transition-all"
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
      <div className="flex justify-around mt-4 pl-5 text-sm text-blue-800 font-small">
        {data.map(({ name }) => (
          <div key={name} className="w-15 px-1">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertBarGraph;