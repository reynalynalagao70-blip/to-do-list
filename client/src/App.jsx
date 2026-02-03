// app.jsx
"use client";

import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Auto-fill last registered user
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
      console.log("Login attempt for:", username);
      
      // Method 1: Check localStorage first (GUARANTEED)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("Users in localStorage:", users);
      
      const user = users.find(
        (u) => 
          (u.username === username || u.email === username) && 
          u.password === password
      );
      
      if (user) {
        // ✅ SUCCESS - Local storage login
        console.log("✅ Login successful via localStorage");
        setLoginSuccess(true);
        
        // Save login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Show success message
        setTimeout(() => {
          alert("🎉 Login Successful! Redirecting to List Items...");
          
          // ✅ REDIRECT TO LISTITEM.JSX
          window.location.href = "/listitem";
        }, 1000);
        
        setLoading(false);
        return;
      }
      
      // Method 2: Try backend login (optional)
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Backend login successful:", data);
          setLoginSuccess(true);
          
          // Save user data
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("currentUser", JSON.stringify(data.user || { username }));
          
          setTimeout(() => {
            alert("Login Successful! Redirecting to List Items...");
            
            // ✅ REDIRECT TO LISTITEM.JSX
            window.location.href = "/listitem";
          }, 1000);
          
          setLoading(false);
          return;
        }
      } catch (backendError) {
        console.log("Backend login failed, trying next method");
      }
      
      // If we reach here, login failed
      setError("❌ Invalid username or password");
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to add test user (for debugging)
  const addTestUser = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const testUser = {
      id: 1,
      username: "testuser",
      email: "test@test.com",
      password: "password123",
      createdAt: new Date().toISOString()
    };
    
    // Check if test user already exists
    const exists = users.some(u => u.username === "testuser");
    if (!exists) {
      users.push(testUser);
      localStorage.setItem("users", JSON.stringify(users));
      setUsername("testuser");
      setPassword("password123");
      alert("✅ Test user added! Username: testuser, Password: password123");
    } else {
      setUsername("testuser");
      setPassword("password123");
      alert("Test user already exists. Form filled.");
    }
  };

  // Quick register then login (for testing)
  const quickTest = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      id: Date.now(),
      username: "demo",
      email: "demo@test.com",
      password: "demo123",
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    setUsername("demo");
    setPassword("demo123");
    
    alert("✅ Demo user created!\nUsername: demo\nPassword: demo123\n\nClick 'Sign In' to login and go to List Items page.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your account
        </p>

        {/* Success Message */}
        {loginSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg animate-pulse">
            <p className="text-green-700 font-bold">✅ Login Successful! Redirecting to List Items...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter username or email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => window.location.href = "/register"}
              className="text-green-600 font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
      
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">✅ LOGIN SUCCESS = GO TO LIST ITEMS</h3>
          <p className="text-green-700 text-sm">
            1. Register first or use test user<br/>
            2. Login with credentials<br/>
            3. Automatic redirect to <strong>/listitem</strong><br/>
            4. You'll see the ListItem.jsx page
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

