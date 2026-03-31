"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";
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
      
      // Check for MFA requirement
      if (res.data.mfaRequired) {
        localStorage.setItem("pendingMfaUserId", res.data.userId);
        router.push("/login/verify-mfa");
        return;
      }

      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/");
      } else {
        setError("Secure access denied. Verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Authentication profile match not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EAEFEF] text-[#25343F]">
      {/* Left Pane — Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-white flex-col items-center justify-center p-12 border-r border-[#BFC9D1]">
         <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#25343F] shadow-xl mb-4">
               <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#25343F]">Administrative Access</h2>
            <p className="text-slate-500 leading-relaxed">
              Verify your credentials to manage the secure global VPN infrastructure and oversee network telemetry.
            </p>
            <div className="relative h-72 w-full mt-10">
               <Image 
                 src="/AUTH_SVGS/Login-pana.svg" 
                 alt="Login Protocol" 
                 fill
                 className="object-contain"
               />
            </div>
         </div>
      </div>

      {/* Right Pane — Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-[#EAEFEF]">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-4">
          <div className="lg:hidden text-center mb-8">
             <div className="inline-flex p-2 rounded-xl bg-[#25343F] mb-4">
                <Shield className="h-6 w-6 text-white" />
             </div>
             <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
            <p className="text-sm text-slate-500">Please enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profile Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@sentinel.net"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#BFC9D1] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51] transition-all shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Key</label>
                  <button 
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-[10px] font-bold text-[#FF9B51] hover:underline"
                  >
                    Forgot Key?
                  </button>
               </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="Profile Password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#BFC9D1] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51] transition-all shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 text-xs font-medium p-3.5 rounded-xl border border-rose-100 animate-in shake duration-300">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#25343F] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                   <span>Authenticate Access</span>
                   <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <footer className="pt-8 text-center border-t border-[#BFC9D1]">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
               Sentinel Security Framework<br/>
               <span className="text-[9px] opacity-70 italic shadow-sm bg-white px-2 py-0.5 rounded leading-none">v{process.env.NEXT_PUBLIC_APP_VERSION || '1.2.4'} Stable Deployment</span>
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
