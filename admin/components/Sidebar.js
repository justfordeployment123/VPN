"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart2, 
  Users, 
  Server, 
  Settings, 
  LogOut, 
  Shield 
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-[#BFC9D1] bg-white text-[#25343F]">
      <div className="flex h-16 items-center px-6 border-b border-[#BFC9D1]">
        <div className="bg-[#25343F] p-1.5 rounded-md">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <span className="ml-3 text-lg font-bold tracking-tight">
          VPN Management
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#EAEFEF] text-[#25343F]"
                  : "text-slate-600 hover:bg-[#EAEFEF]/50 hover:text-[#25343F]"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-[#FF9B51]" : "text-slate-400 group-hover:text-slate-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#BFC9D1] bg-[#EAEFEF]/30">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
