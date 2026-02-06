"use client";

import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Kunin ang API URL mula sa Environment Variables (Vercel Settings)
  // Siguraduhing may "https://" ang URL sa Vercel settings mo
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

      // 1. TAWAG SA RENDER (BACKEND + NEON DB)
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ SUCCESS MULA SA DATABASE
        console.log("✅ Login successful via Neon DB:", data);
        executeLoginSuccess(data.user || { username });
      } else {
        // ❌ ERROR MULA SA SERVER (e.g. Wrong Password)
        // Check muna sa localStorage bago sumuko (fallback)
        checkLocalFallback();
      }
    } catch (backendError) {
      console.log("Backend offline, checking localStorage...");
      checkLocalFallback();
    } finally {
      setLoading(false);
    }
  };

  // Function para sa Local Storage Fallback (para hindi ma-stuck kung offline ang Render)
  const checkLocalFallback = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
      console.log("✅ Login successful via localStorage");
      executeLoginSuccess(user);
    } else {
      setError("❌ Invalid credentials. Check your Database or Local Storage.");
    }
  };

  // Function para sa actual redirect
  const executeLoginSuccess = (userData) => {
    setLoginSuccess(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));

    setTimeout(() => {
      // Mas mainam gamitin ang window.location.href para siguradong refresh ang state
      window.location.href = "/listitem";
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
           <button onClick={() => window.location.href = "/register"} className="text-green-600 font-bold hover:underline">
             Create Account
           </button>
        </div>
      </div>
    </div>
  );
}

export default App;