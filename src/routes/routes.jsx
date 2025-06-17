import Home from '../Pages/Home';
import Dashboard from '../Pages/BLT/Dashboard';
import About from '../Pages/About';
import NotFound from '../Pages/NotFound';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/BLT',
    element: <Dashboard />, // Directly load the dashboard at /BLT
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
