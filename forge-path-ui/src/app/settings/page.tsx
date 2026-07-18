"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Building, Users, Key, Shield, Check, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"company" | "users" | "keys" | "logs">("company");
  const [nvidiaKey, setNvidiaKey] = useState("nvapi-••••••••••••••••");

  const saveSettings = () => {
    toast.success("Configuration keys updated successfully.");
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">System Settings</h2>
          <p className="text-xs text-[#9CA3AF] mt-1">Configure company profiles, integration API keys, and access logs.</p>
        </div>

        {/* Setting Tabs */}
        <div className="flex gap-2 border-b border-[#1E253E] pb-px">
          <button onClick={() => setActiveTab("company")} className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "company" ? "border-blue-600 text-blue-400" : "border-transparent text-[#9CA3AF] hover:text-white"
          }`}>Company Profile</button>
          <button onClick={() => setActiveTab("users")} className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "users" ? "border-blue-600 text-blue-400" : "border-transparent text-[#9CA3AF] hover:text-white"
          }`}>User Management</button>
          <button onClick={() => setActiveTab("keys")} className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "keys" ? "border-blue-600 text-blue-400" : "border-transparent text-[#9CA3AF] hover:text-white"
          }`}>API Integrations</button>
        </div>

        {activeTab === "company" && (
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E] max-w-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5"><Building className="w-4 h-4 text-blue-400" /> Organization Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-2">Company Name</label>
                <input type="text" defaultValue="Apex Manufacturing Inc." className="w-full px-3 py-2 bg-[#0d1625] border border-[#1E253E] rounded-lg text-xs text-white" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-2">Industry Verticals</label>
                <input type="text" defaultValue="CNC & Steel Fabrication" className="w-full px-3 py-2 bg-[#0d1625] border border-[#1E253E] rounded-lg text-xs text-white" />
              </div>
            </div>
            <button onClick={saveSettings} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition-all">Save Changes</button>
          </div>
        )}

        {activeTab === "keys" && (
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E] max-w-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5"><Key className="w-4 h-4 text-blue-400" /> Integration API Keys</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-2">NVIDIA NIM API Key</label>
                <div className="relative">
                  <input type="password" value={nvidiaKey} onChange={(e) => setNvidiaKey(e.target.value)} className="w-full pl-3 pr-10 py-2 bg-[#0d1625] border border-[#1E253E] rounded-lg text-xs text-white" />
                  <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-2">Twilio Auth Token</label>
                <input type="password" defaultValue="••••••••••••••••" className="w-full px-3 py-2 bg-[#0d1625] border border-[#1E253E] rounded-lg text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-2">Brevo Delivery API Key</label>
                <input type="password" defaultValue="••••••••••••••••" className="w-full px-3 py-2 bg-[#0d1625] border border-[#1E253E] rounded-lg text-xs text-white" />
              </div>
            </div>
            <button onClick={saveSettings} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition-all">Save Config</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
