"use client";

import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // SIGURADUHIN na consistent ang pangalan ng variable
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'https://to-do-list-p4te.onrender.com';

  const navigate = useNavigate();

  useEffect(() => {
    const lastUser = localStorage.getItem("lastRegisteredUser");
    if (lastUser) {
      setUsername(lastUser);
      localStorage.removeItem("lastRegisteredUser");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(false);

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      console.log("Connecting to:", `${API_URL}/login`);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Dito madalas nagkaka-error na 'Unexpected token <'
      // I-check muna kung JSON ang sagot bago i-parse
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Possible 404 or 500 error.");
      }

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Login successful:", data);
        executeLoginSuccess(data.user || { username });
      } else {
        checkLocalFallback();
      }
    } catch (backendError) {
      console.error("Login error:", backendError);
      checkLocalFallback();
    } finally {
      setLoading(false);
    }
  };

  const checkLocalFallback = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
      console.log("✅ Login successful via localStorage");
      executeLoginSuccess(user);
    } else {
      setError("❌ Invalid credentials. Backend offline and no local record found.");
    }
  };

  const executeLoginSuccess = (userData) => {
    setLoginSuccess(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));

    setTimeout(() => {
      // Mas safe gamitin ang navigate() kung React Router ang gamit mo
      navigate("/listitem"); 
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Connect to Render & Neon</p>

        {loginSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg animate-pulse">
            <p className="text-green-700 font-bold">✅ Success! Redirecting...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Neon DB Username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Connecting to Database..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
           <button onClick={() => navigate("/register")} className="text-green-600 font-bold hover:underline">
             Create Account
           </button>
        </div>
      </div>
    </div>
  );
}

export default App;