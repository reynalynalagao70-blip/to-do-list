"use client";

import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Simulation ng storage logic (LocalStorage muna gaya ng luma mo)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some(u => u.username === username || u.email === email);
      
      if (userExists) {
        throw new Error("Username or email already exists.");
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

      // Trigger SUCCESS DESIGN
      setRegisterSuccess(true);

      // Redirect pagkatapos ng 2.5 seconds para makita ang animation
      setTimeout(() => {
        navigate("/");
      }, 2500);

    } catch (err) {
      setError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans relative overflow-hidden">
      
      {/* --- MODERN SUCCESS OVERLAY --- */}
      {registerSuccess && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-green-200">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="mt-8 text-3xl font-black text-gray-900">Account Created!</h2>
          <p className="text-gray-500 mt-2">Redirecting you to login page...</p>
          <div className="mt-6 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-progress-load"></div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[450px] bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-400 font-medium">Join us to start organizing tasks</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2 mb-2 block">Username</label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="Your username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2 mb-2 block">Email Address</label>
              <input
                type="email"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-2 mb-2 block">Password</label>
                <input
                  type="password"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-2 mb-2 block">Confirm</label>
                <input
                  type="password"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-gray-200 disabled:opacity-50 mt-4"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-medium">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="text-green-600 font-bold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;