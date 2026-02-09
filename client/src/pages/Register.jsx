// register.jsx (keep the same but update the success message)
"use client";

import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();''
  const API = 'https://to-do-list-p4te.onrender.com';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Simple validation
    if (!username || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending registration data:", { username, email, password });
      
      // Use local storage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user exists
      const userExists = users.some(
        (user) => user.username === username || user.email === email
      );
      
      if (userExists) {
        setError("Username or email already exists");
        setLoading(false);
        return;
      }
      
      // Add new user to local storage
      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      console.log("Saved to localStorage:", newUser);
      
      // Show success message
      setSuccess("🎉 Registration Successful! You can now login.");
      
      // Store username for auto-fill in login
      localStorage.setItem("lastRegisteredUser", username);
      
      // Optional: Auto-login after registration
      const autoLogin = window.confirm("Registration successful! Do you want to login automatically?");
      
      if (autoLogin) {
        // Auto login
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        
        setTimeout(() => {
          alert("Auto-login successful! Going to List Items page...");
          window.location.href = "/listitem"; // Go directly to ListItem
        }, 1000);
      } else {
        // Just redirect to login page
        setTimeout(() => {
          window.location.href = "/"; // Go to login page
        }, 2000);
      }
      
    } catch (err) {
      console.error("Error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          Create Account
        </h2>
        
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-700 font-medium">✅ {success}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              {success.includes("auto-login") 
                ? "Redirecting to List Items page..." 
                : "Redirecting to login page..."}
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <span className="text-red-700 font-medium">⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="john_doe"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="min. 6 characters"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="repeat password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => window.location.href = "/"}
              className="text-green-600 font-bold hover:underline"
            >
              Login Here
            </button>
          </p>
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 rounded text-xs">
          <p className="font-bold text-blue-800">✅ AFTER REGISTRATION:</p>
          <p className="text-blue-700">
            • You can choose to auto-login<br/>
            • Or go to login page first<br/>
            • After login → List Items page
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;