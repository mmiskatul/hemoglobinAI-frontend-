"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sectionApi } from "@/lib/backend-api";
import {
  Menu,
  X,
  Globe,
  Settings,
  LogOut,
  Bell,
  Smartphone,
  Truck,
  Activity,
  AlertTriangle,
  Send,
  ShieldAlert,
  Play,
  RotateCcw
} from "lucide-react";

interface CourierNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  bloodType: string;
  status: "IN TRANSIT" | "COMPLETED" | "STANDBY";
  temp: string;
}

interface HospitalBeacon {
  name: string;
  lat: number;
  lng: number;
  stockStatus: "CRITICAL" | "STABLE" | "OPTIMAL";
  needGroup: string;
}

export default function ControlRoom() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>("XM-902");
  
  // Couriers locations simulation
  const [couriers, setCouriers] = useState<CourierNode[]>([
    { id: "XM-902", name: "Courier #XM-902", lat: 110, lng: 45, bloodType: "O-", status: "IN TRANSIT", temp: "3.8°C" },
    { id: "TR-102", name: "Courier #TR-102", lat: 45, lng: 70, bloodType: "A+", status: "IN TRANSIT", temp: "4.2°C" },
    { id: "FL-502", name: "Courier #FL-502", lat: 175, lng: 25, bloodType: "B-", status: "STANDBY", temp: "3.9°C" }
  ]);

  const [operationLogs, setOperationLogs] = useState<string[]>([
    "[09:12 AM] Dispatch order TR-9981 activated: 2 units O- from Donation Hub to Seattle Central.",
    "[09:25 AM] Cold Chain telemetry established with Courier #XM-902: 3.8°C stable.",
    "[09:40 AM] SMS Outreach campaign launched: 18 standby O- donors alerted in Seattle sector.",
    "[09:42 AM] Recipient Sarah Chen signature verification complete for Bag ID: BAG-9902-O-MINUS."
  ]);

  const [newLogText, setNewLogText] = useState("");

  // Live coordinates movement simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setCouriers((prev) =>
        prev.map((c) => {
          if (c.status === "IN TRANSIT") {
            const latDelta = (Math.random() - 0.5) * 3;
            const lngDelta = (Math.random() - 0.5) * 3;
            return {
              ...c,
              lat: Math.max(20, Math.min(180, c.lat + latDelta)),
              lng: Math.max(20, Math.min(80, c.lng + lngDelta))
            };
          }
          return c;
        })
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const hospitalBeacons: HospitalBeacon[] = [
    { name: "Seattle Central Hospital", lat: 135, lng: 35, stockStatus: "CRITICAL", needGroup: "O-" },
    { name: "UW Medical Center", lat: 55, lng: 25, stockStatus: "STABLE", needGroup: "B-" },
    { name: "Swedish First Hill", lat: 95, lng: 65, stockStatus: "OPTIMAL", needGroup: "None" }
  ];

  const handlePostLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;
    const timeString = new Date().toLocaleTimeString();
    setOperationLogs((prev) => [`[${timeString}] ${newLogText}`, ...prev]);
    void sectionApi.controlRoomLog(newLogText).catch(() => undefined);
    setNewLogText("");
  };

  const activeCourier = couriers.find((c) => c.id === selectedCourierId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <span className="font-outfit text-xl font-extrabold tracking-tight text-white">
                HEMOGLOBIN <span className="text-red-500">AI</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Identity Tag */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-sm shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 font-sans">Command HUD</span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5 font-sans leading-none">
                Regional Control Room
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {[
                { id: "gis", label: "GIS Command Room", icon: <Globe className="h-4.5 w-4.5" /> }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all bg-red-500/10 text-red-500 text-left"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-800 text-xs font-bold font-sans">
            <button className="w-full flex items-center gap-3 py-1.5 text-slate-500 hover:text-slate-200 transition-colors text-left cursor-pointer">
              <Settings className="h-4.5 w-4.5" />
              Settings
            </button>
            <Link href="/" className="flex items-center gap-3 py-1.5 text-slate-500 hover:text-red-500 transition-colors text-left cursor-pointer">
              <LogOut className="h-4.5 w-4.5" />
              Exit Console
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Command Room HUD */}
      <div className="flex-grow md:pl-[260px] flex flex-col h-screen overflow-hidden">
        
        {/* Sub Header */}
        <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-850 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <h1 className="font-outfit text-sm font-extrabold text-white tracking-tight uppercase">
              Global GIS Tracking Map
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-sans">
              <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
              Emergency Mode Active
            </span>
          </div>
        </header>

        {/* HUD Split Screen Layout */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch overflow-hidden">
          
          {/* Left panel: Large interactive SVG map (~70% width) */}
          <div className="flex-1 relative bg-slate-950 border-r border-slate-900 overflow-hidden flex items-center justify-center">
            
            {/* GIS SVG Canvas */}
            <svg className="w-full h-full max-h-[85vh]" viewBox="0 0 200 100">
              <defs>
                <pattern id="gisGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="6" height="6" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gisGrid)" />

              {/* Major dispatch transit path routes */}
              <path d="M 35,25 Q 90,65 135,35" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M 110,45 Q 65,70 55,25" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />

              {/* Active Hospital beacons alerts */}
              {hospitalBeacons.map((beacon, idx) => (
                <g key={idx} className="cursor-pointer">
                  {beacon.stockStatus === "CRITICAL" ? (
                    <>
                      <circle cx={beacon.lat} cy={beacon.lng} r="8" fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
                      <circle cx={beacon.lat} cy={beacon.lng} r="4.5" fill="#ef4444" />
                    </>
                  ) : (
                    <circle cx={beacon.lat} cy={beacon.lng} r="4.5" fill="#3b82f6" />
                  )}
                  <text x={beacon.lat + 6} y={beacon.lng + 2.5} className="text-[5px] font-black fill-slate-500 font-sans uppercase tracking-wide">{beacon.name.split(" ")[0]}</text>
                </g>
              ))}

              {/* Live moving Courier pins */}
              {couriers.map((courier) => (
                <g
                  key={courier.id}
                  onClick={() => setSelectedCourierId(courier.id)}
                  className="cursor-pointer"
                >
                  <circle cx={courier.lat} cy={courier.lng} r="6" fill={selectedCourierId === courier.id ? "rgba(244, 63, 94, 0.4)" : "rgba(226, 232, 240, 0.15)"} />
                  <circle cx={courier.lat} cy={courier.lng} r="2.5" fill={courier.status === "IN TRANSIT" ? "#f43f5e" : "#64748b"} />
                </g>
              ))}
            </svg>

            {/* Float HUD Overlays detailing coordinates */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 max-w-xs text-left">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Map Legends</span>
              <div className="flex flex-col gap-1.5 text-[9px] font-bold text-slate-400 font-sans">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 block animate-pulse" />
                  <span>Critical Hospital Shortage (O- needed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500 block" />
                  <span>Stable Healthcare Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 block" />
                  <span>Active Courier In Transit</span>
                </div>
              </div>
            </div>

            {/* Float HUD Active courier detail drawer */}
            {activeCourier && (
              <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-xl p-4 flex flex-col gap-3 max-w-xs text-left font-sans text-xs shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-extrabold text-rose-500 uppercase block tracking-wide">Tracking Node Details</span>
                    <strong className="text-white font-outfit text-sm block mt-0.5">{activeCourier.name}</strong>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-1 py-0.2 rounded font-mono">{activeCourier.temp}</span>
                </div>
                
                <div className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-sans">
                  <div className="flex justify-between">
                    <span>Cargo Blood Group:</span>
                    <strong className="text-white">{activeCourier.bloodType} (PRBC)</strong>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Active Status:</span>
                    <span className="text-rose-500 uppercase font-black">{activeCourier.status}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right panel: Operations logs streams & manual actions (~30% width) */}
          <div className="w-full lg:w-[360px] bg-slate-900 border-t lg:border-t-0 border-slate-800 flex flex-col justify-between overflow-hidden shrink-0 h-1/3 lg:h-auto font-sans">
            
            {/* Live Logs Stream */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 border-b border-slate-800 font-sans">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block text-left">Operations Live Stream</span>
              
              <div className="flex flex-col gap-3 font-mono text-[9px] text-slate-400 text-left">
                {operationLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-slate-800/50 pb-2 last:border-0 last:pb-0 font-sans">
                    <p className="leading-relaxed font-semibold">{log}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Console logger form */}
            <form onSubmit={handlePostLog} className="p-4 bg-slate-950 flex gap-2 items-center font-sans">
              <input
                type="text"
                placeholder="Broadcast dispatch log message..."
                value={newLogText}
                onChange={(e) => setNewLogText(e.target.value)}
                className="flex-grow bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
