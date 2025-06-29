import React from "react";

import IndustrialDashboard from './Dashboard/IndustrialDashboard';



function BLT() {
  
  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Content */}
      <div>
        <div className="flex justify-between items-center px-6 py-2 bg-gray-300">
          <h2 className="text-center font-bold text-lg">
            BELL LESS TOP (BLT)
          </h2>
        </div>

        <IndustrialDashboard />
      </div>
    </div>
  );
}
export default BLT;