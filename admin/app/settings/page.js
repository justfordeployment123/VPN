"use client";

import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Key, 
  Save, 
  Info 
} from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
        <p className="text-slate-500">Global administrative settings for the Sentinel's Veil VPN infrastructure.</p>
      </header>

      <div className="space-y-8">
        {/* Security Section */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center">
            <Shield className="h-5 w-5 text-indigo-600 mr-3" />
            <h2 className="text-lg font-bold text-slate-900">Security & Authentication</h2>
          </div>
          <div className="p-6 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication (Admin)</p>
                  <p className="text-xs text-slate-500">Requirement for all administrative access attempts.</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-slate-200 p-1 flex justify-start cursor-pointer">
                   <div className="h-4 w-4 rounded-full bg-white shadow-sm"></div>
                </div>
             </div>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Session Timeout</p>
                  <p className="text-xs text-slate-500">Automatically logout inactive administrators after 30 minutes.</p>
                </div>
                <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50">
                   <option>30 Minutes</option>
                   <option>1 Hour</option>
                   <option>Always On</option>
                </select>
             </div>
          </div>
        </section>

        {/* Network Infrastructure Section */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center">
            <Database className="h-5 w-5 text-indigo-600 mr-3" />
            <h2 className="text-lg font-bold text-slate-900">Infrastructure Scalability</h2>
          </div>
          <div className="p-6 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Auto-Scaling Trigger</p>
                  <p className="text-xs text-slate-500">Notify admin when global network load exceeds threshold.</p>
                </div>
                <div className="flex items-center text-sm text-slate-900 font-bold">
                   <input type="number" defaultValue={85} className="w-12 text-center border-b border-slate-300 focus:border-indigo-600 outline-none" />
                   <span className="ml-1">%</span>
                </div>
             </div>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Default WireGuard Port</p>
                  <p className="text-xs text-slate-500">Standard port used for new VPN node enrollment.</p>
                </div>
                <p className="text-sm font-mono text-slate-600">51820</p>
             </div>
          </div>
        </section>

        {/* Global Webhooks */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center">
            <Key className="h-5 w-5 text-indigo-600 mr-3" />
            <h2 className="text-lg font-bold text-slate-900">Global Integrations</h2>
          </div>
          <div className="p-6 space-y-4">
             <div>
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">RevenueCat Webhook Secret</label>
               <input type="password" value="••••••••••••••••••••••••••••••" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-mono text-slate-600" />
             </div>
          </div>
        </section>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200">
           <button className="text-sm font-semibold text-slate-500 hover:text-slate-700">Restore Defaults</button>
           <button className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-md">
              <Save className="h-4 w-4 mr-2" />
              Commit Changes
           </button>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg flex items-start">
           <Info className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
           <p className="text-xs text-indigo-700 leading-relaxed font-medium">
             Changes made here affect the entire Sentinel network infrastructure and global client synchronization. Please exercise caution when modifying security and network protocols.
           </p>
        </div>
      </div>
    </div>
  );
}
