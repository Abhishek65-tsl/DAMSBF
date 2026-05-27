import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes/routes';

function AppRoutes() {
  const element = useRoutes(routes); // Uses the new nested route definitions
  return element;
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </Router>
  );
}

export default App;
