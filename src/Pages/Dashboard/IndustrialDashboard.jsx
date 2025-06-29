import React, { useState } from "react";
import InfoCardComponent from "../../Components/InfoCardComponent";
// import AlertCard from "../../Components/AlertCard";
import ParticleAnimation from "../../Components/Particle/ParticleAnimation";
import BLT from "../../assets/Images/BLT.jpg";
import AlertBarGraph from "../../Components/AlertBarGraph";
// import ComplianceBarGraph from "../../Components/ComplianceBarGraph";
import VisualizationPanel from "../../Components/VisualizationPanel";
import AlertSummaryBox from "../../Components/AlertSummaryBox";
import OperationMaintenanceTable from "../../Components/OperationMaintenanceTable";
import TrendAnalysisModal from "../../Components/TrendAnalysisModal";
// import OverallHealthPanel from "../../Components/OverallHealthPanel";

const IndustrialDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const handleCardClick = (parameter) => {
    console.log("Card clicked:", parameter);
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
      lcl: 30000,
    },
    { title: "HBT", amount: "5.5°C", value: 5.5, ucl: 5.0, lcl: -2.0 },
    {
      title: "PCI Rate (Tons/hr)",
      amount: "62.0",
      value: 62.0,
      ucl: 65.0,
      lcl: 50.0,
    },
    {
      title: "Hopper-1 Weight",
      amount: "45.0 T",
      value: 90.0,
      ucl: 70.0,
      lcl: 40.0,
    },
    {
      title: "LMG - 1 Operating Time",
      amount: "2.5s",
      value: 2.5,
      ucl: 5.0,
      lcl: 3.0,
    },
    {
      title: "GB Casting Temperature",
      amount: "79.0°C",
      value: 79.0,
      ucl: 80.0,
      lcl: 30.0,
    },
    {
      title: "Chute Rotating Angle",
      amount: "201.0°",
      value: 201.0,
      ucl: 200.0,
      lcl: 100.0,
    },
    {
      title: "Hydraulic Pressure",
      amount: "180.0 Bar",
      value: 180.0,
      ucl: 220.0,
      lcl: 150.0,
    },
    {
      title: "Oil Tank Particle Counter",
      amount: "19.0 | 18.5 | 17.8",
      value: 18.4,
      ucl: 20.0,
      lcl: 5.0,
    },
    { title: "HBP", amount: "4.1 Bar", value: 4.1, ucl: 6.0, lcl: 4.5 },
    {
      title: "PCI Rate (Kg/THM)",
      amount: "205.0",
      value: 205.0,
      ucl: 220.0,
      lcl: 180.0,
    },
    {
      title: "Hopper-2 Weight",
      amount: "98.0 T",
      value: 10.0,
      ucl: 100.0,
      lcl: 40.0,
    },
    {
      title: "LMG - 2 Operating Time",
      amount: "3.0s",
      value: 3.0,
      ucl: 5.0,
      lcl: 3.0,
    },
    {
      title: "GB Oil Temperature",
      amount: "28.0°C",
      value: 28.0,
      ucl: 60.0,
      lcl: 30.0,
    },
    {
      title: "Chute Tilting Angle",
      amount: "58.0°",
      value: 58.0,
      ucl: 60.0,
      lcl: 20.0,
    },
    {
      title: "Hydraulic Pump Status",
      amount: "PUMP - 1",
      value: 1,
      ucl: 2,
      lcl: 0,
    },
    {
      title: "Gearbox Temperature",
      amount: "85.0°C",
      value: 85.0,
      ucl: 80.0,
      lcl: 30.0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl px-2 mx-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* Left Parameters */}
          <div className="col-span-1 bg-white rounded-lg shadow-sm border p-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {/* <span className="w-3 h-5">⚙️</span>  */}
              PARAMETERS
            </h2>
            <div className="space-y-1.5">
              {parameters.slice(0, 7).map((param, index) => (
                <InfoCardComponent
                  key={index}
                  {...param}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>

          {/* Image + Mid Params */}
          <div className="col-span-3 flex flex-col gap-2 relative">
            {/*  Added OperationMaintenanceTable above BLT image */}
            <div className="bg-white border p-2 rounded-lg">
              <OperationMaintenanceTable />
            </div>

            <div className="bg-white  p-1">
              <div
                className="relative mx-auto"
                style={{ width: "540px", height: "600px" }}
              >
                <img
                  src={BLT}
                  alt="BLT Diagram"
                  className="object-contain rounded-md"
                  style={{ width: "85%", height: "85%" }}
                />
                <ParticleAnimation />
              </div>
            </div>
            {/* Bottom Parameters below image */}
            <div className="flex justify-around bg-white rounded-lg shadow-sm border p-4 -mt-18">
              {parameters.slice(7, 10).map((param, index) => (
                <InfoCardComponent
                  key={index}
                  {...param}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>

          {/* Right Parameters */}
          <div className="col-span-1 bg-white rounded-lg shadow-sm border p-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {/* <span className="w-3 h-5">⚙️</span>  */}
              PARAMETERS
            </h2>
            <div className="space-y-1.5">
              {parameters.slice(10, 18).map((param, index) => (
                <InfoCardComponent
                  key={index}
                  {...param}
                  size="small"
                  onClick={() => handleCardClick(param)}
                />
              ))}
            </div>
          </div>


          {/* Visualization Panel with AlertSummaryBox ..overall health..and Graphs */}
          <div className="col-span-2 p-2 h-full flex flex-col gap-4">
          {/* <div className="flex gap-40">
            <div className="w-1/2 p-2">
              <ComplianceBarGraph title="SAP PM MO Compliance" />
              <ComplianceBarGraph title="SAP PM NO Compliance" />
            </div>
          </div> */}
            <VisualizationPanel />
            <AlertBarGraph />
            {/* <AlertCard></AlertCard> */}
            <div className="flex gap-4">
              <div className="w-1/2 p-2 mt-4">
                <AlertSummaryBox />
              </div>
            </div>
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
