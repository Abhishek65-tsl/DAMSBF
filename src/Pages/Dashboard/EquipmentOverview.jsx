import React from 'react';
// import BLT from '../assets/Images/BLT.png'; // adjust the path based on your structure
import ParticleAnimation from "../../Components/Particle/ParticleAnimation"   // optional: only if you're using it

const EquipmentOverview = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="font-semibold mb-4">Equipment Overview</h3>

      <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center p-6">
        <img
        //   src={BLT}
          alt="Bell Less Top"
          className="w-[350px] h-auto object-contain mb-3"
        />

        <p className="text-gray-600 font-medium mb-2">Equipment Diagram</p>

        {/* Optional Particle Animation (if applicable) */}
        <ParticleAnimation />
      </div>
    </div>
  );
};

export default EquipmentOverview;
