"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sectionApi } from "@/lib/backend-api";
import {
  Menu,
  X,
  LayoutDashboard,
  Truck,
  Settings,
  LogOut,
  MapPin,
  Activity,
  FileText,
  Check,
  Thermometer,
  Bell,
  HelpCircle,
  Smartphone,
  AlertTriangle,
  Signature
} from "lucide-react";

interface DispatchTask {
  id: string;
  bloodType: string;
  units: number;
  origin: string;
  destination: string;
  status: "IN TRANSIT" | "COMPLETED" | "ASSIGNED";
  tempLimit: string;
  urgency: "CRITICAL" | "STANDARD";
  eta: string;
}

export default function CourierDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState<"active" | "history">("active");
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [courierName, setCourierName] = useState("Vance Marcus");
  const [signatureText, setSignatureText] = useState("");
  const [isSubmittingSignature, setIsSubmittingSignature] = useState(false);
  const [signatureProgress, setSignatureProgress] = useState(0);
  const [signatureSuccess, setSignatureSuccess] = useState(false);

  // Live Telemetry states
  const [boxTemperature, setBoxTemperature] = useState(3.8);
  const [humidity, setHumidity] = useState(42);
  const [shockVibration, setShockVibration] = useState("Stable");
  const [lidSeal, setLidSeal] = useState("LOCKED");
  const [gpsProgress, setGpsProgress] = useState(72);

  // Tasks list
  const [activeTask, setActiveTask] = useState<DispatchTask>({
    id: "TR-9981",
    bloodType: "O-",
    units: 2,
    origin: "Seattle Blood Donation Hub",
    destination: "Seattle Central Hospital",
    status: "IN TRANSIT",
    tempLimit: "2.0°C - 6.0°C",
    urgency: "CRITICAL",
    eta: "8 mins"
  });

  // Telemetry fluctuation simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setBoxTemperature((prev) => {
        const delta = (Math.random() - 0.5) * 0.15;
        const next = prev + delta;
        return Number(Math.max(3.2, Math.min(4.5, next)).toFixed(1));
      });
      setHumidity((prev) => {
        const delta = Math.round((Math.random() - 0.5) * 2);
        return Math.max(38, Math.min(46, prev + delta));
      });
      if (Math.random() > 0.85) {
        setShockVibration("Minor Bump");
        setTimeout(() => setShockVibration("Stable"), 1500);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // GPS animation progress simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setGpsProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleStartSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureText.trim()) return;
    setIsSubmittingSignature(true);
    setSignatureProgress(0);
  };

  // Signature verification simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmittingSignature) {
      timer = setInterval(() => {
        setSignatureProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setSignatureSuccess(true);
              setIsSubmittingSignature(false);
              // Save delivery transaction hash to localStorage
              const newHash = `ledger-tx-${Date.now()}`;
              localStorage.setItem("latestDeliveryHash", newHash);
              void sectionApi.courierComplete(activeTask.id, { signature: signatureText, ledger_hash: newHash }).catch(() => undefined);
              localStorage.setItem("latestDeliveryTime", new Date().toLocaleTimeString());
              setActiveTask(prevTask => ({ ...prevTask, status: "COMPLETED" }));
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isSubmittingSignature]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
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

          {/* Courier Identity */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-sm shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 font-sans">Vance Marcus</span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5 font-sans leading-none">
                Courier Node #XM-902
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {[
                { id: "courier", label: "Fleet Telemetry", icon: <Activity className="h-4.5 w-4.5" /> }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all bg-red-500/10 text-red-500 text-left cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Settings and Logouts */}
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

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <h1 className="hidden sm:inline font-outfit text-sm font-extrabold text-white tracking-tight uppercase">
              Fleet Operations Desk
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-350 border border-slate-700">
                VM
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-300 font-sans">Vance Marcus</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
          
          {/* Row 1: Courier Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
                Active Courier Dispatch Telemetry
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Real-time transport optimization maps, safety sensor verification logs, and digital handovers.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-slate-450" />
                GPS System Online
              </span>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Left Column: Active Dispatch Card & Map Grid (~60%) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Task Detail Card */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col gap-4 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-extrabold text-red-550 uppercase tracking-wider block">Active Cargo Dispatch</span>
                    <h3 className="font-outfit text-lg font-black text-white mt-0.5">Task Order #{activeTask.id}</h3>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider border ${
                    activeTask.status === "IN TRANSIT"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/25 animate-pulse"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                  }`}>
                    {activeTask.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400">
                  <div className="flex flex-col gap-1 border-r border-slate-800 pr-2 text-left">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Required Inventory</span>
                    <span className="text-white font-bold flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white font-outfit font-black text-[10px]">
                        {activeTask.bloodType}
                      </span>
                      {activeTask.units} Bags (PRBC)
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-left">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Thermal Limits</span>
                    <span className="text-white font-bold">{activeTask.tempLimit}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 text-xs leading-relaxed flex flex-col gap-2 font-semibold">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Intake Facility</span>
                      <span className="text-slate-300">{activeTask.origin}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Destination Facility</span>
                      <span className="text-slate-200">{activeTask.destination}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vector Navigation Map */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-md text-left flex-1 flex flex-col gap-4">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Live Delivery Route Tracker</span>
                
                <div className="relative w-full aspect-[2/1] rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                    <defs>
                      <pattern id="courierGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <rect width="8" height="8" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#courierGrid)" />
                    {/* Seattle streets */}
                    <path d="M 0,35 L 200,35 M 65,0 L 65,100 M 135,0 L 135,100" stroke="#334155" strokeWidth="1.5" />
                    {/* Path coordinates */}
                    <path d="M 35,25 Q 90,65 145,35" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 1.5" />
                    
                    {/* Current courier node position indicator */}
                    <circle cx="115" cy="48" r="5" fill="rgba(239, 68, 68, 0.3)" />
                    <circle cx="115" cy="48" r="2.5" fill="#ef4444" />
                    
                    {/* Destination marker */}
                    <circle cx="145" cy="35" r="4.5" fill="#3b82f6" />
                  </svg>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-left">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <div>
                        <span className="font-black text-white block">Transit Coordinates</span>
                        <span className="text-[10px] text-slate-500 font-mono">Distance to Seattle Central: 1.2km</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-red-500 text-xs">{activeTask.eta} Left</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Sensors Telemetry logs (~40%) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Telemetry Gauge and Data */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col justify-between gap-5 text-left">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Bio-Box Telemetry Health</span>
                  <h3 className="font-outfit text-base font-extrabold text-white mt-0.5">Cold Chain Indicators</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Temp widget */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-[9px] font-extrabold uppercase">Temp Log</span>
                      <Thermometer className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-2xl font-black text-white leading-none">{boxTemperature}°C</span>
                      <span className="text-[8px] font-extrabold text-emerald-500 uppercase mt-1">✓ Stable Range</span>
                    </div>
                  </div>

                  {/* Humidity widget */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-[9px] font-extrabold uppercase">Humidity</span>
                      <Activity className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-2xl font-black text-white leading-none">{humidity}%</span>
                      <span className="text-[8px] font-extrabold text-emerald-500 uppercase mt-1">✓ Storage Optimal</span>
                    </div>
                  </div>

                  {/* Vibration Sensor */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-[9px] font-extrabold uppercase">Shock Index</span>
                      <Activity className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white leading-none">{shockVibration}</span>
                      <span className="text-[8px] font-extrabold text-slate-500 mt-1.5 uppercase font-mono">0.02G Peak</span>
                    </div>
                  </div>

                  {/* Lid Seal Lock */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-[9px] font-extrabold uppercase">Bio-box Lid</span>
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-emerald-500 leading-none">{lidSeal}</span>
                      <span className="text-[8px] font-extrabold text-slate-500 mt-1.5 uppercase font-mono">Sensor Hash Active</span>
                    </div>
                  </div>
                </div>

                {/* Handover Action button */}
                <button
                  onClick={() => {
                    setSignatureText("");
                    setIsSignatureModalOpen(true);
                    setSignatureSuccess(false);
                    setIsSubmittingSignature(false);
                  }}
                  disabled={activeTask.status === "COMPLETED"}
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-xs font-bold transition-all shadow-md ${
                    activeTask.status === "COMPLETED"
                      ? "bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed shadow-none"
                      : "bg-red-600 hover:bg-red-750 text-white shadow-red-500/10 cursor-pointer hover:-translate-y-0.5"
                  }`}
                >
                  <Signature className="h-4 w-4" />
                  {activeTask.status === "COMPLETED" ? "Delivery Handover Completed" : "Authorize Delivery Handover"}
                </button>
              </div>

              {/* Warning diagnostics */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-md flex items-start gap-3.5 text-left font-sans text-xs">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-200">Alert Checklist Threshold</span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Ambient temperature monitoring ranges are currently calibrated. If logs exceed 6.0°C for longer than 3 mins, automatic dispatch rerouting occurs.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* ========================================================
          HANDOVER SIGNATURE MODAL
          ======================================================== */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-800 flex flex-col gap-6 text-left animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => {
                if (!isSubmittingSignature) setIsSignatureModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmittingSignature && !signatureSuccess && (
              <>
                <div className="font-sans">
                  <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Signature className="h-6 w-6 text-red-500" />
                    Delivery Handover Sign-off
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Enter the authorized dispatcher code or recipient verification signature.
                  </p>
                </div>

                <form onSubmit={handleStartSignature} className="flex flex-col gap-4 font-sans text-xs">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-slate-400 font-semibold">Courier Name</label>
                    <input
                      type="text"
                      value={courierName}
                      disabled
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-350"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-slate-400 font-semibold">Recipient Signature Hash/Key</label>
                    <input
                      type="text"
                      placeholder="e.g., SCH-STAFF-MARCUS"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-xs font-bold text-white shadow-md shadow-red-500/10 transition-colors cursor-pointer mt-2"
                  >
                    Confirm &amp; Dispatched Ledger Hashing
                  </button>
                </form>
              </>
            )}

            {isSubmittingSignature && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-6 font-sans">
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * signatureProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="font-outfit text-xl font-black text-white leading-none">{signatureProgress}%</span>
                    <span className="text-[7px] font-extrabold text-slate-500 tracking-wider uppercase mt-1">Hashing</span>
                  </div>
                </div>

                <div className="max-w-sm flex flex-col gap-1.5">
                  <h3 className="font-outfit text-base font-extrabold text-white animate-pulse">
                    Validating Blockchain Signature
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1 font-mono">
                    Generating digital signature keys and appending transaction blocks...
                  </p>
                </div>
              </div>
            )}

            {signatureSuccess && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-5 font-sans">
                <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/25 shadow-sm animate-bounce">
                  <Check className="h-6 w-6 stroke-[3px]" />
                </div>

                <div className="max-w-sm flex flex-col gap-1 text-center">
                  <h3 className="font-outfit text-lg font-black text-white">
                    Signature Verified!
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Delivery signed off by Recipient: <strong className="text-white">{signatureText}</strong>. Compliance logs updated.
                  </p>
                </div>

                <button
                  onClick={() => setIsSignatureModalOpen(false)}
                  className="bg-slate-950 hover:bg-slate-850 text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer text-xs mt-2"
                >
                  Close Panel
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
