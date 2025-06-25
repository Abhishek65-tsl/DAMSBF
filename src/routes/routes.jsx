// src/routes/routes.jsx
import { Navigate } from 'react-router-dom';
import Home from '../Pages/Home';
import BLT from '../Pages/BLT';
import About from '../Pages/About';
import NotFound from '../Pages/NotFound';
import LoginPage from '../Pages/LoginPage';
import SignOutPage from '../Pages/SignOutPage';
import SignedOutPage from '../Pages/SignedOutPage';
import MediaGallery from '../Pages/MediaGallery'; // Optional: if added

const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signout',
    element: <SignOutPage />,
  },
  {
    path: '/signedout',
    element: <SignedOutPage />,
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
    path: '/media-gallery', // Optional route for gallery
    element: <MediaGallery />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
