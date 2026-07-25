"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sectionApi } from "@/lib/backend-api";
import {
  LayoutDashboard,
  Users,
  Activity,
  Truck,
  BrainCircuit,
  Search,
  Bell,
  Settings,
  Heart,
  Calendar,
  Lock,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Menu,
  X,
  MessageSquareCode,
  MapPin,
  ChevronDown,
  Globe,
  Edit2,
  Phone,
  FileText,
  Clock,
  Compass,
  Award,
  Sparkles,
  Map,
  ShieldCheck,
  AlertCircle,
  Shield,
  Laptop,
  Smartphone,
  Check,
  ChevronRight,
  TrendingUp,
  Download,
  Plus,
  Star,
  RefreshCw,
  Zap,
  CheckSquare,
  DollarSign,
  FileSpreadsheet,
  AlertOctagon,
  LogOut,
  Hospital
} from "lucide-react";

interface BloodStock {
  bloodType: string;
  level: number;
  status: "CRITICAL" | "STABLE" | "OPTIMAL";
  bg: string;
  text: string;
}

interface Shipment {
  id: string;
  bloodType: string;
  units: number;
  eta: string;
  progress: number;
  courier: string;
}

interface MatchingPatient {
  id: string;
  name: string;
  dept: string;
  bloodType: string;
  matchDonor: string;
  distance: string;
  status: "standby" | "approved";
}

interface HospitalLog {
  id: string;
  title: string;
  description: string;
  time: string;
}

export default function HospitalDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Inventory" | "Active Orders" | "Matches" | "Outreach">("Dashboard");

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [formBloodType, setFormBloodType] = useState("O-");
  const [formUnits, setFormUnits] = useState(3);
  const [formHospital, setFormHospital] = useState("Seattle Central Hospital");

  // Matching Simulation State inside Order Modal
  const [isSimulatingOrder, setIsSimulatingOrder] = useState(false);
  const [orderProgress, setOrderProgress] = useState(0);
  const [orderStep, setOrderStep] = useState(0);

  // Outreach Campaign States
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastBloodType, setBroadcastBloodType] = useState("O-");
  const [campaignSuccess, setCampaignSuccess] = useState(false);

  // Broadcast timer progress simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSendingBroadcast) {
      timer = setInterval(() => {
        setBroadcastProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setCampaignSuccess(true);
              setIsSendingBroadcast(false);
              // Append to hospital logs
              const newLog: HospitalLog = {
                id: `hl-${Date.now()}`,
                title: "Outreach Campaign Launched",
                description: `Emergency SMS broadcast dispatched to 18 standby ${broadcastBloodType} donors in Seattle central sector.`,
                time: "Just Now"
              };
              setHospitalLogs(prevLogs => [newLog, ...prevLogs]);
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isSendingBroadcast]);

  // Blood stocks state (dynamic O- replenishment)
  const [bloodStocks, setBloodStocks] = useState<BloodStock[]>([
    { bloodType: "O-", level: 12, status: "CRITICAL", bg: "bg-red-50 text-red-600 border-red-100", text: "Critical Dip" },
    { bloodType: "O+", level: 78, status: "STABLE", bg: "bg-slate-50 text-slate-700 border-slate-100", text: "Stable" },
    { bloodType: "A-", level: 45, status: "STABLE", bg: "bg-slate-50 text-slate-700 border-slate-100", text: "Stable" },
    { bloodType: "A+", level: 88, status: "OPTIMAL", bg: "bg-emerald-50 text-emerald-600 border-emerald-100", text: "Optimal" },
    { bloodType: "B-", level: 15, status: "CRITICAL", bg: "bg-red-50 text-red-600 border-red-100", text: "Critical Dip" },
    { bloodType: "AB-", level: 65, status: "STABLE", bg: "bg-slate-50 text-slate-700 border-slate-100", text: "Stable" },
  ]);

  // Inbound Shipments State
  const [inboundShipments, setInboundShipments] = useState<Shipment[]>([
    { id: "TR-9981", bloodType: "O-", units: 2, eta: "8 mins", progress: 70, courier: "Courier #XM-902" },
    { id: "TR-8812", bloodType: "A+", units: 4, eta: "25 mins", progress: 40, courier: "Courier #TR-102" },
  ]);

  // Patient Donor Matching State
  const [matchingPatients, setMatchingPatients] = useState<MatchingPatient[]>([
    { id: "p-1", name: "John Doe", dept: "Trauma Unit", bloodType: "O-", matchDonor: "Marcus Thompson", distance: "5 mins away", status: "standby" },
    { id: "p-2", name: "Alice Smith", dept: "Surgery", bloodType: "A+", matchDonor: "Elena Vance", distance: "12 mins away", status: "standby" },
  ]);

  // Activity logs
  const [hospitalLogs, setHospitalLogs] = useState<HospitalLog[]>([
    { id: "hl-1", title: "Refill Inbound Authorized", description: "Inbound O- shipment #TR-9981 initialized from Central Blood Bank.", time: "Today, 3:30 PM" },
    { id: "hl-2", title: "Patient Match Selected", description: "Dr. Sarah Chen selected candidate Marcus Thompson for Trauma Case #18.", time: "Today, 1:45 PM" },
    { id: "hl-3", title: "PII Transport Ledger Encrypted", description: "Scrubbed demographic keys for transport ledger entry #881.", time: "Yesterday, 5:12 PM" },
  ]);

  // Handle Order Blood Units Submit
  const handleStartOrderSimulation = (e: React.FormEvent) => {
    void sectionApi.hospitalOrder({ blood_type: formBloodType, units: formUnits, hospital: formHospital }).catch(() => undefined);
    e.preventDefault();
    setIsSimulatingOrder(true);
    setOrderProgress(0);
    setOrderStep(0);
  };

  // Run Order replenishment progress counting
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingOrder) {
      timer = setInterval(() => {
        setOrderProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Simulation finished, add shipment and replenish inventory
            setTimeout(() => {
              // Replenish form blood type
              setBloodStocks(prevStocks => prevStocks.map(stock => {
                if (stock.bloodType === formBloodType) {
                  const newLevel = Math.min(100, stock.level + formUnits * 15);
                  return {
                    ...stock,
                    level: newLevel,
                    status: newLevel > 70 ? "OPTIMAL" : newLevel > 30 ? "STABLE" : "CRITICAL",
                    bg: newLevel > 70 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : newLevel > 30 ? "bg-slate-50 text-slate-700 border-slate-100" : "bg-red-50 text-red-600 border-red-100",
                    text: newLevel > 70 ? "Optimal" : newLevel > 30 ? "Stable" : "Critical Dip"
                  };
                }
                return stock;
              }));

              // Add Shipment
              const newShipmentId = `TR-${Math.floor(Math.random() * 9000) + 1000}`;
              const newShipment: Shipment = {
                id: newShipmentId,
                bloodType: formBloodType,
                units: formUnits,
                eta: "15 mins",
                progress: 10,
                courier: `Courier #TR-${Math.floor(Math.random() * 800) + 100}`
              };
              setInboundShipments(prevShipments => [newShipment, ...prevShipments]);

              // Add activity log
              const newLog: HospitalLog = {
                id: `hl-${Date.now()}`,
                title: "Blood Order Submitted",
                description: `Ordered ${formUnits} Units of ${formBloodType} for ${formHospital}. Dispatch confirmed.`,
                time: "Just Now"
              };
              setHospitalLogs(prevLogs => [newLog, ...prevLogs]);

              setIsSimulatingOrder(false);
              setIsOrderModalOpen(false);
            }, 800);
            return 100;
          }
          const nextVal = prev + 5;
          if (nextVal < 25) setOrderStep(0);
          else if (nextVal < 50) setOrderStep(1);
          else if (nextVal < 75) setOrderStep(2);
          else setOrderStep(3);

          return nextVal;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isSimulatingOrder]);

  const orderSteps = [
    "Contacting regional blood banks...",
    "Selecting nearest transit courier...",
    "Signing dispatch ledger hashes...",
    "Confirming delivery coordinates..."
  ];

  const handleApproveMatch = (id: string, name: string, blood: string) => {
    // Approve matching donor and log
    setMatchingPatients(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
    const newLog: HospitalLog = {
      id: `hl-${Date.now()}`,
      title: "Match Dispatch Approved",
      description: `Approved candidate dispatch for ${name} (${blood} needed). Courier notified.`,
      time: "Just Now"
    };
    setHospitalLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Sidebar Navigation (Left) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo & Close toggle */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <span className="font-outfit text-xl font-extrabold tracking-tight text-slate-900">
                HEMOGLOBIN <span className="text-red-600">AI</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-950 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Hospital Info Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center border border-red-100 shadow-sm shrink-0">
              <Hospital className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 font-sans">Seattle Central</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5 font-sans leading-none">
                Emergency Care Unit
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {[
                { id: "Dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
                { id: "Inventory", label: "Inventory Stock", icon: <Heart className="h-4.5 w-4.5" /> },
                { id: "Active Orders", label: "Active Orders", icon: <Truck className="h-4.5 w-4.5" /> },
                { id: "Matches", label: "Matches Registry", icon: <Activity className="h-4.5 w-4.5" /> },
                { id: "Outreach", label: "Outreach & Demand", icon: <BrainCircuit className="h-4.5 w-4.5" /> },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === item.id
                        ? "bg-red-50 text-red-600"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Settings controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 text-xs font-bold font-sans">
            <button className="w-full flex items-center gap-3 py-1.5 text-slate-400 hover:text-slate-800 transition-colors text-left cursor-pointer font-sans">
              <Settings className="h-4.5 w-4.5" />
              Settings
            </button>
            <Link href="/" className="flex items-center gap-3 py-1.5 text-slate-400 hover:text-red-600 transition-colors text-left cursor-pointer font-sans">
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. Main Work Panel (Right) */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-6 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Mobile menu toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-64 sm:w-80 font-sans">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inventory, orders, or patient records..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
            />
          </div>

          {/* User Details */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full animate-pulse" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                SC
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-700 font-sans">Sarah Chen</span>
            </div>
          </div>

        </header>

        {/* ========================================================
            TAB A: MAIN DASHBOARD VIEW
            ======================================================== */}
        {activeTab === "Dashboard" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 text-left animate-in fade-in duration-300 font-sans">
            
            {/* Greetings Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
              <div className="text-left font-sans">
                <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Hospital Procurement Console
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1 font-sans">
                  Manage emergency inventory levels, track inbound dispatches, and optimize procurement.
                </p>
              </div>

              {/* Action Trigger button */}
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all cursor-pointer hover:-translate-y-0.5 shrink-0 self-start sm:self-auto font-sans"
              >
                <Plus className="h-4 w-4" />
                Order Blood Units
              </button>
            </div>

            {/* Row 1: Four Cards metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Inventory Level
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">92% Capacity</span>
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-sans">Stable</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Dispatches
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">4 Inbound</span>
                  <span className="text-[9px] font-extrabold text-red-600 bg-red-50 px-1 py-0.5 rounded animate-pulse font-mono">Critical</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Patients Admitted
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">28 Cases</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Compliance Rating
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-indigo-600 font-mono">99.4%</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-sans">Optimal</span>
                </div>
              </div>
            </div>

            {/* Row 2: Emergency Inventory Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Inventory boxes & Inbound transits */}
              <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
                
                {/* Inventory Status Matrix */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-4 text-left">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900">
                    Emergency Stock Levels
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-sans text-xs">
                    {bloodStocks.map((stock) => (
                      <div
                        key={stock.bloodType}
                        className={`border rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3 transition-colors ${
                          stock.status === "CRITICAL" ? "border-red-200 bg-red-50/5" : "border-slate-100"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-black font-outfit shadow-sm shadow-red-600/10">
                            {stock.bloodType}
                          </span>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border ${
                            stock.status === "CRITICAL" ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-100 text-slate-500 border-slate-200/50"
                          }`}>
                            {stock.text}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-extrabold">
                            <span className="text-slate-400 uppercase tracking-wider">Level</span>
                            <span className={stock.status === "CRITICAL" ? "text-red-600 font-mono" : "text-slate-800 font-mono"}>{stock.level}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${stock.status === "CRITICAL" ? "bg-red-600" : "bg-emerald-600"}`}
                              style={{ width: `${stock.level}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-50/40 p-3 rounded-xl border border-red-100/50 flex items-start gap-2.5 text-xs text-red-600 leading-relaxed font-sans mt-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>O- and B- inventory levels have dropped below critical thresholds. AI has proactively generated standby donor dispatches.</span>
                  </div>
                </div>

                {/* Inbound Blood Shipments */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-4 text-left">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900">
                    Inbound Blood Shipments
                  </h3>

                  <div className="flex flex-col gap-4">
                    {inboundShipments.map((ship) => (
                      <div
                        key={ship.id}
                        className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-red-200 transition-all flex flex-col gap-3.5 relative"
                      >
                        <div className="absolute inset-y-0 left-0 w-1 bg-red-600 rounded-l-xl" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left font-sans text-xs">
                          <div className="flex items-start gap-3.5">
                            <div className="h-9 w-9 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-outfit font-black text-xs shrink-0">
                              {ship.bloodType}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-black text-slate-800">Dispatch #{ship.id}</span>
                              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {ship.units} Units • {ship.courier}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 font-sans font-semibold">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">
                              ETA: {ship.eta}
                            </span>
                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                              In Transit
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 rounded-full" style={{ width: `${ship.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Patient Match Selector & Ledger */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 font-sans">
                
                {/* Patient Matching Grid */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-600" />
                    Patient Donor Matching
                  </h3>

                  <div className="flex flex-col gap-4 font-sans text-xs">
                    {matchingPatients.map((pat) => (
                      <div
                        key={pat.id}
                        className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex flex-col justify-between gap-3 text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col text-left gap-0.5">
                            <span className="font-bold text-slate-800">{pat.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{pat.dept}</span>
                          </div>
                          
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-outfit font-black text-[10px]">
                            {pat.bloodType}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 border-t border-slate-100 pt-2 text-[10px] text-slate-500 font-semibold leading-relaxed">
                          <span>Match Donor: <strong className="text-slate-800">{pat.matchDonor}</strong></span>
                          <span>Distance: <strong className="text-slate-800">{pat.distance}</strong></span>
                        </div>

                        {pat.status === "standby" ? (
                          <button
                            onClick={() => handleApproveMatch(pat.id, pat.name, pat.bloodType)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 rounded-lg transition-colors cursor-pointer text-center font-sans mt-1"
                          >
                            Approve Dispatch
                          </button>
                        ) : (
                          <span className="w-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold py-1.5 rounded-lg text-center font-sans mt-1">
                            ✓ Dispatch Approved
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ledger logs */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    Ledger Activity
                  </h3>

                  <div className="flex flex-col gap-3 font-mono text-[9px] font-bold text-slate-500">
                    {hospitalLogs.map((log) => (
                      <div key={log.id} className="flex gap-2 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                        <span className="text-red-600 shrink-0 font-sans font-bold">[LEDGER]</span>
                        <div className="flex flex-col text-left font-sans text-[9px] font-semibold gap-0.5">
                          <span className="text-slate-800 font-extrabold leading-tight">{log.title}</span>
                          <p className="text-slate-400 font-medium leading-relaxed">{log.description}</p>
                          <span className="text-[8px] text-slate-400 font-mono mt-1">{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            TAB B: INVENTORY VIEW
            ======================================================== */}
        {activeTab === "Inventory" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Emergency Blood Inventory Stock
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Real-time storage status, temperature logs, and shelf-life monitoring systems.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-2">Blood Group</th>
                      <th className="py-3 px-2">Available Vol (Units)</th>
                      <th className="py-3 px-2">Storage Temp</th>
                      <th className="py-3 px-2">Stock Level (%)</th>
                      <th className="py-3 px-2">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                    {bloodStocks.map(stock => (
                      <tr key={stock.bloodType} className="hover:bg-slate-50/50 transition-all">
                        <td className="py-3.5 px-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white font-outfit font-black text-xs">
                            {stock.bloodType}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 font-mono">{(stock.level * 0.4).toFixed(0)} Bags</td>
                        <td className="py-3.5 px-2 font-mono text-emerald-600">3.8°C</td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono w-8">{stock.level}%</span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${stock.level < 20 ? "bg-red-600" : "bg-emerald-600"}`} style={{ width: `${stock.level}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                            stock.level < 20 ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}>
                            {stock.level < 20 ? "⚠️ Depleted" : "✓ Optimal"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            TAB C: ACTIVE ORDERS VIEW
            ======================================================== */}
        {activeTab === "Active Orders" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Active &amp; Past Shipments
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Track en route dispatches and historical procurement orders.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm">
              <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4">
                Inbound Dispatches
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inboundShipments.map(ship => (
                  <div key={ship.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-outfit font-black text-[10px]">
                          {ship.bloodType}
                        </span>
                        <span className="font-black text-slate-800">#{ship.id}</span>
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-400 font-mono">ETA: {ship.eta}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600" style={{ width: `${ship.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            TAB D: MATCHES VIEW
            ======================================================== */}
        {activeTab === "Matches" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Matches Registry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Verify blood compatibility vectors and manage active donor allocations.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-2">
                Active Patients Matching List
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingPatients.map(pat => (
                  <div key={pat.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{pat.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{pat.dept}</span>
                      </div>
                      <span className="h-7 w-7 rounded-full bg-red-600 text-white font-outfit font-black text-xs flex items-center justify-center shrink-0">
                        {pat.bloodType}
                      </span>
                    </div>
                    <div className="border-t border-slate-150 pt-2 text-[10px] text-slate-500 font-semibold leading-relaxed">
                      <span>Suggested Donor: <strong>{pat.matchDonor}</strong> ({pat.distance})</span>
                    </div>
                    {pat.status === "standby" ? (
                      <button
                        onClick={() => handleApproveMatch(pat.id, pat.name, pat.bloodType)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 rounded-lg text-center"
                      >
                        Approve Candidate Dispatch
                      </button>
                    ) : (
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold py-1.5 rounded-lg text-center">
                        ✓ Dispatch Approved
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            TAB E: OUTREACH & DEMAND VIEW
            ======================================================== */}
        {activeTab === "Outreach" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
            
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Outreach &amp; Demand Forecasting
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 font-sans">
                Predict seasonal blood stock depletion cycles and broadcast targeted notifications to proximity donors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              
              {/* AI Demand Prediction (Left, ~60%) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-5 text-left">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  AI Demand Forecasting (14-Day Scale)
                </span>

                {/* SVG demand trend line chart */}
                <div className="relative w-full aspect-[2.4/1] rounded-xl bg-slate-50/50 border border-slate-100 overflow-hidden flex items-center justify-center p-3">
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    {/* Grid lines */}
                    <path d="M 0,30 L 300,30 M 0,60 L 300,60 M 0,90 L 300,90" stroke="#f1f5f9" strokeWidth="1" />
                    
                    {/* Prediction trend line */}
                    <path d="M 10,95 Q 80,80 150,40 T 290,110" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                    
                    {/* Indicator dots */}
                    <circle cx="150" cy="40" r="4" fill="#ef4444" />
                    <circle cx="150" cy="40" r="8" fill="rgba(239, 68, 68, 0.2)" className="animate-pulse" />
                    
                    <text x="150" y="28" textAnchor="middle" className="text-[8px] font-black fill-red-600 font-mono">CRITICAL depletion warning (Day 3)</text>
                    <text x="10" y="112" className="text-[7px] font-bold fill-slate-400">Day 1</text>
                    <text x="145" y="112" className="text-[7px] font-bold fill-slate-400">Day 7</text>
                    <text x="275" y="112" className="text-[7px] font-bold fill-slate-400">Day 14</text>
                  </svg>
                </div>

                <div className="bg-red-50/40 p-3.5 rounded-xl border border-red-100/50 text-[10px] text-red-650 font-semibold leading-relaxed font-sans">
                  <strong>AI Recommendation:</strong> Regional O- storage capacity will deplete to critical levels within 72 hours due to scheduling surges. Immediate outreach collection is suggested.
                </div>
              </div>

              {/* Outreach Campaign Broadcasting Console (Right, ~40%) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-5 text-left">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Campaign Broadcaster
                </span>

                <div className="flex flex-col gap-3 font-sans text-xs pt-1 text-left">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-slate-400 font-semibold">Target Blood Group</label>
                    <select
                      value={broadcastBloodType}
                      onChange={(e) => setBroadcastBloodType(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    >
                      {["O-", "O+", "A-", "A+", "B-", "AB-"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-slate-400 font-semibold flex justify-between">
                      <span>SMS Standby Recipients</span>
                      <span className="text-red-600 font-bold">18 Donors Active</span>
                    </label>
                    <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500 font-semibold leading-relaxed border border-slate-100">
                      "Hemoglobin AI Emergency Alert: Attn standby {broadcastBloodType} donors in Seattle central sector. Immediate dispatch requested at Seattle Central."
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBroadcastProgress(0);
                    setIsCampaignModalOpen(true);
                    setIsSendingBroadcast(false);
                    setCampaignSuccess(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer"
                >
                  <BrainCircuit className="h-4 w-4" />
                  Initiate Campaign
                </button>
              </div>

            </div>

            {/* Standby Donor Network Table */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left">
              <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4">
                Standby Donor Network (Central Sector)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Marcus Thompson", blood: "O-", dist: "0.8km away", reliability: "98% Score" },
                  { name: "Elena Vance", blood: "A+", dist: "2.4km away", reliability: "95% Score" },
                  { name: "Sarah Connor", blood: "B-", dist: "4.2km away", reliability: "92% Score" }
                ].map((donor, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200">
                        {donor.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{donor.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{donor.dist}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-600 font-outfit font-black text-[10px]">
                        {donor.blood}
                      </span>
                      <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded block mt-1 uppercase leading-none">{donor.reliability}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        )}

      </div>

      {/* ========================================================
          NEW ORDER MODAL ( replenishment & simulated matching loader )
          ======================================================== */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-100 flex flex-col gap-6 text-left animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => {
                if (!isSimulatingOrder) setIsOrderModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSimulatingOrder ? (
              <>
                <div className="font-sans">
                  <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Heart className="h-6 w-6 fill-red-100 text-red-600 animate-pulse" />
                    Hospital Refill Request
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Order emergency blood inventory bags via the regional AI distribution network.
                  </p>
                </div>

                <form onSubmit={handleStartOrderSimulation} className="flex flex-col gap-4 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Blood Group</label>
                      <select
                        value={formBloodType}
                        onChange={(e) => setFormBloodType(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                      >
                        {["O-", "O+", "A-", "A+", "B-", "AB-"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Units (Bags)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formUnits}
                        onChange={(e) => setFormUnits(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-semibold">Dispatching Facility</label>
                    <select
                      value={formHospital}
                      onChange={(e) => setFormHospital(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    >
                      <option value="Seattle Central Hospital">Seattle Central Hospital</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer mt-4"
                  >
                    <BrainCircuit className="h-4 w-4" />
                    Submit Refill Order
                  </button>
                </form>
              </>
            ) : (
              // AI ORDER SIMULATION LOADER
              <div className="flex flex-col items-center justify-center py-6 text-center gap-6 font-sans">
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * orderProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="font-outfit text-xl font-black text-slate-900 leading-none">{orderProgress}%</span>
                    <span className="text-[7px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">Refilling</span>
                  </div>
                </div>

                <div className="max-w-sm flex flex-col gap-1.5">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 animate-pulse">
                    Analyzing Regional Reserves
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1 min-h-[30px] font-mono">
                    {orderSteps[orderStep]}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================
          OUTREACH EMERGENCY CAMPAIGN DIALOG
          ======================================================== */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-100 flex flex-col gap-6 text-left animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => {
                if (!isSendingBroadcast) setIsCampaignModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSendingBroadcast && !campaignSuccess && (
              <>
                <div className="font-sans">
                  <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-red-600" />
                    Launch Outreach Campaign
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    This triggers an emergency SMS broadcast request to certified standby donors.
                  </p>
                </div>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Message Preview</span>
                    <p className="text-slate-700 font-semibold leading-relaxed">
                      "Hemoglobin AI Emergency Alert: Attn standby {broadcastBloodType} donors in Seattle central sector. Immediate dispatch requested at Seattle Central."
                    </p>
                  </div>

                  <div className="flex justify-between items-center bg-amber-50 border border-amber-100 text-amber-700 p-3 rounded-lg text-[10px] font-semibold leading-relaxed">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Launching this campaign will broadcast messages to 18 active standby donors.</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsSendingBroadcast(true);
                      setBroadcastProgress(0);
                      void sectionApi.hospitalBroadcast({ blood_type: broadcastBloodType }).catch(() => undefined);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer mt-2"
                  >
                    Confirm &amp; Broadcast SMS
                  </button>
                </div>
              </>
            )}

            {isSendingBroadcast && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-6 font-sans">
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * broadcastProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="font-outfit text-xl font-black text-slate-900 leading-none">{broadcastProgress}%</span>
                    <span className="text-[7px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">Broadcasting</span>
                  </div>
                </div>

                <div className="max-w-sm flex flex-col gap-1.5">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 animate-pulse">
                    Broadcasting SMS Alerts
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1 font-mono">
                    Routing notification packets through secure cellular nodes...
                  </p>
                </div>
              </div>
            )}

            {campaignSuccess && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-5 font-sans">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce">
                  <Check className="h-6 w-6 stroke-[3px]" />
                </div>

                <div className="max-w-sm flex flex-col gap-1 text-center">
                  <h3 className="font-outfit text-lg font-black text-slate-900">
                    Campaign Launched!
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Emergency SMS broadcast dispatched to 18 standby {broadcastBloodType} donors. Realtime matching registries updated.
                  </p>
                </div>

                <button
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer text-xs mt-2"
                >
                  Close Console
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
