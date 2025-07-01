// src/routes/routes.jsx

import Layout from "../Components/Layout";

// ✅ Pages under /Pages
import Home from "../Pages/Home";
import BLT from "../Pages/BLT";
import NotFound from "../Pages/NotFound";
import LoginPage from "../Pages/LoginPage";
import SignOutPage from "../Pages/SignOutPage";
import ResetPasswordPage from "../Pages/ResetPasswordPage";
import SignedOutPage from "../Pages/SignedOutPage";
import MediaGallery from "../Pages/MediaGallery";
import ComingSoon from "../Pages/ComingSoon";
import AboutUs from "../Pages/AboutUs";
import AdminDashboard from "../Pages/AdminDashboard";
import AssetTimeline from "../Pages/AssetTimeline";

// ✅ ChatBot under /Pages/Dashboard/
import ChatBot from "../Pages/ChatBot"; // ✅ Corrected case-sensitive path

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "blast-furnace/bf1/", element: <BLT /> },
      { path: "blast-furnace/bf1/BLT", element: <BLT /> },
      { path: "blast-furnace/bf1/about", element: <AboutUs /> },
      { path: "blast-furnace/bf1/media-gallery", element: <MediaGallery /> },
      { path: "blast-furnace/bf1/chatbot", element: <ChatBot /> }, // ✅ Chatbot route
      { path: "blast-furnace/bf1/asset-timeline", element: <AssetTimeline /> },

      // Coming soon routes
      { path: "blast-furnace/bf2", element: <ComingSoon /> },
      { path: "caster/c1", element: <ComingSoon /> },
      { path: "caster/c2", element: <ComingSoon /> },
      { path: "caster/c3", element: <ComingSoon /> },
      { path: "bof/bof1", element: <ComingSoon /> },
      { path: "bof/bof2", element: <ComingSoon /> },
      { path: "bof/bof3", element: <ComingSoon /> },

      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // Standalone routes (outside Layout)
  { path: "/login", element: <LoginPage /> },
  { path: "/signout", element: <SignOutPage /> },
  { path: "/reset", element: <ResetPasswordPage /> },
  { path: "/signedout", element: <SignedOutPage /> },
];

export default routes;
