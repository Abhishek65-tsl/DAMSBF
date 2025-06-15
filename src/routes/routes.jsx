// src/routes/routes.jsx
import Home from '../Pages/Home';
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
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
