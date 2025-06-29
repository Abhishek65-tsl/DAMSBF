import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import Layout from './Components/Layout';
import NotFound from './Pages/NotFound';
import './assets/styles/Darkmode.css';
import React, { useState } from 'react';
import './Components/DarkmodeToggle.css';
import AlertBarGraph, { AlertBarGraphWithToggle } from './Components/AlertBarGraph.jsx';


function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? 'dark-mode' : ''}>
      {/* Add the toggle button */}
      <button 
        onClick={() => setIsDark(!isDark)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px',
          borderRadius: '50%',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          backgroundColor: isDark ? '#333' : '#fff'
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path === '/' ? '' : route.path.replace('/', '')}
                element={route.element}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
const alertData = [
    { name: "Charge", value: 7 },
    { name: "Valve", value: 3 },
    { name: "Cooling", value: 5 },
    { name: "Hydraulic", value: 9 },
  ];

  
    <div className="App">
      <h1 className="text-2xl font-bold text-center mb-8">Alert Dashboard</h1>
      
      {/* Using the basic AlertBarGraph component */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Alert Graph</h2>
        <AlertBarGraph 
          data={alertData}
          maxValue={10}
          darkMode={false}
        />
      </div>

      {/* Using the AlertBarGraphWithToggle component */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alert Graph with Theme Toggle</h2>
        <AlertBarGraphWithToggle 
          data={alertData}
          maxValue={10}
        />
      </div>
    </div>





export default App;
