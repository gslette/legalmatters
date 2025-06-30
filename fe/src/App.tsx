import './App.css'
import { useState } from 'react';
import { apiService } from './services/ApiService';
import { Login } from './pages/Login';
import { Home } from './pages/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  return isAuthenticated ? 
    <Home onLogout={handleLogout} /> : 
    <Login onAuthSuccess={handleAuthSuccess} />;
}

export default App
