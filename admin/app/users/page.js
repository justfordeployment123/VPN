"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Calendar 
} from "lucide-react";
import { format } from "date-fns";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#EAEFEF] min-h-full text-[#25343F]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage user access and account membership status.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center rounded-md border border-[#BFC9D1] bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 rounded-md border border-[#BFC9D1] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#FF9B51] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-lg border border-[#BFC9D1] bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-[#EAEFEF] text-left">
          <thead className="bg-[#EAEFEF]/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#25343F]/60">Email</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#25343F]/60">Membership</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#25343F]/60">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#25343F]/60">Joined</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#25343F]/60">Verification</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#25343F]/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEFEF] bg-white text-sm">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6 border-b border-[#EAEFEF]">
                     <div className="h-4 bg-[#EAEFEF] rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
               <tr>
                 <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                    No active users found.
                 </td>
               </tr>
            ) : filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Shield size={14} className={`mr-2 ${user.tier === 'premium' ? 'text-[#FF9B51]' : 'text-slate-300'}`} />
                    <span className={user.tier === 'premium' ? 'font-bold' : 'capitalize text-slate-500'}>
                      {user.tier}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 capitalize">{user.role}</td>
                <td className="px-6 py-4 text-slate-500">
                   {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest
                    ${user.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {user.isVerified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-300">
                  <button className="hover:text-[#25343F] transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
