// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Pages/Home';
// import About from './Pages/About';
// import NotFound from './Pages/NotFound';
// import Layout from './Components/Layout';
// import BLT from './Pages/BLT';
// import Dashboard from './Pages/Dashboard/Dashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route path="home" element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="BLT" element={<BLT />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import Layout from './Components/Layout';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <Router basename="/DAMSBF">
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
  );
}

export default App;
