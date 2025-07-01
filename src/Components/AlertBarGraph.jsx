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
        width: "100%",
        maxWidth: "600px",
        marginTop: "-30px",
        padding: "10px",
        marginBottom: "-30px",
      }}
    >
      {/* X-axis Label */}
      <div className="mt-2 text-center font-bold text-gray-700 text-sm sm:text-base">
        Alert Section
      </div>

      {/* Graph Area */}
      <div
        className="mt-2 flex items-end gap-2 sm:gap-4 pl-6 pr-4 relative"
        style={{
          height: "115px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Y-axis Line */}
        <div className="absolute left-6 bottom-0 w-0.5 h-full bg-gray-800 z-0" />
        {/* X-axis Line */}
        <div className="absolute left-6 bottom-0 h-0.5 w-full bg-gray-800 z-0" />

        {/* Y-axis Ticks */}
        <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-between text-[10px] text-gray-500">
          {[...Array(6)].map((_, i) => {
            const val = maxValue - i * 2;
            return <div key={val}>{val}</div>;
          })}
        </div>

        {/* Bars */}
        {data.map(({ name, value }) => {
          const heightPercent = (value / maxValue) * 100;

          return (
            <div
              key={name}
              className="flex flex-col items-center justify-end h-full relative z-10"
              style={{ flex: 1, minWidth: "0" }}
            >
              <div
                className="w-full max-w-[40px] bg-blue-800 rounded-t-md text-white text-[10px] font-semibold flex items-center justify-center transition-all"
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
      <div className="flex justify-around mt-4 px-4 text-[10px] text-blue-800 font-medium">
        {data.map(({ name }) => (
          <div
            key={name}
            className="flex-1 text-center break-words"
            style={{ minWidth: "0" }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertBarGraph;
