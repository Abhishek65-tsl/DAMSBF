import React, { useState } from "react";
import InfoCardComponent from "../../Components/InfoCardComponent";
import CircularProgress from "../../Components/CircularProgress";
import AlertCard from "../../Components/AlertCard";
import ParticleAnimation from "../../Components/Particle/ParticleAnimation";
import BLT from "../../assets/Images/BLT.jpg";
import EquipmentOverview from "./EquipmentOverview";
import AlertBarGraph from "../../Components/AlertBarGraph";
import ComplianceBarGraph from "../../Components/ComplianceBarGraph";
import VisualizationPanel from "../../Components/VisualizationPanel";
import AlertSummaryBox from "../../Components/AlertSummaryBox";
import TrendAnalysisModal from "../../Components/TrendAnalysisModal";

const IndustrialDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const handleCardClick = (parameter) => {
    setSelectedParameter(parameter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParameter(null);
  };

  const parameters = [
  {
    title: "Wind Volume(Nm³/hr)",
    amount: "33629.1",
    value: 33629.1,
    ucl: 35000,
    lcl: 30000, // ✅ Green
  },
  {
    title: "HBT",
    amount: "5.5°C",
    value: 5.5,
    ucl: 5.0,
    lcl: -2.0, // 🔴 Red (above UCL)
  },
  {
    title: "PCI Rate (Tons/hr)",
    amount: "62.0",
    value: 62.0,
    ucl: 65.0,
    lcl: 50.0, // 🟡 Yellow (close to UCL)
  },
  {
    title: "Hopper-1 Weight",
    amount: "45.0 T",
    value: 90.0,
    ucl: 70.0,
    lcl: 40.0, // ✅ Green
  },
  {
    title: "LMG - 1 Operating Time",
    amount: "2.5s",
    value: 2.5,
    ucl: 5.0,
    lcl: 3.0, // 🔴 Red (below LCL)
  },
  {
    title: "GB Casting Temperature",
    amount: "79.0°C",
    value: 79.0,
    ucl: 80.0,
    lcl: 30.0, // 🟡 Yellow (near UCL)
  },
  {
    title: "Chute Rotating Angle",
    amount: "201.0°",
    value: 201.0,
    ucl: 200.0,
    lcl: 100.0, // 🔴 Red (above UCL)
  },
  {
    title: "Hydraulic Pressure",
    amount: "180.0 Bar",
    value: 180.0,
    ucl: 220.0,
    lcl: 150.0, // ✅ Green
  },
  {
    title: "Oil Tank Particle Counter",
    amount: "19.0 | 18.5 | 17.8",
    value: 18.4,
    ucl: 20.0,
    lcl: 5.0, // 🟡 Yellow
  },
  {
    title: "HBP",
    amount: "4.1 Bar",
    value: 4.1,
    ucl: 6.0,
    lcl: 4.5, // 🔴 Red (below LCL)
  },
  {
    title: "PCI Rate (Kg/THM)",
    amount: "205.0",
    value: 205.0,
    ucl: 220.0,
    lcl: 180.0, // ✅ Green
  },
  {
    title: "Hopper-2 Weight",
    amount: "98.0 T",
    value: 10.0,
    ucl: 100.0,
    lcl: 40.0, // ✅ Green
  },
  {
    title: "LMG - 2 Operating Time",
    amount: "3.0s",
    value: 3.0,
    ucl: 5.0,
    lcl: 3.0, // 🟡 Yellow (on edge of LCL)
  },
  {
    title: "GB Oil Temperature",
    amount: "28.0°C",
    value: 28.0,
    ucl: 60.0,
    lcl: 30.0, // 🔴 Red (below LCL)
  },
  {
    title: "Chute Tilting Angle",
    amount: "58.0°",
    value: 58.0,
    ucl: 60.0,
    lcl: 20.0, // ✅ Green
  },
  {
    title: "Hydraulic Pump Status",
    amount: "PUMP - 1",
    value: 1,
    ucl: 2,
    lcl: 0, // ✅ Green (assuming PUMP - 1 is valid)
  },
  {
    title: "Gearbox Temperature",
    amount: "85.0°C",
    value: 85.0,
    ucl: 80.0,
    lcl: 30.0, // 🔴 Red (above UCL)
  },
];



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl px-2 mx-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Left Parameters */}
          <div className="bg-white rounded-lg shadow-sm border p-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-5 h-5">⚙️</span>
              PARAMETERS
            </h2>
            <div className="space-y-1.5">
              {parameters.slice(0,7).map((param, index) => (
                <InfoCardComponent
                  key={index}
                  title={param.title}
                  amount={param.amount}
                  value={param.value}
                  ucl={param.ucl}
                  lcl={param.lcl}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>

          {/* Image + Compliance */}
          <div className="space-y-4 col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-2">
              <div className="relative w-full h-120 mx-auto">
                <img
                  src={BLT}
                  alt="BLT Diagram"
                  className="w-full h-full object-contain rounded-md"
                />
                <ParticleAnimation />
              </div>
              {/* Bottom Parameters below image */}
            </div>
              <div className="flex justify-around bg-white rounded-lg shadow-sm border p-4 mt-4">
                {parameters.slice(7, 10).map((param, index) => (
                  <InfoCardComponent
                    key={index}
                    title={param.title}
                    amount={param.amount}
                    value={param.value}
                    ucl={param.ucl}
                    lcl={param.lcl}
                    size="small"
                    onClick={() => handleCardClick(param)}
                  />
                ))}
              </div>

            {/* Visualization Panel */}
          </div>

          {/* Right Parameters */}
          <div className="bg-white rounded-lg shadow-sm border p-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-5 h-5">⚙️</span>
              PARAMETERS
            </h2>
            <div className="space-y-1.5">
              {parameters.slice(10,18).map((param, index) => (
                <InfoCardComponent
                  key={index}
                  title={param.title}
                  amount={param.amount}
                  value={param.value}
                  ucl={param.ucl}
                  lcl={param.lcl}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>

          {/* Right Alerts Section */}
          <div className="space-y- col-span-1">
            {/* Recent Alerts */}
            {/* <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-5 h-5">⚠️</span>
                Recent Alerts
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>BFT spout time • BF2 spout response time</div>
                <div>CSPT opening time • CSV2 open response time</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <AlertCard count="654" type="Total" color="green" />
                <AlertCard count="39" type="Open" color="yellow" />
                <AlertCard count="395" type="Closed" color="red" />
                <AlertCard count="6" type="Ack" color="blue" />
              </div>
            </div> */}
            <AlertSummaryBox />
            <div className="">
              {/* Alert Graph */}
              <div className="">
                <AlertBarGraph />
              </div>
              <div className="">
                <ComplianceBarGraph />
              </div>
            </div>
          </div>
          <div className="col-span-1 mt-37 ml-6">
            <VisualizationPanel />
          </div>
        </div>
      </div>
      <TrendAnalysisModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        parameter={selectedParameter}
      />
    </div>
  );
};

export default IndustrialDashboard;
