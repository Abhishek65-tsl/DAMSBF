// src/routes/routes.jsx
import Layout from "../Components/Layout";
import Home from "../Pages/Home";
import BLT from "../Pages/BLT";
import About from "../Pages/About";
import NotFound from "../Pages/NotFound";
import LoginPage from "../Pages/LoginPage";
import SignOutPage from "../Pages/SignOutPage";
import ResetPasswordPage from "../Pages/ResetPasswordPage";
import SignedOutPage from "../Pages/SignedOutPage";
import ChatBot from "../Pages/ChatBot";
import ComingSoon from "../Pages/ComingSoon";

// ✅ Correct imports
import AdminDashboard from "../Pages/AdminDashboard";
import AssetTimeline from "../Pages/AssetTimeline";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "blast-furnace/bf1/", element: <BLT /> },
      { path: "blast-furnace/bf1/BLT", element: <BLT /> },
      { path: "blast-furnace/bf1/about", element: <About /> },
      { path: "blast-furnace/bf1/chatbot", element: <ChatBot /> },

      // ✅ Fixed route for AssetTimeline (matching sidebar)
      { path: "blast-furnace/bf1/asset-timeline", element: <AssetTimeline /> },

      // ❌ MediaGallery removed

      // Placeholder routes
      { path: "blast-furnace/bf2", element: <ComingSoon /> },
      { path: "caster/c1", element: <ComingSoon /> },
      { path: "caster/c2", element: <ComingSoon /> },
      { path: "caster/c3", element: <ComingSoon /> },
      { path: "bof/bof1", element: <ComingSoon /> },
      { path: "bof/bof2", element: <ComingSoon /> },
      { path: "bof/bof3", element: <ComingSoon /> },

      // Admin dashboard
      { path: "admin-dashboard", element: <AdminDashboard /> },

      // Catch-all
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signout", element: <SignOutPage /> },
  { path: "/reset", element: <ResetPasswordPage /> },
  { path: "/signedout", element: <SignedOutPage /> },
];

export default routes;
