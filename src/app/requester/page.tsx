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
  LogOut
} from "lucide-react";
import RequestModal from "@/components/RequestModal";

interface BloodRequest {
  id: string;
  type: string;
  bloodType: string;
  hospital: string;
  units: number;
  status: "URGENT" | "ON ROUTE" | "COMPLETED";
  statusText: string;
  timeRemaining?: string;
  distance?: string;
  price?: string;
  progress: number;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Processed" | "Pending" | "Overdue";
}

interface SupportTicket {
  id: string;
  title: string;
  status: "Resolved" | "Assigned" | "Open";
  timeText: string;
  agent?: string;
}

interface ActivityLog {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

export default function RequesterDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Requests" | "Tracking" | "Support">("Dashboard");

  // Modals state
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [formBloodType, setFormBloodType] = useState("O-");
  const [formHospital, setFormHospital] = useState("St. Jude Medical Center");
  const [formUnits, setFormUnits] = useState(2);
  const [formUrgency, setFormUrgency] = useState("URGENT");

  // Matching Simulation State inside New Request Modal
  const [isSimulatingMatch, setIsSimulatingMatch] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchStep, setMatchStep] = useState(0);

  // Active Requests State (dynamic list)
  const [activeRequests, setActiveRequests] = useState<BloodRequest[]>([
    {
      id: "8821",
      type: "Emergency Plasma Request",
      bloodType: "O-",
      hospital: "St. Jude Medical Center",
      units: 2,
      status: "URGENT",
      statusText: "14m remaining",
      progress: 80,
    },
    {
      id: "8790",
      type: "Scheduled Platelets Request",
      bloodType: "AB+",
      hospital: "City General Hospital",
      units: 1,
      status: "ON ROUTE",
      statusText: "2.4 miles away",
      price: "$140.00",
      progress: 45,
    }
  ]);

  // Post-Transfusion Log States
  const [manualTemp, setManualTemp] = useState("98.6");
  const [manualHeartRate, setManualHeartRate] = useState("72");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [observationNotes, setObservationNotes] = useState("");
  const [isLogSavedToastVisible, setIsLogSavedToastVisible] = useState(false);
  const [recentHistory, setRecentHistory] = useState([
    { id: "h-1", date: "OCT 24", vitals: "102.4 BPM • 98.4°F", desc: "No symptoms reported", hasWarning: false },
    { id: "h-2", date: "OCT 23", vitals: "98 BPM • 99.1°F", desc: "Mild Fever", hasWarning: true },
    { id: "h-3", date: "OCT 23", vitals: "85 BPM • 98.6°F", desc: "Baseline recorded", hasWarning: false },
  ]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: `h-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase(),
      vitals: `${manualHeartRate} BPM • ${manualTemp}°F`,
      desc: selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "No symptoms reported",
      hasWarning: selectedSymptoms.includes("Fever"),
    };
    setRecentHistory(prev => [newLog, ...prev]);
    void sectionApi.vitals({ temperature: Number(manualTemp), heart_rate: Number(manualHeartRate), symptoms: selectedSymptoms, notes: observationNotes }).catch(() => undefined);
    setIsLogSavedToastVisible(true);
    setTimeout(() => setIsLogSavedToastVisible(false), 3000);
  };


  // Billing statements
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-2024-001", date: "May 12", amount: "$1,240", status: "Processed" },
    { id: "INV-2024-002", date: "May 14", amount: "$890", status: "Pending" },
  ]);

  // Support Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "t-1", title: "Delivery Verification Issue", status: "Resolved", timeText: "Resolved 2h ago" },
    { id: "t-2", title: "Address Update Requested", status: "Assigned", timeText: "Assigned to Agent Marcus", agent: "Marcus" },
  ]);

  // Activity Log State
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: "act-1", icon: "🔴", iconBg: "bg-red-50 text-red-600", title: "Blood Units Dispatched", description: "O- Plasma for Request #8821 left the Central Blood Bank.", time: "Today, 2:14 PM" },
    { id: "act-2", icon: "🟢", iconBg: "bg-emerald-50 text-emerald-600", title: "Fulfillment Completed", description: "Request #8755 (A+ Red Cells) delivered successfully to North Wing.", time: "Today, 11:30 AM" },
    { id: "act-3", icon: "🔵", iconBg: "bg-blue-50 text-blue-600", title: "New Invoice Generated", description: "Monthly summary for April 2024 is now available in Billing.", time: "Yesterday, 5:45 PM" },
  ]);

  const handlePreFillAndRequest = (blood: string, hosp: string) => {
    setFormBloodType(blood);
    setFormHospital(hosp);
    setIsNewRequestModalOpen(true);
  };

  // Handle New Blood Request Modal Submission
  const handleStartMatchSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingMatch(true);
    setMatchProgress(0);
    setMatchStep(0);
  };

  // Run matching simulation progress counting
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingMatch) {
      timer = setInterval(() => {
        setMatchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Simulation finished, add new request to state
            setTimeout(() => {
              const newId = (Math.floor(Math.random() * 9000) + 1000).toString();
              const newRequest: BloodRequest = {
                id: newId,
                type: formUrgency === "URGENT" ? "Emergency Whole Blood" : "Scheduled Plasma Request",
                bloodType: formBloodType,
                hospital: formHospital,
                units: formUnits,
                status: formUrgency as any,
                statusText: formUrgency === "URGENT" ? "45m remaining" : "On standby",
                price: formUrgency === "URGENT" ? undefined : "$210.00",
                progress: 10,
              };
              
              // Prepend to requests list
              setActiveRequests(prevRequests => [newRequest, ...prevRequests]);

              // Prepend to activity logs
              const newActivity: ActivityLog = {
                id: `act-${Date.now()}`,
                icon: "🔴",
                iconBg: "bg-red-50 text-red-600",
                title: "New Blood Request Created",
                description: `${formUnits} Units of ${formBloodType} requested for ${formHospital}. AI network matching active.`,
                time: "Just Now"
              };
              setActivityLogs(prevLogs => [newActivity, ...prevLogs]);

              setIsSimulatingMatch(false);
              setIsNewRequestModalOpen(false);
            }, 800);
            return 100;
          }
          const nextVal = prev + 5;
          // Step indicators
          if (nextVal < 25) setMatchStep(0);
          else if (nextVal < 50) setMatchStep(1);
          else if (nextVal < 75) setMatchStep(2);
          else setMatchStep(3);

          return nextVal;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isSimulatingMatch]);

  const matchSteps = [
    "Locating certified standby O- donors...",
    "Verifying geographic route optimization...",
    "Confirming secure smart-contract signatures...",
    "Generating blockchain ledger credentials..."
  ];

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

          {/* Hospital Patient Portal User Tag */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center border border-red-100 shadow-sm shrink-0">
              🏥
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 font-sans">Patient Portal</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5 font-sans leading-none font-mono">
                ID: #44892-RT
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {[
                { id: "Dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
                { id: "Requests", label: "Requests", icon: <Activity className="h-4.5 w-4.5" /> },
                { id: "Tracking", label: "Tracking", icon: <MapPin className="h-4.5 w-4.5" /> },
                { id: "Support", label: "Support", icon: <HelpCircle className="h-4.5 w-4.5" /> },
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

        {/* Bottom controls */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all cursor-pointer font-sans"
          >
            <Plus className="h-4 w-4" />
            New Blood Request
          </button>

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
          <div className="relative w-64 sm:w-60 font-sans">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests..."
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
                  Welcome back, Sarah
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1">
                  Your active requests are being processed by our AI network.
                </p>
              </div>

              {/* Action Trigger button */}
              <button
                onClick={() => setIsNewRequestModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all cursor-pointer hover:-translate-y-0.5 shrink-0 self-start sm:self-auto font-sans"
              >
                <Plus className="h-4 w-4" />
                New Blood Request
              </button>
            </div>

            {/* Row 1: Four Cards metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Metric 1 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Units Requested
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">24 Units</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5 font-mono">
                    ▲ 12%
                  </span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Lives Impacted
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">112</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-sans">Lifetime</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Savings
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">$4,280</span>
                  <span className="text-[10px] font-extrabold text-red-600 font-mono">
                    -$240
                  </span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Avg. Fulfillment
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">42 mins</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Active</span>
                </div>
              </div>

            </div>

            {/* Row 2: Active requests & AI predicted matches */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column (Wider, ~65%) */}
              <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
                
                {/* Active Blood Requests */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center mb-2 font-sans">
                    <h3 className="font-outfit text-base font-extrabold text-slate-900">
                      Active Blood Requests
                    </h3>
                    <button
                      onClick={() => setActiveTab("Requests")}
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {activeRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-red-200 transition-all flex flex-col gap-3.5 relative"
                      >
                        <div className="absolute inset-y-0 left-0 w-1 bg-red-600 rounded-l-xl" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left font-sans">
                          
                          {/* Left details */}
                          <div className="flex items-start gap-3.5">
                            <div className="h-9 w-9 rounded-full border border-red-200 bg-red-50 text-red-600 flex items-center justify-center font-outfit font-black text-xs shrink-0 shadow-sm">
                              {request.bloodType}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 leading-tight">
                                {request.type} #{request.id}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold mt-1">
                                {request.hospital} • {request.units} Unit{request.units > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Right tags and actions */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 font-sans">
                            <div className="flex gap-2">
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide border ${
                                request.status === "URGENT"
                                  ? "bg-red-50 text-red-600 border-red-100"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}>
                                {request.status}
                              </span>
                              {request.statusText && (
                                <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-slate-400 uppercase tracking-wide">
                                  <Clock className="h-2.5 w-2.5" />
                                  {request.statusText}
                                </span>
                              )}
                            </div>
                            
                            {request.price && (
                              <span className="font-outfit text-xs font-black text-slate-800">
                                {request.price}
                              </span>
                            )}

                            <button
                              onClick={() => setActiveTab("Tracking")}
                              className={`text-[10px] font-extrabold transition-colors cursor-pointer ${
                                request.status === "URGENT" ? "text-red-600 hover:text-red-700" : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              {request.status === "URGENT" ? "Track Live" : "Details"}
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar tracking */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              request.status === "URGENT" ? "bg-red-600" : "bg-emerald-600"
                            }`}
                            style={{ width: `${request.progress}%` }}
                          />
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Predicted Matches */}
                <div className="bg-gradient-to-r from-red-50/50 via-white to-red-50/50 rounded-2xl border border-red-100 p-5 sm:p-6 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <BrainCircuit className="h-4 w-4 text-red-600" />
                    AI Predicted Matches
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-sans">
                    <div className="bg-white/80 p-4 rounded-xl border border-slate-100 flex flex-col justify-between gap-3 text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-slate-800">Optimal Donor Found</span>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                          A perfect O- match is 5 mins from St. Jude. AI suggests immediate dispatch.
                        </p>
                      </div>
                      <button
                        onClick={() => handlePreFillAndRequest("O-", "St. Jude Medical Center")}
                        className="text-[10px] font-bold text-red-600 hover:text-red-700 cursor-pointer self-start"
                      >
                        Authorize Match
                      </button>
                    </div>

                    <div className="bg-white/80 p-4 rounded-xl border border-slate-100 flex flex-col justify-between gap-3 text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-slate-800">Supply Chain Alert</span>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                          B+ stocks are low. We've proactively alerted nearby certified couriers.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("Tracking")}
                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer self-start"
                      >
                        View Strategy
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Narrower, ~35%) */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
                


                {/* Live Tracking map coordinate preview */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  
                  {/* Map visualization */}
                  <div className="relative w-full aspect-[4/3] rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center mb-3">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 150">
                      <defs>
                        <pattern id="chicagoGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <rect width="10" height="10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#chicagoGrid)" />
                      {/* Diagonal grid streets */}
                      <path d="M 0,40 L 200,40 M 80,0 L 80,150 M 140,0 L 140,150" stroke="#cbd5e1" strokeWidth="2" />
                      {/* Curved route */}
                      <path d="M 40,30 Q 100,80 140,40" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 1.5" />
                      {/* Pulse pins */}
                      <circle cx="140" cy="40" r="5" fill="rgba(239,68,68,0.2)" />
                      <circle cx="140" cy="40" r="2.5" fill="#ef4444" />
                      
                      <circle cx="40" cy="30" r="4" fill="#3b82f6" />
                    </svg>

                    {/* Proximity badge card overlay */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/90 backdrop-blur-sm rounded-lg p-2.5 border border-slate-800 flex items-center gap-2 text-left font-sans text-[8px] text-white">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-white">Live Tracking</span>
                        <span className="text-slate-400 font-semibold">Courier #XM-902 is 0.8km away</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Tickets */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-red-600" />
                    Support Tickets
                  </h3>

                  <div className="flex flex-col gap-4 font-sans text-xs">
                    {tickets.map((t) => (
                      <div key={t.id} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${
                            t.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          }`}>
                            {t.status === "Resolved" ? <Check className="h-3.5 w-3.5 stroke-[3px]" /> : <Clock className="h-3.5 w-3.5" />}
                          </div>
                          
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-800">{t.title}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 font-sans">
                              {t.timeText}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab("Support")}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 text-xs font-bold transition-all cursor-pointer mt-4 font-sans"
                  >
                    Open New Ticket
                  </button>
                </div>

              </div>

            </div>

            {/* Row 3: Recent Activity list */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left">
              <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-6">
                Recent Activity
              </h3>

              <div className="relative border-l-2 border-slate-100 pl-6 ml-3 flex flex-col gap-6 font-sans">
                {activityLogs.map((log) => (
                  <div key={log.id} className="relative">
                    {/* Activity dot marker */}
                    <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center shadow-sm" />
                    
                    <div className="flex flex-col text-left font-sans">
                      <span className="text-xs font-extrabold text-slate-800">{log.title}</span>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 font-sans leading-relaxed">
                        {log.description}
                      </p>
                      <span className="text-[9px] text-slate-400 font-semibold font-mono mt-1.5 uppercase">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        )}

        {/* ========================================================
            TAB B: REQUESTS VIEW
            ======================================================== */}
        {activeTab === "Requests" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
            
            {/* Header / Title line */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 font-sans">
              <div className="text-left font-sans">
                <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Post-Transfusion Status
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Recovery Phase: Day 2 of 5
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => alert("Connecting you directly to your attending physician. Please stand by...")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <AlertOctagon className="h-4 w-4" />
                Call Physician (Emergency)
              </button>
            </div>

            {/* Row 1: AI Wellness Score and Manual Vital Log Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              
              {/* AI Wellness Score (Width ~35%) */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center justify-between text-center gap-5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block self-start">
                  AI Wellness Score
                </span>

                {/* SVG Radial Gauge */}
                <div className="relative h-32 w-32 flex items-center justify-center">
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
                      strokeDashoffset={251.2 - (251.2 * 85) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="font-outfit text-3xl font-black text-slate-900 leading-none">85</span>
                    <span className="text-[8px] font-extrabold text-emerald-600 tracking-wider uppercase mt-1 leading-none">Optimal</span>
                  </div>
                </div>

                <div className="font-sans flex flex-col gap-3">
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                    Your vitals are within expected parameters for 48 hours post-transfusion.
                  </p>

                  <div className="flex justify-center gap-2 mt-1">
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 leading-none">
                      Stable
                    </span>
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider bg-blue-50 text-blue-600 border border-blue-100 leading-none">
                      W-Linked
                    </span>
                  </div>
                </div>
              </div>

              {/* Manual Vital Log Form (Width ~65%) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-5 relative text-left">
                
                {/* Save log success toast indicator inside card */}
                {isLogSavedToastVisible && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-1">
                    <Check className="h-3 w-3 stroke-[3px]" /> Log Saved Successfully!
                  </div>
                )}

                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900">
                    Manual Log
                  </h3>
                  <span className="text-[9px] font-extrabold text-slate-400 font-mono">
                    Last Logged: 10:24 AM
                  </span>
                </div>

                <form onSubmit={handleSaveLog} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
                  
                  {/* Left Column inputs */}
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-red-500" />
                        Body Temperature (°F)
                      </label>
                      <input
                        type="text"
                        value={manualTemp}
                        onChange={(e) => setManualTemp(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold font-mono text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-red-600 fill-red-100" />
                        Heart Rate (BPM)
                      </label>
                      <input
                        type="text"
                        value={manualHeartRate}
                        onChange={(e) => setManualHeartRate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Column symptoms */}
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Report Symptoms</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["Fever", "Rash", "Nausea", "Chills", "Itching"].map(sym => {
                          const isSelected = selectedSymptoms.includes(sym);
                          return (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => toggleSymptom(sym)}
                              className={`px-3 py-1.5 rounded-full font-bold border transition-all text-[10px] cursor-pointer ${
                                isSelected
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-350"
                              }`}
                            >
                              {sym}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <textarea
                        placeholder="Any other notes or observations..."
                        value={observationNotes}
                        onChange={(e) => setObservationNotes(e.target.value)}
                        className="w-full h-18 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Save button row */}
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/10 hover:-translate-y-0.5"
                    >
                      Save Log
                    </button>
                  </div>

                </form>
              </div>

            </div>

            {/* Row 2: Wearable Activity and Recent History list */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Wearable Activity (Width ~60%) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col gap-5">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Activity className="h-5 w-5 text-red-600" />
                    Wearable Activity
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 leading-none">
                    ✓ Linked
                  </span>
                </div>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  {/* Steps */}
                  <div className="flex justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                        🏃
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-800">Daily Steps</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Target: 2,500 (Post-Op Light)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-outfit text-base font-black text-slate-800 font-mono">1,842</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: "74%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Sleep */}
                  <div className="flex justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                        🌙
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-800">Sleep Quality</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Rest is crucial for recovery
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 font-sans text-right">
                      <span className="font-outfit text-base font-black text-slate-800 font-mono">7h 45m</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Deep Sleep: 2h</span>
                    </div>
                  </div>
                </div>

                {/* Bottom wearable AI insights banner */}
                <div className="bg-red-50/40 p-3.5 rounded-xl border border-red-100/50 flex items-start gap-2.5 text-[10px] text-red-650 font-semibold leading-relaxed font-sans mt-1">
                  <BrainCircuit className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>AI Insight: Your heart rate variability (HRV) has improved by 12% since yesterday morning, indicating positive recovery.</span>
                </div>
              </div>

              {/* Recent History log records (Width ~40%) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left flex flex-col gap-4 justify-between">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Recent History
                </span>

                <div className="flex flex-col gap-3 font-sans text-xs">
                  {recentHistory.map((hist) => (
                    <div
                      key={hist.id}
                      className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 hover:bg-slate-50/20 transition-all rounded-lg p-1.5"
                    >
                      <div className="flex items-center gap-3">
                        {/* Custom Date card */}
                        <div className="h-9 w-9 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg flex flex-col items-center justify-center font-mono shrink-0 shadow-sm leading-none">
                          <span className="text-[8px] font-black">{hist.date.split(" ")[0]}</span>
                          <span className="text-xs font-black mt-1 leading-none">{hist.date.split(" ")[1]}</span>
                        </div>

                        <div className="flex flex-col text-left font-sans gap-0.5">
                          <span className="font-extrabold text-slate-800 font-mono">{hist.vitals}</span>
                          <span className={`text-[10px] font-semibold font-sans mt-0.5 flex items-center gap-0.5 ${
                            hist.hasWarning ? "text-red-500 font-bold" : "text-slate-400"
                          }`}>
                            {hist.hasWarning && <AlertTriangle className="h-2.5 w-2.5 shrink-0" />}
                            {hist.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert("Exporting all post-transfusion vitals reports...")}
                  className="w-full text-center text-xs font-bold text-red-600 hover:text-red-700 transition-colors mt-2"
                >
                  View Full Reports
                </button>
              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            TAB C: TRACKING VIEW
            ======================================================== */}
        {activeTab === "Tracking" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5 font-sans">
              <div className="text-left font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-red-600 border border-red-200 bg-red-50/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ● Urgent Request
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-tight">
                    Order #TX-9902-Z
                  </span>
                </div>
                <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Tracking Blood Fulfillment
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Destined for Metropolitan General Hospital • Trauma Center
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer bg-white">
                  <Globe className="h-4 w-4 text-slate-400" />
                  Share Link
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer">
                  <Phone className="h-4 w-4" />
                  Contact Logistics
                </button>
              </div>
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column (Wider, ~65%) */}
              <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
                
                {/* Delivery Progress Timeline Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-6">
                    Delivery Progress
                  </span>

                  {/* Horizontal Timeline Container */}
                  <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 font-sans">
                    
                    {/* Connecting Background Line */}
                    <div className="absolute top-[18px] left-[18px] right-[18px] hidden sm:block h-[3px] bg-slate-100 -z-0">
                      <div className="w-[75%] h-full bg-red-600 rounded-full" />
                    </div>

                    {/* Step 1 */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-0 text-left sm:text-center flex-1 relative z-10">
                      <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center border border-red-600 shadow-sm shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col sm:items-center mt-0 sm:mt-3">
                        <span className="text-xs font-black text-slate-800 leading-tight">Requested</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">08:12 AM</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-0 text-left sm:text-center flex-1 relative z-10">
                      <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center border border-red-600 shadow-sm shrink-0">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col sm:items-center mt-0 sm:mt-3">
                        <span className="text-xs font-black text-slate-800 leading-tight">Screened</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">08:45 AM</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-0 text-left sm:text-center flex-1 relative z-10">
                      <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center border border-red-600 shadow-sm shrink-0">
                        <Heart className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col sm:items-center mt-0 sm:mt-3">
                        <span className="text-xs font-black text-slate-800 leading-tight">Matched</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">09:10 AM</span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-0 text-left sm:text-center flex-1 relative z-10">
                      <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center border border-red-600 shadow-sm shrink-0">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col sm:items-center mt-0 sm:mt-3">
                        <span className="text-xs font-black text-red-600 leading-tight">In Transit</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Active</span>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-0 text-left sm:text-center flex-1 relative z-10">
                      <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col sm:items-center mt-0 sm:mt-3">
                        <span className="text-xs font-black text-slate-400 leading-tight">Delivered</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Pending</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Los Angeles Custom Map Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-1 shadow-sm overflow-hidden relative aspect-[1.4/1] sm:aspect-[1.6/1]">
                  
                  {/* Custom Map Graphic */}
                  <svg className="w-full h-full object-cover" viewBox="0 0 600 450" fill="none">
                    <rect width="600" height="450" fill="#e3eedf" />
                    
                    {/* Water bodies */}
                    <path d="M -20,400 Q 150,380 250,470 L -20,470 Z" fill="#b9d6eb" />

                    {/* Grid Street Lines */}
                    <path d="M 0,80 L 600,80 M 0,160 L 600,160 M 0,240 L 600,240 M 0,320 L 600,320 M 0,400 L 600,400" stroke="#fcfcfc" strokeWidth="2.5" />
                    <path d="M 100,0 L 100,450 M 200,0 L 200,450 M 300,0 L 300,450 M 400,0 L 400,450 M 500,0 L 500,450" stroke="#fcfcfc" strokeWidth="2.5" />
                    
                    {/* Interstates / Freeways */}
                    <path d="M -50,150 C 150,120 400,280 650,220" stroke="#e0be69" strokeWidth="5" />
                    <path d="M 120,-50 Q 280,180 340,500" stroke="#e0be69" strokeWidth="4" />
                    <path d="M 450,-50 Q 420,240 580,500" stroke="#e0be69" strokeWidth="4" />

                    {/* Route line */}
                    <path d="M 220,100 Q 300,200 400,330" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 3" />
                    
                    {/* Points of Interest */}
                    <circle cx="220" cy="100" r="14" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" className="shadow" />
                    <circle cx="220" cy="100" r="5" fill="#3b82f6" />
                    
                    {/* Destination Marker */}
                    <g transform="translate(400, 330)">
                      <circle cx="0" cy="0" r="18" fill="rgba(239, 68, 68, 0.15)" />
                      <circle cx="0" cy="0" r="6" fill="#ef4444" />
                      <path d="M-8,-25 L8,-25 L0,-12 Z" fill="#ef4444" />
                    </g>

                    {/* Geographic labels */}
                    <text x="300" y="240" textAnchor="middle" className="text-xl font-bold fill-slate-800 font-sans tracking-wide">Los Angeles</text>
                    <text x="220" y="130" textAnchor="middle" className="text-[10px] font-black fill-slate-600 font-sans">Dodger Stadium</text>
                    <text x="500" y="100" textAnchor="middle" className="text-[10px] font-black fill-slate-400 font-sans">South Pasadena</text>
                    <text x="500" y="380" textAnchor="middle" className="text-[10px] font-black fill-slate-400 font-sans">East Los Angeles</text>
                    <text x="180" y="340" textAnchor="middle" className="text-[10px] font-black fill-slate-400 font-sans">Pico-Union</text>
                  </svg>

                  {/* Absolute map overlay badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3.5 border border-slate-100 shadow-lg text-left flex items-start gap-2.5 font-sans min-w-[210px]">
                    <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left font-sans gap-0.5">
                      <span className="font-outfit text-base font-extrabold text-slate-800 leading-none">14 mins</span>
                      <span className="text-[10px] text-slate-400 font-semibold font-sans mt-0.5 leading-none">
                        Estimated Arrival (10:24 AM)
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column (Narrower, ~35%) */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 font-sans">
                
                {/* Unit Specification */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4 font-sans text-xs">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Unit Specification
                  </span>

                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                    <div className="h-11 w-11 rounded-full border border-red-200 bg-red-50 text-red-600 flex items-center justify-center font-outfit font-black text-sm shrink-0">
                      O-
                    </div>
                    <div className="flex flex-col text-left font-sans">
                      <span className="font-outfit text-base font-black text-slate-800 leading-none">4 Units</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 font-sans">
                        Packed Red Blood Cells
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 font-semibold text-slate-700 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Donation ID</span>
                      <span className="text-slate-800 font-mono font-bold">#BR-881204</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Expiration</span>
                      <span className="text-slate-800 font-bold">Oct 14, 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Handling</span>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider leading-none">
                        Standard Cold Chain
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logistics Coordinator */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-3 font-sans text-xs">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Logistics Coordinator
                  </span>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 shrink-0">
                        MV
                      </div>
                      <div className="flex flex-col text-left font-sans">
                        <span className="font-bold text-slate-800 leading-none">Marcus Vance</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1 font-sans">
                          Senior Dispatcher
                        </span>
                      </div>
                    </div>
                    
                    <button className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer relative shrink-0">
                      <MessageSquareCode className="h-4.5 w-4.5" />
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-600 rounded-full" />
                    </button>
                  </div>
                </div>

                {/* Live Temp Log */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4 font-sans text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Live Temp Log
                    </span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      3.8°C
                    </span>
                  </div>

                  {/* Temp SVG column bars chart */}
                  <div className="h-16 flex items-end justify-between gap-1 w-full relative">
                    {[38, 42, 35, 45, 52, 48, 45, 40, 42, 38].map((val, idx) => (
                      <div key={idx} className="flex-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors relative" style={{ height: `${val}%` }}>
                        {idx === 4 && <div className="absolute inset-x-0 bottom-0 bg-emerald-600 rounded" style={{ height: "100%" }} />}
                        {idx !== 4 && <div className="absolute inset-x-0 bottom-0 bg-emerald-600/30 rounded" style={{ height: "100%" }} />}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-extrabold text-slate-400 font-mono">
                    <span>09:10 AM</span>
                    <span className="uppercase">Optimal Range (2-6°C)</span>
                    <span>NOW</span>
                  </div>
                </div>

                {/* AI Prediction Alert Card */}
                <div className="bg-gradient-to-r from-red-50/70 to-white rounded-2xl border border-red-100 p-5 shadow-sm text-left flex flex-col gap-3 font-sans text-xs relative overflow-hidden">
                  <h4 className="text-[9px] font-extrabold text-red-600 uppercase tracking-wider flex items-center gap-1">
                    <BrainCircuit className="h-3.5 w-3.5 shrink-0" />
                    AI Prediction
                  </h4>
                  
                  <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
                    Traffic pattern analysis predicts a 3-minute delay due to surface road congestion. Rerouting active.
                  </p>

                  <div className="flex justify-between items-center border-t border-red-100/50 pt-2.5 mt-1">
                    <span className="text-[8px] text-slate-400 font-mono uppercase">
                      Updated 2m ago
                    </span>
                    <ChevronRight className="h-4 w-4 text-red-600" />
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* Billing Section Removed */}

        {/* ========================================================
            TAB E: SUPPORT TICKETS VIEW
            ======================================================== */}
        {activeTab === "Support" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 text-left animate-in fade-in duration-300 font-sans">
            
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Support Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1 font-sans">
                Review active tickets, monitor response updates, or open new inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Form to submit ticket */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left flex flex-col gap-5">
                <h3 className="font-outfit text-base font-extrabold text-slate-900">
                  Open New Support Ticket
                </h3>

                <form className="flex flex-col gap-4 font-sans text-xs">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-slate-400 font-semibold">Subject / Issue Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Courier coordinate sync error"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-slate-400 font-semibold">Description</label>
                    <textarea
                      placeholder="Describe your issue..."
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 resize-none"
                    />
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer self-start px-4">
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Right Column: Ticket listings */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                  Active Tickets
                </h3>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  {tickets.map((t) => (
                    <div key={t.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex items-start gap-3 text-left">
                      <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${
                        t.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {t.status === "Resolved" ? <Check className="h-3.5 w-3.5 stroke-[3px]" /> : <Clock className="h-3.5 w-3.5" />}
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-800 leading-tight">{t.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1">
                          {t.timeText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </main>
        )}

      </div>

      {/* ========================================================
          NEW BLOOD REQUEST MODAL (WITH SIMULATED AI MATCHING LOADER)
          ======================================================== */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-100 flex flex-col gap-6 text-left animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => {
                if (!isSimulatingMatch) setIsNewRequestModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSimulatingMatch ? (
              <>
                <div className="font-sans">
                  <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Heart className="h-6 w-6 fill-red-100 text-red-600 animate-pulse" />
                    New Blood Request Form
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Input details to dispatch the secure AI donor matching sequence.
                  </p>
                </div>

                <form onSubmit={handleStartMatchSimulation} className="flex flex-col gap-4 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-semibold">Blood Type Needed</label>
                      <select
                        value={formBloodType}
                        onChange={(e) => setFormBloodType(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                      >
                        {["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].map(t => (
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
                    <label className="text-slate-400 font-semibold">Hospital / Dispatch Facility</label>
                    <select
                      value={formHospital}
                      onChange={(e) => setFormHospital(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    >
                      {[
                        "St. Jude Medical Center",
                        "City General Hospital",
                        "Northwest Medical Center",
                        "Seattle Central Hospital"
                      ].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-semibold">Urgency Classification</label>
                    <div className="flex gap-4 mt-1">
                      {["URGENT", "ON ROUTE"].map(u => (
                        <label key={u} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="urgency"
                            checked={formUrgency === u}
                            onChange={() => setFormUrgency(u)}
                            className="accent-red-600"
                          />
                          <span className={`text-xs font-bold ${formUrgency === u ? "text-red-600" : "text-slate-500"}`}>{u}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer mt-4"
                  >
                    <BrainCircuit className="h-4 w-4" />
                    Submit &amp; Match Donors
                  </button>
                </form>
              </>
            ) : (
              // AI MATCHING SIMULATION LOADER PANEL
              <div className="flex flex-col items-center justify-center py-6 text-center gap-6">
                {/* Circular matching animation */}
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
                      strokeDashoffset={251.2 - (251.2 * matchProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="font-outfit text-xl font-black text-slate-900 leading-none">{matchProgress}%</span>
                    <span className="text-[7px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">AI Matching</span>
                  </div>
                </div>

                <div className="font-sans max-w-sm flex flex-col gap-1.5">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 animate-pulse">
                    Analyzing Donor Registries
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1 min-h-[30px] font-mono">
                    {matchSteps[matchStep]}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
