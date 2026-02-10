import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// I-import ang existing pages mo (Siguraduhin ang tamang folder path)
import Login from './pages/Login'; 
import Register from './pages/Register';
import Home from './pages/Home';
import ListItem from './pages/ListItem';
import ListItemsDetail from './pages/ListItemsDetail';

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/get-session`);
      if (res.data.session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-green-600 font-bold">
        Checking security...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public - Pwedeng makita kahit sino */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        
        {/* Login - Kung logged in na, bawal na mag-login ulit */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/listitem" replace />} 
        />

        {/* PROTECTED - Ito ang hinahanap mong security. */}
        <Route 
          path="/listitem" 
          element={isAuthenticated ? <ListItem /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/list/:id" 
          element={isAuthenticated ? <ListItemsDetail /> : <Navigate to="/login" replace />} 
        />

        {/* Ibalik sa Login kung mali ang URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;