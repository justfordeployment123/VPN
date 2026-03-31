"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Save, 
  Lock,
  Key,
  CheckCircle,
  QrCode,
  Loader2,
  AlertCircle
} from "lucide-react";
import api from "../../lib/api";
import Image from "next/image";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2FA Setup states
  const [mfaStep, setMfaStep] = useState("initial"); // initial, setup, verify, active
  const [qrCode, setQrCode] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/admin/me");
      setAdmin(res.data);
      if (res.data.twoFactorEnabled) {
         setMfaStep("active");
      }
    } catch (err) {
      console.error("Failed to fetch settings profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMfaSetup = async () => {
    setMfaLoading(true);
    setMfaError("");
    try {
      const res = await api.post("/auth/2fa/setup");
      setQrCode(res.data.qrCodeUrl);
      setMfaStep("setup");
    } catch (err) {
      setMfaError("Failed to initialize security protocol.");
    } finally {
      setMfaLoading(false);
    }
  };

  const handleVerifyAndEnableMfa = async () => {
    if (mfaCode.length !== 6) return setMfaError("Code must be 6 digits.");
    setMfaLoading(true);
    setMfaError("");
    try {
      await api.post("/auth/2fa/verify", { code: mfaCode });
      setMfaStep("active");
      fetchProfile();
    } catch (err) {
      setMfaError("Verification failed. Please check the code and try again.");
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1">Configure global network parameters and administrative access.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  activeSection === section.id
                    ? "bg-[#25343F] text-white shadow-md"
                    : "text-slate-500 hover:bg-white hover:text-[#25343F]"
                }`}
              >
                <section.icon size={18} className="mr-3 shrink-0" />
                {section.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl">
          <div className="bg-white rounded-2xl border border-[#BFC9D1] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex-1">
               {activeSection === "general" && (
                 <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
                   <div>
                     <h3 className="text-lg font-bold mb-4">Core Fleet Parameters</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Environment</label>
                          <select className="w-full px-4 py-3 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#FF9B51]">
                             <option>Production (Stable)</option>
                             <option>Staging</option>
                             <option>Development</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Default Node Protocol</label>
                          <select className="w-full px-4 py-3 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#FF9B51]">
                             <option>WireGuard (Recommended)</option>
                             <option>OpenVPN</option>
                             <option>IKEv2</option>
                          </select>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {activeSection === "security" && (
                 <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold mb-2">Administrative Authentication</h3>
                    <p className="text-xs text-slate-500 mb-6 italic leading-relaxed">
                       Manage account access layers and security requirements for the administrative portal.
                    </p>
                    
                    <div className="space-y-6">
                       <div className="group space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity MFA Layer</label>
                          <div className="bg-[#EAEFEF]/20 border border-[#BFC9D1] rounded-2xl p-8">
                             {mfaStep === "active" ? (
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                     <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mr-4 border border-emerald-100">
                                        <Shield size={24} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-[#25343F]">Two-Factor Authentication Active</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Your identity is protected with encrypted TOTP layers.</p>
                                     </div>
                                  </div>
                                  <button className="text-[10px] font-bold text-slate-400 hover:text-rose-600 uppercase tracking-widest transition-colors">
                                     Deactivate MFA
                                  </button>
                               </div>
                             ) : mfaStep === "setup" ? (
                               <div className="space-y-8 animate-in zoom-in-95 duration-200">
                                  <div className="flex flex-col md:flex-row gap-8 items-center">
                                     <div className="bg-white p-4 rounded-2xl border-2 border-[#EAEFEF] shadow-inner shrink-0">
                                        {qrCode && <Image src={qrCode} alt="Security Setup QR" width={180} height={180} />}
                                     </div>
                                     <div className="space-y-4">
                                        <h4 className="font-bold text-[#25343F]">Establish Security Link</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                           1. Scan this identifier with Google Authenticator or Authy.<br/>
                                           2. Provision the new administrative account profile.<br/>
                                           3. Provide the generated 6-digit verification key below.
                                        </p>
                                        <div className="space-y-3 pt-2">
                                           <div className="relative max-w-[200px]">
                                              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                              <input 
                                                type="text" 
                                                maxLength={6}
                                                placeholder="Code"
                                                className="w-full pl-10 pr-4 py-2 border border-[#BFC9D1] rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF9B51]"
                                                value={mfaCode}
                                                onChange={(e) => setMfaCode(e.target.value)}
                                              />
                                           </div>
                                           {mfaError && <p className="text-[10px] font-bold text-rose-500">{mfaError}</p>}
                                           <div className="flex space-x-3">
                                              <button 
                                                onClick={handleVerifyAndEnableMfa}
                                                disabled={mfaLoading || mfaCode.length !== 6}
                                                className="px-4 py-2 bg-[#25343F] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                              >
                                                {mfaLoading ? <Loader2 size={14} className="animate-spin" /> : "Verify & Enable"}
                                              </button>
                                              <button onClick={() => setMfaStep("initial")} className="px-4 py-2 text-slate-400 hover:text-[#25343F] text-xs font-bold transition-all">
                                                Cancel
                                              </button>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                             ) : (
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="flex items-center">
                                     <div className="p-3 bg-slate-100 rounded-xl text-slate-400 mr-4">
                                        <Lock size={24} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-[#25343F]">Standard Access Only</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Elevate security by requiring a secondary verification key.</p>
                                     </div>
                                  </div>
                                  <button 
                                    onClick={handleStartMfaSetup}
                                    disabled={mfaLoading}
                                    className="flex items-center px-5 py-2.5 bg-[#FF9B51] text-white rounded-xl text-xs font-bold hover:bg-[#ff8a35] transition-all shadow-md shadow-orange-500/10"
                                  >
                                    {mfaLoading ? <Loader2 size={14} className="animate-spin mr-2" /> : <Key size={14} className="mr-2" />}
                                    Activate Multi-Factor (MFA)
                                  </button>
                               </div>
                             )}
                          </div>
                       </div>

                       <div className="pt-6 border-t border-[#EAEFEF]">
                          <h4 className="text-sm font-bold mb-4 opacity-50 uppercase tracking-widest">Global Policies</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="p-4 border border-[#BFC9D1] rounded-2xl flex items-center justify-between">
                                <div className="flex items-center">
                                   <AlertCircle size={16} className="text-amber-500 mr-3" />
                                   <span className="text-xs font-bold">Enforce Admin MFA</span>
                                </div>
                                <div className="h-5 w-9 bg-[#25343F] rounded-full relative p-1 cursor-pointer">
                                   <div className="h-3 w-3 bg-white rounded-full translate-x-4"></div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Global Actions Footer */}
            <div className="bg-[#EAEFEF]/30 px-8 py-4 border-t border-[#BFC9D1] flex justify-end items-center">
               <button className="flex items-center px-8 py-3 bg-[#25343F] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/10">
                  <Save size={14} className="mr-2" />
                  Save Changes
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const sections = [
  { id: "general", name: "System Configuration", icon: Settings },
  { id: "notifications", name: "Alert Management", icon: Bell },
  { id: "security", name: "Access & Security", icon: Shield },
  { id: "api", name: "API & Data", icon: Database },
];
