import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import Layout from './Components/Layout';
import NotFound from './Pages/NotFound';
import LoginPage from './Pages/LoginPage';
import SignOutPage from './Pages/SignOutPage';
import ResetPasswordPage from './Pages/ResetPasswordPage'; // ✅ Import added

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Public routes (NO layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signout" element={<SignOutPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} /> {/* ✅ Added Reset */}

        {/* ✅ Private routes (WITH layout) */}
        <Route path="/" element={<Layout />}>
          {routes
            .filter(r => !['/login', '/signout', '/reset'].includes(r.path))
            .map((route, index) => (
              <Route
                key={index}
                path={route.path === '/' ? '' : route.path.replace('/', '')}
                element={route.element}
              />
            ))}
          {/* Catch-all for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
