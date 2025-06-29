// src/App.jsx
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes/routes';

function AppRoutes() {
  const element = useRoutes(routes); // Uses the new nested route definitions
  return element;
}

function App() {
  return (
    <Router basename="/DAMSBF">
      <AppRoutes />
    </Router>
  );
}

export default App;
