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
  ArrowUpRight,
  Wifi,
  Clock
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
    {
      name: "Total Users",
      value: metrics?.totalUsers ?? "0",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      name: "Premium Nodes",
      value: metrics?.activeNodes ?? "0",
      icon: Shield,
      iconBg: "bg-orange-50",
      iconColor: "text-[#FF9B51]",
      trend: "+3%",
      trendUp: true,
    },
    {
      name: "Active Connections",
      value: "0",
      icon: Wifi,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: "Live",
      trendUp: null,
    },
    {
      name: "System Load",
      value: "0%",
      icon: Cpu,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      trend: "Normal",
      trendUp: null,
    },
  ];

  const servers = [
    { name: "US — San Francisco", ip: "167.71.199.96", load: 14, latency: "12ms" },
    { name: "US — New York", ip: "157.230.93.112", load: 8, latency: "8ms" },
  ];

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">

      
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Real-time statistics and server fleet status
        </p>
      </div>

      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-5 border border-[#BFC9D1] hover:border-[#FF9B51] hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
              {stat.trendUp !== null ? (
                <span className={`flex items-center text-[11px] font-semibold gap-0.5 ${stat.trendUp ? "text-emerald-600" : "text-rose-500"}`}>
                  <ArrowUpRight size={12} />
                  {stat.trend}
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400">{stat.trend}</span>
              )}
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">
              {loading ? (
                <span className="inline-block w-10 h-7 bg-[#EAEFEF] rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </p>
            <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
              {stat.name}
            </p>
          </div>
        ))}
      </div>

      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        
        <section className="bg-white rounded-xl border border-[#BFC9D1] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEFEF]">
            <div>
              <h2 className="text-sm font-bold text-[#25343F]">VPN Servers</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{servers.length} nodes active</p>
            </div>
            <button className="text-xs font-semibold text-[#FF9B51] hover:text-[#e8893f] transition-colors">
              Refresh
            </button>
          </div>
          <div className="divide-y divide-[#EAEFEF]">
            {servers.map((server) => (
              <div key={server.ip} className="flex items-center justify-between px-6 py-4 hover:bg-[#EAEFEF]/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#EAEFEF]">
                    <Server size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{server.name}</p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{server.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-600">{server.load}% load</p>
                    <div className="h-1 w-20 bg-[#EAEFEF] rounded-full mt-1.5">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${server.load}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock size={11} />
                    {server.latency}
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </section>

        
        <section className="bg-[#1a2730] rounded-xl p-6 shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute -right-6 -bottom-6 opacity-5">
            <Activity size={160} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">Live</span>
            </div>
            <h2 className="text-lg font-bold mt-1">Network Health</h2>
            <p className="text-sm text-white/40 mt-2 leading-relaxed max-w-xs">
              All systems operating normally. WireGuard encryption active on all tunnels. Uptime at 99.99%.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: "Status", value: "Operational", highlight: true },
              { label: "Uptime", value: "14.2 Days" },
              { label: "Tunnels", value: "Active" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-lg p-3">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.highlight ? "text-[#FF9B51]" : "text-white"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-5 self-start flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-white transition-colors">
            View System Logs <ChevronRight size={13} />
          </button>
        </section>

      </div>
    </div>
  );
}
