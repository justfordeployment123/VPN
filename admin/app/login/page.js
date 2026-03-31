"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Shield } from "lucide-react";
import api from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/");
      } else {
        setError("Login failed. Access denied.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EAEFEF] p-4 text-[#25343F]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-[#BFC9D1] overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-[#25343F] p-3 rounded-md mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-2">Management Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 text-xs font-medium p-3 rounded-md border border-rose-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FF9B51] text-white py-3 rounded-md font-bold text-sm hover:bg-[#ff8a35] transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Login</span>}
            </button>
          </form>
        </div>
        <div className="bg-[#EAEFEF]/30 px-8 py-4 border-t border-[#BFC9D1] text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">VPN MANAGEMENT SYSTEM</span>
        </div>
      </div>
    </div>
  );
}
