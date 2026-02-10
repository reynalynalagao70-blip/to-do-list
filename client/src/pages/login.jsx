import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

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
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginSuccess(true);
        localStorage.setItem("isLoggedIn", "true");
        // MAHALAGA: window.location.href para mag-reload ang App.jsx at ma-update ang isAuthenticated state
        setTimeout(() => {
          window.location.href = "/listitem"; 
        }, 2000);
      } else {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
      }
    } catch (err) {
      setError("Server connection failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 p-4 relative overflow-hidden">
      {/* SUCCESS OVERLAY */}
      {loginSuccess && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Login Successful!</h2>
          <p className="text-gray-500">Welcome back, {username}. Redirecting...</p>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {loading && !loginSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
          <div className="bg-white p-5 rounded-xl shadow-2xl flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium text-gray-700">Verifying...</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-green-50 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Manage your tasks with ease</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 outline-none"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
           <button onClick={() => navigate("/register")} className="text-green-600 font-bold hover:underline">
             Create New Account
           </button>
        </div>
      </div>
    </div>
  );
}

export default Login;