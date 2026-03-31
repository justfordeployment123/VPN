"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  User,
  ChevronDown,
  LogOut,
  ChevronRight
} from "lucide-react";
import api from "../lib/api";

export default function TopBar({ pathname }) {
  const [admin, setAdmin] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/admin/me");
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    }
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  const breadcrumbs =
    pathname === "/"
      ? ["Overview"]
      : pathname.split("/").filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#BFC9D1] z-10 shadow-sm shrink-0">
      
      <nav className="flex items-center space-x-1 text-sm">
        <span className="text-slate-400 font-medium">Admin</span>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center space-x-1">
            <ChevronRight size={13} className="text-slate-300" />
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "font-semibold text-[#25343F]"
                  : "text-slate-400"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      
      <div className="flex items-center space-x-3">

        
        <button className="relative p-2 rounded-lg hover:bg-[#EAEFEF] transition-colors text-slate-400 hover:text-[#25343F]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-[#FF9B51] rounded-full" />
        </button>

        
        <div className="h-6 w-px bg-[#BFC9D1]" />

        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-lg hover:bg-[#EAEFEF] transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-linear-to-br from-[#25343F] to-[#3a5068] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {admin?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#25343F] leading-none">
                {admin?.email || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                {admin?.role || "Admin"}
              </p>
            </div>
            <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#BFC9D1] py-1.5 z-50">
              <button
                onClick={() => { setShowDropdown(false); router.push("/profile"); }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#25343F] hover:bg-[#EAEFEF] transition-colors"
              >
                <User size={14} className="text-slate-400" />
                Profile Settings
              </button>
              <div className="h-px bg-[#EAEFEF] my-1" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
