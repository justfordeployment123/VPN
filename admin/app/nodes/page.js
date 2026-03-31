"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { 
  Server, 
  MapPin, 
  Plus, 
  RefreshCcw, 
  Activity, 
  Globe, 
  MoreVertical 
} from "lucide-react";

export default function NodeManagement() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await api.get("/nodes");
        setNodes(res.data);
      } catch (err) {
        console.error("Failed to fetch nodes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNodes();
  }, []);

  const getLoadColor = (load) => {
    if (load < 40) return "bg-emerald-500";
    if (load < 75) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">VPN Server Management</h1>
          <p className="text-slate-500 mt-1">Manage global server fleet and real-time connectivity status.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center rounded-md border border-[#BFC9D1] bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <RefreshCcw size={16} className="mr-2 text-slate-400" />
            Refresh
          </button>
          <button className="flex items-center rounded-md bg-[#FF9B51] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff8a35] transition-all shadow-sm">
            <Plus size={16} className="mr-2" />
            Add Server
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-lg bg-white border border-[#BFC9D1] animate-pulse"></div>
          ))}
        </div>
      ) : nodes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-[#BFC9D1] p-20 text-center bg-white/50">
            <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No Servers Connected</h3>
            <p className="text-slate-500 mt-2">Enroll your first VPN server to begin scaling the network.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node) => (
            <div key={node._id} className="group overflow-hidden rounded-lg border border-[#BFC9D1] bg-white shadow-sm transition-all hover:border-[#FF9B51]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="rounded-md bg-[#EAEFEF] p-2 text-[#25343F] shadow-sm">
                    <Server size={20} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${node.isActive ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-slate-300'}`}></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{node.isActive ? 'ONLINE' : 'OFFLINE'}</span>
                    <button className="text-slate-300 hover:text-[#25343F] ml-2">
                       <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold leading-tight">{node.name}</h3>
                <div className="mt-1 flex items-center text-xs text-slate-500 uppercase tracking-widest font-medium">
                  <MapPin size={12} className="mr-1.5" />
                  {node.city}, {node.countryCode}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#EAEFEF] pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Server IP</p>
                    <p className="text-xs font-mono font-medium text-slate-700">{node.ipAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Load State</p>
                    <div className="flex items-center space-x-2">
                       <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#EAEFEF]">
                          <div className={`h-full ${getLoadColor(node.load)}`} style={{ width: `${node.load}%` }}></div>
                       </div>
                       <span className="text-xs font-bold text-slate-700">{node.load}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#EAEFEF]/30 px-6 py-3 flex justify-between items-center border-t border-[#EAEFEF]">
                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Activity size={12} className="mr-2" />
                  WireGuard Active
                </div>
                <button className="text-[10px] font-bold text-[#FF9B51] hover:text-[#ff8a35] uppercase tracking-widest">
                  View Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
