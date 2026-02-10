"use client";

import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Custom Modal State
  const [showModal, setShowModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  const navigate = useNavigate();
  const API = 'https://to-do-list-p4te.onrender.com';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user) => user.username === username || user.email === email);
      
      if (userExists) {
        setError("Username or email already exists");
        setLoading(false);
        return;
      }
      
      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("lastRegisteredUser", username);
      
      // Imbes na alert/confirm, i-set ang state para lumabas ang design modal
      setTempUser(newUser);
      setSuccess("🎉 Registration Successful!");
      setShowModal(true); 

    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function para sa Auto-Login Choice
  const handleChoice = (autoLogin) => {
    setShowModal(false);
    if (autoLogin) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(tempUser));
      navigate("/listitem");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      
      {/* --- CUSTOM DESIGN ALERT/MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Success!</h3>
            <p className="text-gray-600 mb-8">Hi <span className="font-bold text-green-600">{username}</span>, your account is ready. Do you want to login automatically?</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleChoice(true)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Yes, Auto-Login
              </button>
              <button 
                onClick={() => handleChoice(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                No, Go to Login Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ORIGINAL FORM DESIGN --- */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          Create Account
        </h2>
        
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
              onClick={() => navigate("/")}
              className="text-green-600 font-bold hover:underline"
            >
              Login Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;