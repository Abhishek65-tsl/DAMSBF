import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import Layout from './Components/Layout';
import NotFound from './Pages/NotFound';
import LoginPage from './Pages/LoginPage';
import SignOutPage from './Pages/SignOutPage';
import ResetPasswordPage from './Pages/ResetPasswordPage'; // ✅ Added

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Public routes (NO layout wrapper) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signout" element={<SignOutPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />

        {/* ✅ All other private routes (WITH layout wrapper) */}
        <Route path="/" element={<Layout />}>
          {routes
            .filter(route => !['/login', '/signout', '/reset'].includes(route.path))
            .map((route, index) => (
              <Route
                key={index}
                path={route.path === '/' ? '' : route.path.replace('/', '')}
                element={route.element}
              />
            ))}

          {/* Catch-all for unknown private routes */}
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
