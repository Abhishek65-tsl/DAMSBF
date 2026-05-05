import React from 'react';
import { FaCircle } from 'react-icons/fa';

const getStatusColor = (status) => {
  switch (status) {
    case 'Good': return '#22c55e'; // green-500
    case 'Fine': return '#facc15'; // yellow-400
    case 'Bad': return '#ef4444';  // red-500
    default: return '#9ca3af';     // gray-400
  }
};

const data = {
  operation: [
    { name: 'Wind Vol', status: 'Good' , value: 33629.1},
    { name: 'Top Gas Pre', status: 'Fine' , value: 5.5 },
    { name: 'Top Gas Temp', status: 'Good', value: 62.0 },
    { name: 'HBT', status: 'Bad',  value: "5.5°C" },
    { name: 'HBP', status: 'Fine', value: "45.0 T" },
    { name: 'PCI Rate', status: 'Good', value: "62.0" },
    { name: 'PCI Rate', status: 'Fine', value: "62.0" },
  ],
  maintenance: [
    { name: 'Rotation Angle', status: 'Good',value: "201.0°" },
    { name: 'Tilting Angle', status: 'Fine', value: "180.0°" },
    { name: 'Gear Box Temp', status: 'Bad', value: "79.0°C" },
    { name: 'Hopper 1 Wt', status: 'Good', value: "45.0 T" },
    { name: 'Hopper 2 Wt', status: 'Good', value: "45.0 T" },
    { name: 'Hydraulic Pre', status: 'Fine',value: "180.0 Bar" },
    { name: 'Pump Status', status: 'Bad',value: "Inactive" },
  ]
};

const OperationMaintenanceTable = () => {
  return (
    <div className="flex flex-col items-start gap-0 p-0 text-xs">

      {/* Operation Section */}
      <div className="w-full">
        <h2 className="text-xs font-semibold mb-1 text-sky-500">Operation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {data.operation.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <FaCircle style={{ color: getStatusColor(item.status), fontSize: '8px' }} />
              <span>{item.name}</span>
              <span>- {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Section */}
      <div className="w-full mt-1">
        <h2 className="text-xs font-semibold mb-1 text-sky-500">Maintenance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {data.maintenance.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <FaCircle style={{ color: getStatusColor(item.status), fontSize: '8px' }} />
              <span>{item.name}</span>
              <span>- {item.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OperationMaintenanceTable;
