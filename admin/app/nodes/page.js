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
  Trash2, 
  Power,
  X 
} from "lucide-react";

export default function NodeManagement() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newNode, setNewNode] = useState({ name: "", countryCode: "US", city: "", ipAddress: "", publicKey: "placeholder" });

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/nodes");
      setNodes(res.data);
    } catch (err) {
      console.error("Failed to fetch nodes", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = async (id, currentStatus) => {
    try {
      await api.put(`/admin/nodes/${id}`, { isActive: !currentStatus });
      fetchNodes();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/nodes", newNode);
      setShowModal(false);
      fetchNodes();
    } catch (err) {
      alert("Failed to enroll node. Check IP and Name uniqueness.");
    }
  };

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">VPN Server Management</h1>
          <p className="text-slate-500 mt-1">Manage global server fleet and real-time connectivity status.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchNodes}
            className="flex items-center rounded-md border border-[#BFC9D1] bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCcw size={16} className="mr-2 text-slate-400" />
            Refresh
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center rounded-md bg-[#FF9B51] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff8a35] transition-all shadow-sm"
          >
            <Plus size={16} className="mr-2" />
            Add Server
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-xs">Capacity</p>
                    <span className="text-xs font-bold text-slate-700">{node.load}% Load</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#EAEFEF]/30 px-6 py-3 flex justify-between items-center border-t border-[#EAEFEF]">
                <button 
                   onClick={() => toggleNode(node._id, node.isActive)}
                   className={`flex items-center text-[10px] font-bold uppercase tracking-widest transition-colors ${node.isActive ? 'text-rose-600 hover:text-rose-800' : 'text-emerald-600 hover:text-emerald-800'}`}
                >
                  <Power size={12} className="mr-2" />
                  {node.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <div className="flex items-center space-x-4">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-[#25343F] uppercase tracking-widest">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#25343F]/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-[#BFC9D1]">
             <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEFEF]">
                <h3 className="text-lg font-bold">Enroll New Server</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-[#25343F] transition-colors">
                   <X size={20} />
                </button>
             </div>
             <form onSubmit={handleEnroll} className="p-6 space-y-4">
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Server Name</label>
                   <input 
                      type="text" 
                      required
                      placeholder="e.g. US-NY-01"
                      className="w-full px-4 py-2 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51]"
                      value={newNode.name}
                      onChange={(e) => setNewNode({...newNode, name: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Country Code</label>
                      <input 
                         type="text" 
                         required
                         placeholder="e.g. US"
                         className="w-full px-4 py-2 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51]"
                         value={newNode.countryCode}
                         onChange={(e) => setNewNode({...newNode, countryCode: e.target.value.toUpperCase()})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">City</label>
                      <input 
                         type="text" 
                         required
                         placeholder="e.g. New York"
                         className="w-full px-4 py-2 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51]"
                         value={newNode.city}
                         onChange={(e) => setNewNode({...newNode, city: e.target.value})}
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">IP Address</label>
                   <input 
                      type="text" 
                      required
                      placeholder="e.g. 192.168.1.1"
                      className="w-full px-4 py-2 bg-[#EAEFEF]/30 border border-[#BFC9D1] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51]"
                      value={newNode.ipAddress}
                      onChange={(e) => setNewNode({...newNode, ipAddress: e.target.value})}
                   />
                </div>
                <button type="submit" className="w-full bg-[#FF9B51] text-white py-2.5 rounded-md font-bold text-sm hover:bg-[#ff8a35] transition-all shadow-sm mt-4">
                   Commit Enrollment
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
