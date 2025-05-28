import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import NotFound from './Pages/NotFound';
import Layout from './Components/Layout';
import BLT from './Pages/BLT';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="BLT" element={<BLT />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;





// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './Components/Layout';
// import routes from './routes/routes';
// import NotFound from './Pages/NotFound';

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           {routes.map((route, index) => (
//             <Route
//               key={index}
//               path={route.path}
//               element={route.element}
//             />
//           ))}
//            <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;
