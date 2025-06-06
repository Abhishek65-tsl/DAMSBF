import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const getColor = (status) => {
  switch (status) {
    case 'Healthy': return '#4ade80'; // soft green
    case 'Warning': return '#facc15'; // soft yellow
    case 'Critical': return '#f87171'; // soft red
    default: return '#cbd5e1'; // neutral
  }
};

const getPercentage = (status) => {
  switch (status) {
    case 'Healthy': return 85;
    case 'Warning': return 55;
    case 'Critical': return 25;
    default: return 0;
  }
};

const MachineCard = ({ title, healthStatus }) => {
  const color = getColor(healthStatus);
  const percentage = getPercentage(healthStatus);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-center gap-4">
      <div className="w-16 h-16">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: '#334155',
            trailColor: '#e2e8f0',
            textSize: '28px',
            pathTransitionDuration: 0.5
          })}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className={`text-sm mt-1 font-medium ${
          healthStatus === 'Healthy' ? 'text-green-500' :
          healthStatus === 'Warning' ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {healthStatus}
        </p>
      </div>
    </div>
  );
};

export default MachineCard;

