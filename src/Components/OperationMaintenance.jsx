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
    <div className="flex flex-col items-center gap-4 p-2">

      {/* Operation Row */}
      <div className="w-full">
        <h2 className="text-sm font-semibold mb-1 text-center text-sky-400">Operation</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-300 w-full text-xs">
            <tbody>
              <tr>
                {data.operation.map((item, index) => (
                  <td key={index} className="px-2 py-1 border-r border-gray-200 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <FaCircle style={{ color: getStatusColor(item.status), fontSize: '10px' }} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Row */}
      <div className="w-full">
        <h2 className="text-sm font-semibold mb-1 text-center text-sky-400">Maintenance</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-300 w-full text-xs">
            <tbody>
              <tr>
                {data.maintenance.map((item, index) => (
                  <td key={index} className="px-2 py-1 border-r border-gray-200 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <FaCircle style={{ color: getStatusColor(item.status), fontSize: '10px' }} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OperationMaintenanceTable;
