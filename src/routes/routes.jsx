// src/routes.jsx

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

// Pages for Admin and Furnace Systems
import AdminDashboard from "../Pages/AdminDashboard";
import AssetTimeline from "../Pages/AssetTimeline";
import FurnaceOverview from "../Pages/FurnaceOverview";
import HotBlastfurnace from "../Pages/HotBlast";
import TuyereNose from "../Pages/TuyereNose";
import TuyereNose2 from "../Pages/TuyereNose2"; // ✅ Tuyere Nose System 2

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },

      // Blast Furnace Routes
      { path: "blast-furnace/bf1/", element: <BLT /> },
      { path: "blast-furnace/bf1/BLT", element: <BLT /> },
      { path: "blast-furnace/bf1/about", element: <About /> },
      { path: "blast-furnace/bf1/chatbot", element: <ChatBot /> },
      { path: "blast-furnace/bf1/asset-timeline", element: <AssetTimeline /> },
      { path: "blast-furnace/bf2", element: <ComingSoon /> },

      // Caster Routes
      { path: "caster/c1", element: <ComingSoon /> },
      { path: "caster/c2", element: <ComingSoon /> },
      { path: "caster/c3", element: <ComingSoon /> },

      // BOF Routes
      { path: "bof/bof1", element: <ComingSoon /> },
      { path: "bof/bof2", element: <ComingSoon /> },
      { path: "bof/bof3", element: <ComingSoon /> },

      // Furnace Routes
      { path: "furnace/overview", element: <FurnaceOverview /> },
      { path: "furnace/hot-blast-flow", element: <HotBlastfurnace /> },
      { path: "furnace/tuyere-nose-system-1", element: <TuyereNose /> },
      { path: "furnace/tuyere-nose-system-2", element: <TuyereNose2 /> }, // ✅ Added properly

      // Admin
      { path: "admin-dashboard", element: <AdminDashboard /> },

      // Not Found
      { path: "*", element: <NotFound /> },
    ],
  },

  // Auth Routes (outside Layout)
  { path: "/login", element: <LoginPage /> },
  { path: "/signout", element: <SignOutPage /> },
  { path: "/reset", element: <ResetPasswordPage /> },
  { path: "/signedout", element: <SignedOutPage /> },
];

export default routes;
