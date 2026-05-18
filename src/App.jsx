// src/App.jsx
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes/routes';

function AppRoutes() {
  const element = useRoutes(routes); // Uses the new nested route definitions
  return element;
}

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

  return (
    <Router basename={basename}>
      <AppRoutes />
    </Router>
  );
}

export default App;
