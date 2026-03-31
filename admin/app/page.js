"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { 
  Users, 
  Server, 
  Activity, 
  Shield, 
  ChevronRight, 
  Cpu,
  ArrowUpRight
} from "lucide-react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/stats");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { name: "Total Users", value: metrics?.totalUsers || "0", icon: Users, color: "text-blue-600" },
    { name: "Premium Nodes", value: metrics?.activeNodes || "0", icon: Shield, color: "text-[#FF9B51]" },
    { name: "Active Connections", value: "0", icon: Activity, color: "text-emerald-600" },
    { name: "System Load", value: "0%", icon: Cpu, color: "text-slate-600" },
  ];

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">VPN Management Overview</h1>
        <p className="text-slate-500 mt-1">Real-time statistics and server fleet status.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-[#BFC9D1] transition-hover hover:border-[#FF9B51]">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-md bg-[#EAEFEF] ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={14} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.name}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Node Health Section */}
        <section className="bg-white rounded-lg border border-[#BFC9D1] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#EAEFEF] pb-4">
            <h2 className="text-lg font-bold">VPN Servers Status</h2>
            <button className="text-sm font-semibold text-[#FF9B51] hover:text-[#ff8a35]">Refresh</button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-[#EAEFEF] p-4 bg-[#EAEFEF]/10">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded bg-slate-50 border border-[#BFC9D1]">
                    <Server size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{i === 1 ? "US - San Francisco" : "US - New York"}</p>
                    <p className="text-xs font-mono text-slate-400">{i === 1 ? "167.71.199.96" : "157.230.93.112"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-600">{i === 1 ? "14%" : "8%"} Load</p>
                    <div className="h-1 w-16 bg-[#EAEFEF] rounded-full mt-1">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: i === 1 ? '14%' : '8%' }}></div>
                    </div>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System Summary Section */}
        <section className="bg-[#25343F] rounded-lg p-8 shadow-sm text-white flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={120} />
          </div>
          <h2 className="text-xl font-bold mb-2">Network Health</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            All systems are operating normally. WireGuard encryption is applied to all active tunnels. Global network uptime is currently at 99.99%.
          </p>
          <div className="mt-8 flex items-center space-x-6">
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <span className="text-sm font-bold text-[#FF9B51]">Operational</span>
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Uptime</p>
               <span className="text-sm font-bold">14.2 Days</span>
             </div>
          </div>
          <button className="mt-8 self-start flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            View System Logs <ChevronRight size={14} className="ml-1" />
          </button>
        </section>
      </div>
    </div>
  );
}
