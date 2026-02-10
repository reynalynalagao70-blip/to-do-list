import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login'; 
import ListItem from './pages/ListItem';
import ListItemsDetail from './pages/ListItemsDetail';

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // function para i-check kung valid ang session sa server
  const checkAuth = async () => {
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
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Loading screen habang nag-ve-verify para hindi mag-flicker ang UI
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN: Kapag auth na, bawal na bumalik sa login, itatapon sa dashboard */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/listitem" />} 
        />

        {/* DASHBOARD: Kapag HINDI auth, itatapon sa login */}
        <Route 
          path="/listitem" 
          element={isAuthenticated ? <ListItem /> : <Navigate to="/login" />} 
        />

        {/* DETAILS: Kapag HINDI auth, itatapon sa login */}
        <Route 
          path="/list/:id" 
          element={isAuthenticated ? <ListItemsDetail /> : <Navigate to="/login" />} 
        />

        {/* DEFAULT: Kahit anong maling URL, itapon sa tamang page base sa auth status */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/listitem" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;