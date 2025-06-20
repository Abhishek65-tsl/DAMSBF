import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts'; // Import echarts library
import BLT1 from '../assets/Images/BLT1.jpg'; // Changed to import BLT1.jpg

const TrendAnalysisModal = ({ isOpen, onClose, parameter }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (isOpen && parameter && chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: parameter.title + ' Trend',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: {
            dataZoom: {},
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          { type: 'inside' }, // Enable zoom and pan by dragging inside the chart
          { type: 'slider' }  // Add a slider for more explicit control
        ],
        xAxis: {
          type: 'category',
          data: Array.from({ length: 50 }, (_, i) => `Point ${i + 1}`) // More dummy data for x-axis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: parameter.title,
          type: 'line',
          data: Array.from({ length: 50 }, () => Math.floor(Math.random() * 20) + 5) // More random dummy data for series
        }]
      };

      myChart.setOption(option);

      // Clean up chart on component unmount or if modal closes
      return () => {
        myChart.dispose();
      };
    }
  }, [isOpen, parameter]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{
        backgroundImage: `url(${BLT1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay to fade the background image */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Trend Analysis: {parameter?.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
      </div>
    </div>
  );
};

export default TrendAnalysisModal; 