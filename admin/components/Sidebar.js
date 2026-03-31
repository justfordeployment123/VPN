"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  Users,
  Server,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Overview", href: "/", icon: BarChart2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Servers", href: "/nodes", icon: Server },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#1a2730] text-white transition-all duration-300 ease-in-out relative z-20",
        isCollapsed ? "w-18" : "w-60"
      )}
    >
      
      <div className={cn(
        "flex h-16 items-center border-b border-white/10 shrink-0 overflow-hidden",
        isCollapsed ? "justify-center px-0" : "px-5"
      )}>
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#FF9B51] shadow-lg shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold tracking-tight whitespace-nowrap leading-none">VPN Admin</p>
            <p className="text-[10px] text-white/40 mt-0.5 whitespace-nowrap">Management Console</p>
          </div>
        )}
      </div>

      
      {!isCollapsed && (
        <p className="px-5 pt-6 pb-2 text-[10px] font-bold tracking-widest text-white/30 uppercase">
          Navigation
        </p>
      )}

      
      <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium transition-all duration-150",
                isActive
                  ? "bg-[#FF9B51]/15 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              {isActive && (
                <span className="absolute left-0 w-0.5 h-7 bg-[#FF9B51] rounded-r-full" />
              )}
              <item.icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-[#FF9B51]" : "text-white/40 group-hover:text-white/60",
                  !isCollapsed && "mr-3"
                )}
              />
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      
      <div className="px-3 py-2">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : ""}
          className={cn(
            "group flex w-full items-center rounded-lg px-3 py-2.5 text-[15px] font-medium text-white/50 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-150",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut size={18} className={cn("shrink-0 transition-colors", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      
      <div className={cn(
        "p-3 border-t border-white/10",
        isCollapsed ? "flex justify-center" : "flex justify-end"
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#FF9B51]/20 hover:text-[#FF9B51] text-white/40 transition-all"
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </div>
  );
}
