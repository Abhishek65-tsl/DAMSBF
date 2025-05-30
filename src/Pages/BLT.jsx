import React from 'react'
import Dashboard from './BLT/Dashboard';

function BLT() {


    // === mock data ===
const data = {
    imageSrc: 'D:/Source Code/KPODAMS React/KPODAMS_UI/src/assets/Images/BLT.png',
    parameters: [
        { name: 'Temperature', value: 72.5, unit: '°F', ucl: 80, lcl: 65 },
    { name: 'Pressure', value: 14.7, unit: 'psi', ucl: 15.5, lcl: 14.0 },
    { name: 'Flow Rate', value: 42.3, unit: 'gpm' }, // UCL/LCL will be calculated
    { name: 'pH Level', value: 7.2, ucl: 8.5, lcl: 6.5 }
     ,
     { name: 'Temperature', value: 72.5, unit: '°F', ucl: 80, lcl: 65 },
     { name: 'Pressure', value: 14.7, unit: 'psi', ucl: 15.5, lcl: 14.0 },
     { name: 'Flow Rate', value: 42.3, unit: 'gpm' }, // UCL/LCL will be calculated
     { name: 'pH Level', value: 7.2, ucl: 8.5, lcl: 6.5 }
      ,
      { name: 'Temperature', value: 72.5, unit: '°F', ucl: 80, lcl: 65 },
      { name: 'Pressure', value: 14.7, unit: 'psi', ucl: 15.5, lcl: 14.0 },
      { name: 'Flow Rate', value: 42.3, unit: 'gpm' }, // UCL/LCL will be calculated
      { name: 'pH Level', value: 7.2, ucl: 8.5, lcl: 6.5 }
       ,
      /* …more… */
    ],
    gaugeGroups: [
      {
        title: 'Charging System',
        gauges: [
          { name: 'Charge', value: 75, unit: '%' },
          { name: 'Valve',   value: 60, unit: '%' },
        ],
      },
      {
        title: 'Cooling System',
        gauges: [
          { name: 'Cooling',   value: 45, unit: '%' },
          { name: 'Hydraulic', value: 90, unit: '%' },
        ],
      },
      /* …more groups like Greasing, etc… */
    ],
  };
  return (
    <div>
        <h2 style={{margin:'auto',padding:'10px',textAlign:'center',backgroundColor:'gray'}}><b>BELL LESS TOP (BLT)</b></h2>
      <Dashboard data={data} />
    </div>
  )
}

export default BLT
