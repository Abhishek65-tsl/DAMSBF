// src/routes/routes.jsx
import Layout from "../Components/Layout";
import Home from "../Pages/Home";
import BLT from "../Pages/BLT";
import NotFound from "../Pages/NotFound";
import LoginPage from "../Pages/LoginPage";
import SignOutPage from "../Pages/SignOutPage";
import ResetPasswordPage from "../Pages/ResetPasswordPage";
import SignedOutPage from "../Pages/SignedOutPage";
import MediaGallery from "../Pages/MediaGallery";
import ChatBot from "../Pages/ChatBot";
import ComingSoon from "../Pages/ComingSoon";
import AboutUs from "../Pages/AboutUs"; 
import AdminDashboard from "../Pages/AdminDashboard";
import AssetTimeline from "../Pages/AssetTimeline";
import FurnaceOverview from "../Pages/FurnaceOverview";
import HotBlastfurnace from "../Pages/HotBlast";
import TuyereNose from "../Pages/TuyereNose";
import TuyereNose2 from "../Pages/TuyereNose2"; //
import OverallStatus from "../Pages/OverallStatus";
import HealthStatus from "../Pages/HealthStatus";
import NewBLTHMI from "../Pages/blt/NewBLTHMI";
import ChargingSystem from "../Pages/blt/ChargingSystem";
import CoolingSystem from "../Pages/blt/CoolingSystem";
import ValveSystem from "../Pages/blt/ValveSystem";
import HydraulicView from "../Pages/blt/HydraulicView";
import H_F_C from "../Pages/H_F_C";
import MouldCooling from "../Pages/MouldCooling";
import MouldStrand1 from "../Pages/MouldStrand1";
import NewMouldPage from "../Pages/NewMouldPage";
import Slabstuck from "../Pages/Slabstuck";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "dams-blt", element: <NewBLTHMI /> },
      { path: "charging-system", element: <ChargingSystem /> },
      { path: "cooling-system", element: <CoolingSystem /> },
      { path: "valve-system", element: <ValveSystem /> },
      { path: "hydraulic-view", element: <HydraulicView /> },
      { path: "slabStuck", element: <Slabstuck /> },
      { path: "newMouldPage", element: <NewMouldPage /> },
      { path: "mouldStrand", element: <MouldStrand1 /> },
      { path: "mouldCooling", element: <MouldCooling /> },
      { path: "hfc", element: <H_F_C /> },
      { path: "dams-caster/hfc", element: <H_F_C /> },
      { path: "dams-caster/mould-cooling", element: <MouldCooling /> },
      { path: "dams-caster/mould-strand", element: <MouldStrand1 /> },
      { path: "dams-caster/new-mould-page", element: <NewMouldPage /> },
      { path: "dams-caster/slab-stuck", element: <Slabstuck /> },
      { path: "blast-furnace/bf1/", element: <BLT /> },
      { path: "blast-furnace/bf1/BLT", element: <BLT /> },
      { path: "blast-furnace/bf1/about", element: <AboutUs /> }, 
      { path: "blast-furnace/bf1/media-gallery", element: <MediaGallery /> },
      { path: "blast-furnace/bf1/chatbot", element: <ChatBot /> },
      { path: "blast-furnace/bf1/asset-timeline", element: <AssetTimeline /> },

      { path: "blast-furnace/bf2", element: <ComingSoon /> },
                       
      // Caster Routes
      { path: "caster/c1", element: <ComingSoon /> },
      { path: "caster/c2", element: <ComingSoon /> },
      { path: "caster/c3", element: <ComingSoon /> },

      // BOF Routes
      { path: "bof/bof1", element: <ComingSoon /> },
      { path: "bof/bof3", element: <ComingSoon /> },
      { path: "bof/bof2", element: <ComingSoon /> },

      // Furnace Routes
      { path: "furnace/overview", element: <FurnaceOverview /> },
      { path: "furnace/hot-blast-flow", element: <HotBlastfurnace /> },
      { path: "furnace/tuyere-nose-system-1", element: <TuyereNose /> },
      { path: "furnace/tuyere-nose-system-2", element: <TuyereNose2 /> },

      

      // Admin Routes
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "overall-status", element: <OverallStatus /> },
      { path: "health-status", element: <HealthStatus /> },
      
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signout", element: <SignOutPage /> },
  { path: "/reset", element: <ResetPasswordPage /> },
  { path: "/signedout", element: <SignedOutPage /> },
  
];

export default routes;
