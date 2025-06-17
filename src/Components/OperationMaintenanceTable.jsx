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
    { name: 'Wind Vol', status: 'Good' },
    { name: 'Top Gas Pre', status: 'Fine' },
    { name: 'Top Gas Temp', status: 'Good' },
    { name: 'HBT', status: 'Bad' },
    { name: 'HBP', status: 'Fine' },
    { name: 'PCI Rate', status: 'Good' },
    { name: 'PCI Rate', status: 'Fine' },
  ],
  maintenance: [
    { name: 'Rotation Angle', status: 'Good' },
    { name: 'Tilting Angle', status: 'Fine' },
    { name: 'Gear Box Temp', status: 'Bad' },
    { name: 'Hopper 1 Wt', status: 'Good' },
    { name: 'Hopper 2 Wt', status: 'Good' },
    { name: 'Hydraulic Pre', status: 'Fine' },
    { name: 'Pump Status', status: 'Bad' },
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
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OperationMaintenanceTable;
