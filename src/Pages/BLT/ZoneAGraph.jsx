import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts';

const data = [
  { name: 'Zone A', percent: 78 }
];

const ZoneAGraph = () => (
  <div style={{
    width: 300,
    height: 250,
    background: '#ffffff',               // White background
    padding: '10px',
    borderRadius: '10px',
    color: '#002147',                    // Dark blue text
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '10px',
      fontWeight: 'bold',
      color: '#002147'
    }}>
      SAP PM MO Compliance
    </div>
    <ResponsiveContainer width="100%" height="80%">
      <BarChart data={data} barSize={60} margin={{ top: 10, right: 10, bottom: 10, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="#002147"
          tick={{ fill: '#002147' }}
        />
        <YAxis stroke="#002147" tick={{ fill: '#002147' }}>
          <Label
            value="Orders"
            angle={-90}
            position="insideLeft"
            style={{ fill: '#002147', fontSize: 14 }}
          />
        </YAxis>
        <Tooltip contentStyle={{ backgroundColor: '#f0f8ff', color: '#002147' }} />
        <Bar dataKey="percent" fill="#004080" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ZoneAGraph;
