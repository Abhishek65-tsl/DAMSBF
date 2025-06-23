import React from "react";

import IndustrialDashboard from './Dashboard/IndustrialDashboard';



function BLT() {
  
  return (
    <div>
      <h2
        style={{
          margin: "auto",
          padding: "10px",
          textAlign: "center",
          backgroundColor: "gray",
        }}
      >
        <b>BELL LESS TOP (BLT)</b>
      </h2>
      {/* <Dashboard data={data} /> */}
      <IndustrialDashboard />
    </div>
  );
}
export default BLT;