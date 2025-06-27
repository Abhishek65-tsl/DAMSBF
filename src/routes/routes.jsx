import { Navigate } from 'react-router-dom';
import Home from '../Pages/Home';
import BLT from '../Pages/BLT';
import About from '../Pages/About';
import NotFound from '../Pages/NotFound';
import LoginPage from '../Pages/LoginPage';
import SignOutPage from '../Pages/SignOutPage';
import SignedOutPage from '../Pages/SignedOutPage';
import MediaGallery from '../Pages/MediaGallery';
import ChatBot from '../Pages/ChatBot'; // ✅ Ensure file path and name match

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
    path: '/media-gallery',
    element: <MediaGallery />,
  },
  {
    path: '/chatbot',
    element: <ChatBot />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
