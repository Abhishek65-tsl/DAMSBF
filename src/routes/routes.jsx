// src/routes/routes.jsx
import Home from '../Pages/About';
import BLT from '../Pages/BLT';
import About from '../Pages/About';
// import Dashboard from '../pages/Dashboard';
import NotFound from '../Pages/NotFound';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/BLT',
    element: <BLT />,
  },
//   {
//     path: '/dashboard',
//     element: <Dashboard />,
//   },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
