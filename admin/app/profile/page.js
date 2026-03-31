"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Edit3, 
  CheckCircle,
  Key,
  Database
} from "lucide-react";
import api from "../../lib/api";
import { format } from "date-fns";

export default function ProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/admin/me");
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">Administrative Profile</h1>
        <p className="text-slate-500 mt-1">Manage your administrator credentials and system access permissions.</p>
      </header>

      {loading ? (
         <div className="max-w-4xl bg-white rounded-xl border border-[#BFC9D1] h-64 animate-pulse"></div>
      ) : (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <section className="bg-white rounded-xl border border-[#BFC9D1] shadow-sm overflow-hidden">
            <div className="px-8 py-10 flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-10">
               <div className="h-24 w-24 rounded-full bg-[#25343F] flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-[#EAEFEF]">
                  {admin?.email?.charAt(0).toUpperCase()}
               </div>
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{admin?.email}</h2>
                  <div className="flex items-center space-x-4">
                     <span className="flex items-center text-xs font-bold text-[#FF9B51] uppercase tracking-widest">
                        <Shield size={14} className="mr-2" />
                        {admin?.role} Access
                     </span>
                     <span className="flex items-center text-xs font-bold text-emerald-600 uppercase tracking-widest">
                        <CheckCircle size={14} className="mr-2" />
                        Verified Account
                     </span>
                  </div>
               </div>
               <div className="md:ml-auto">
                  <button className="flex items-center px-4 py-2 border border-[#BFC9D1] rounded-md text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest">
                     <Edit3 size={14} className="mr-2" /> Edit Profile
                  </button>
               </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section className="bg-white rounded-xl border border-[#BFC9D1] shadow-sm p-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-[#EAEFEF]">Account Information</h3>
                <div className="space-y-6">
                   <div className="flex items-start">
                      <Mail size={18} className="mr-4 text-slate-300 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Primary Email</p>
                         <p className="text-sm font-medium">{admin?.email}</p>
                      </div>
                   </div>
                   <div className="flex items-start">
                      <Calendar size={18} className="mr-4 text-slate-300 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Account Created</p>
                         <p className="text-sm font-medium">{format(new Date(admin?.createdAt), 'MMMM dd, yyyy')}</p>
                      </div>
                   </div>
                   <div className="flex items-start">
                      <Database size={18} className="mr-4 text-slate-300 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Database Reference</p>
                         <p className="text-[10px] font-mono text-slate-400">{admin?._id}</p>
                      </div>
                   </div>
                </div>
             </section>

             <section className="bg-white rounded-xl border border-[#BFC9D1] shadow-sm p-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-[#EAEFEF]">Security Credentials</h3>
                <div className="space-y-6">
                   <div className="flex items-start">
                      <Key size={18} className="mr-4 text-[#FF9B51] shrink-0 mt-0.5" />
                      <div className="flex-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System Password</p>
                         <p className="text-sm font-medium">••••••••••••</p>
                         <button className="mt-4 text-[10px] font-bold text-[#FF9B51] hover:text-[#ff8a35] uppercase tracking-widest">
                            Update Administrator Password
                         </button>
                      </div>
                   </div>
                </div>
             </section>
          </div>
        </div>
      )}
    </div>
  );
}
