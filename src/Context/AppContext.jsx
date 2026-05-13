import { createContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
    theme: 'light',
  });

  const login = (userData) => {
    setState({ ...state, user: userData, isAuthenticated: true });
  };

  const logout = () => {
    setState({ ...state, user: null, isAuthenticated: false });
  };

  const toggleTheme = () => {
    setState({ ...state, theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}
