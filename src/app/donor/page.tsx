"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  CheckSquare
} from "lucide-react";
import RequestModal from "@/components/RequestModal";
import DonorModal from "@/components/DonorModal";
import { authApi } from "@/lib/backend-api";

interface Session {
  id: string;
  device: string;
  location: string;
  time: string;
  isCurrent: boolean;
  type: "laptop" | "phone";
}

interface InstitutionPermission {
  id: string;
  name: string;
  permissions: string[];
  lastAccessed: string;
}

interface Contract {
  id: string;
  vendor: string;
  logoInitials: string;
  logoBg: string;
  agreement: string;
  duration: string;
  volume: string;
  status: "active" | "renewal" | "suspended";
  compliance: number;
}

interface NetworkDonor {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  status: "Available" | "Standby" | "Busy";
  livesSaved: number;
  lastDonated: string;
  phone: string;
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; profile?: Record<string, unknown> } | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState<"Dashboard" | "Network" | "Logistics" | "Profile" | "Settings">("Dashboard");

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [prefillBlood, setPrefillBlood] = useState("");
  const [prefillHospital, setPrefillHospital] = useState("");

  // Card button click states
  const [registeredInterest, setRegisteredInterest] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  // Profile specific states
  const [travelRadius, setTravelRadius] = useState(25);

  // Settings specific states
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [premiumAnonymization, setPremiumAnonymization] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => { authApi.me().then(setUserProfile).catch(() => undefined); }, []);
  const userName = userProfile?.name || "User";
  const userInitials = userName.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "U";
  const userBloodType = String(userProfile?.profile?.blood_type || "—");
  const userLocation = ["division", "district", "upazila", "union"].map(key => userProfile?.profile?.[key]).filter(Boolean).join(", ") || "Location not added";
  const userImage = typeof userProfile?.profile?.image_url === "string" ? userProfile.profile.image_url : "";

  // Logistics specific states
  const [mixAdjusted, setMixAdjusted] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([
    { id: "con-1", vendor: "BioMatriX Solutions", logoInitials: "BM", logoBg: "bg-rose-50 text-rose-600", agreement: "Plasma Supply", duration: "24m", volume: "450 Units", status: "active", compliance: 82 },
    { id: "con-2", vendor: "GenoLife Distribution", logoInitials: "GL", logoBg: "bg-slate-100 text-slate-600", agreement: "O-Negative Reserve", duration: "12m", volume: "120 Units", status: "renewal", compliance: 94 },
    { id: "con-3", vendor: "VitalAlpha Logistics", logoInitials: "VA", logoBg: "bg-red-50 text-red-600", agreement: "Whole Blood", duration: "36m", volume: "1,200 Units", status: "active", compliance: 41 },
    { id: "con-4", vendor: "HemaXpress Global", logoInitials: "HX", logoBg: "bg-blue-50 text-blue-600", agreement: "Emergency Rare Types", duration: "12m", volume: "On-Demand", status: "suspended", compliance: 0 },
  ]);
  
  const [sessions, setSessions] = useState<Session[]>([
    { id: "s-1", device: "MacBook Pro 16\"", location: "San Francisco, CA", time: "Current Session", isCurrent: true, type: "laptop" },
    { id: "s-2", device: "iPhone 15 Pro", location: "San Francisco, CA", time: "2 hours ago", isCurrent: false, type: "phone" },
  ]);

  const [sharingCenters, setSharingCenters] = useState<InstitutionPermission[]>([
    { id: "c-1", name: "St. Jude Medical Center", permissions: ["Blood Type", "Donation History"], lastAccessed: "Oct 12, 2023" },
    { id: "c-2", name: "Central Blood Bank", permissions: ["Full Profile"], lastAccessed: "Aug 29, 2023" },
    { id: "c-3", name: "National Research Bio-Lab", permissions: ["Anonymized Data Only"], lastAccessed: "Nov 04, 2023" },
  ]);

  // Network Specific States
  const [selectedBloodType, setSelectedBloodType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const networkDonors: NetworkDonor[] = [
    { id: "nd-1", name: "Marcus Thompson", bloodType: "O-", location: "Capitol Hill, Seattle", status: "Available", livesSaved: 36, lastDonated: "Feb 14, 2024", phone: "+1 (555) 234-5678" },
    { id: "nd-2", name: "Elena Vance", bloodType: "A+", location: "Redmond, WA", status: "Standby", livesSaved: 18, lastDonated: "Mar 10, 2024", phone: "+1 (555) 876-5432" },
    { id: "nd-3", name: "David Kim", bloodType: "B-", location: "Bellevue, WA", status: "Standby", livesSaved: 12, lastDonated: "Apr 02, 2024", phone: "+1 (555) 123-9876" },
    { id: "nd-4", name: "Sophia Martinez", bloodType: "AB-", location: "Downtown Seattle", status: "Busy", livesSaved: 24, lastDonated: "Jan 28, 2024", phone: "+1 (555) 456-7890" },
    { id: "nd-5", name: "Jordan Cole", bloodType: "O+", location: "Tacoma, WA", status: "Available", livesSaved: 15, lastDonated: "May 15, 2024", phone: "+1 (555) 789-0123" },
    { id: "nd-6", name: "Maria Rossi", bloodType: "A-", location: "Seattle Heights", status: "Available", livesSaved: 29, lastDonated: "Jun 02, 2024", phone: "+1 (555) 901-2345" },
  ];

  // Emergency Hub Specific States
  const [rollingLogs, setRollingLogs] = useState<string[]>([
    "System Initialized. Active GPS corridors online.",
    "O- matching dispatch initialized for Central General Hospital.",
    "Standby Alert broadcast to O- donors in 10-mile radius.",
    "Ledger hash #LH-90812 registered on secure hospital network.",
    "Courier TR-8812 verified at Northwest Medical transit hub."
  ]);

  // AI Insights Specific States
  const [aiLogs, setAiLogs] = useState<string[]>([
    "Scanning demographic donation data...",
    "Predictive analysis: O- supply depletion risk rises in next 5 days.",
    "Differential privacy filter running. PII strings anonymized.",
    "Suggested action: Trigger SMS alerts to Seattle standby O- donors."
  ]);

  // Simulated live logs feed for Emergency Hub & AI Insights
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        "GPS: Courier TR-8812 updated coordinates: 47.6062° N, 122.3321° W.",
        "Matches: Standby donor contacted (O- type match success).",
        "Ledger: Block #99281 signed. Verification hash computed.",
        "Alert: Hospital procurement request received from Valley Clinic.",
        "AI: Optimization complete. Route transit reduced by 3.2 minutes."
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setRollingLogs(prev => [randomAction, ...prev.slice(0, 7)]);
      
      const aiActions = [
        "AI model parameters adjusted. Accuracy 99.42% stable.",
        "Optimizing transport vectors for St. Jude supply pipelines.",
        "Campaign forecast complete: Seattle region targeted for Platelets."
      ];
      setAiLogs(prev => [aiActions[Math.floor(Math.random() * aiActions.length)], ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleOpenRequest = (blood = "", hosp = "") => {
    setPrefillBlood(blood);
    setPrefillHospital(hosp);
    setIsRequestModalOpen(true);
  };

  const handleSavePreferences = () => {
    setShowToast(true);
  };

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleLogoutAllOther = () => {
    setSessions(sessions.filter(s => s.isCurrent));
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { name: "Donor Network", icon: <Users className="h-4.5 w-4.5" /> },
    { name: "Emergency Hub", icon: <Activity className="h-4.5 w-4.5" /> },
    { name: "Supply Logistics", icon: <Truck className="h-4.5 w-4.5" /> },
    { name: "AI Insights", icon: <BrainCircuit className="h-4.5 w-4.5" /> },
  ];

  // Filtering Donor Network listing
  const filteredDonors = networkDonors.filter(donor => {
    const matchesBlood = selectedBloodType === "All" || donor.bloodType === selectedBloodType;
    const matchesQuery = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBlood && matchesQuery;
  });

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

          {/* User Profile Info (Toggles Profile view) */}
          <button
            onClick={() => {
              setActiveSubTab("Profile");
              setActiveNav("Profile");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left cursor-pointer ${
              activeSubTab === "Profile"
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-slate-50 hover:bg-slate-100 border-slate-100"
            }`}
          >
            <div className="h-10 w-10 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center font-bold font-outfit shadow-sm relative overflow-hidden">
              {userImage ? <img src={userImage} alt={userName} className="h-full w-full object-cover" /> : userInitials}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 font-sans">{userName}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Senior Hematologist
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveNav(item.name);
                      setMobileSidebarOpen(false);
                      if (item.name === "Dashboard") {
                        setActiveSubTab("Dashboard");
                      } else if (item.name === "Supply Logistics") {
                        setActiveSubTab("Logistics");
                      } else {
                        setActiveSubTab(item.name as any);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeNav === item.name && activeSubTab !== "Settings" && activeSubTab !== "Profile"
                        ? "bg-red-50 text-red-600"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleOpenRequest()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white shadow-md shadow-red-600/15 transition-all cursor-pointer hover:-translate-y-0.5 font-sans"
          >
            <AlertTriangle className="h-4 w-4" />
            Urgent Request
          </button>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 text-xs font-bold font-sans">
            <button
              onClick={() => {
                setActiveSubTab("Settings");
                setActiveNav("Settings");
              }}
              className={`w-full flex items-center gap-3 py-1.5 transition-colors cursor-pointer text-left font-sans ${
                activeSubTab === "Settings"
                  ? "text-red-600 font-extrabold"
                  : "text-slate-400 hover:text-slate-800"
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              Settings
            </button>
            <a href="#support" className="flex items-center gap-3 text-slate-400 hover:text-slate-800 transition-colors">
              <HelpCircle className="h-4.5 w-4.5" />
              Support
            </a>
          </div>
        </div>
      </aside>

      {/* 2. Main Work Panel (Right) */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen relative">
        
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

          {/* Clean Top Search Bar Input (No duplicate nav tabs) */}
          <div className="relative w-64 sm:w-80 font-sans">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeNav === "Supply Logistics"
                  ? "Search contracts, vendors, or ledger..."
                  : activeNav === "Donor Network"
                  ? "Search donor directory..."
                  : "Search matches, donors, or request ledger..."
              }
              value={activeNav === "Donor Network" ? searchQuery : ""}
              onChange={(e) => {
                if (activeNav === "Donor Network") {
                  setSearchQuery(e.target.value);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full animate-pulse" />
            </button>
            <button
              onClick={() => {
                setActiveSubTab("Settings");
                setActiveNav("Settings");
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                activeSubTab === "Settings" ? "text-red-600 bg-red-50" : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {/* Click to open Profile */}
            <button
              onClick={() => {
                setActiveSubTab("Profile");
                setActiveNav("Profile");
              }}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shadow-inner border border-slate-200 overflow-hidden">
                {userImage ? <img src={userImage} alt={userName} className="h-full w-full object-cover" /> : userInitials}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-700 font-sans">{userName}</span>
            </button>
          </div>

        </header>

        {/* ========================================================
            VIEW A: DONOR COMMAND CENTER (DASHBOARD)
            ======================================================== */}
        {activeNav === "Dashboard" && activeSubTab === "Dashboard" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
            
            {/* Greeting Header & Blood Type Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-left font-sans">
                <span className="text-[10px] font-extrabold tracking-widest text-red-600 uppercase">
                  Good Morning, Sarah
                </span>
                <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Donor Command Center
                </h1>
              </div>

              {/* Blood Type Badge */}
              <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100/50 rounded-2xl px-4 py-3 shrink-0 self-start sm:self-auto shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <Heart className="h-5 w-5 fill-red-100" />
                </div>
                <div className="flex flex-col text-left font-sans">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Your Blood Type
                  </span>
                  <span className="text-sm font-extrabold text-red-600 font-outfit">
                    O- <span className="text-xs font-semibold text-slate-500 font-sans ml-1">(Universal)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Row 1: Eligibility and Impact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* Next Donation Eligibility Status (60% width) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-6 shadow-sm">
                <div className="flex-1 text-left font-sans">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase mb-4">
                    Eligibility Status
                  </span>
                  <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                    Next Donation in 14 Days
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[340px] mb-6">
                    Your last Whole Blood donation was on June 12th. You're almost ready to save lives again!
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenRequest("O-", "City General Hospital")}
                      className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all hover:-translate-y-0.5 cursor-pointer font-sans"
                    >
                      Schedule Appointment
                    </button>
                    <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer font-sans">
                      View Requirements
                    </button>
                  </div>
                </div>

                {/* Countdown Circular progress SVG */}
                <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
                  <svg className="h-full w-full transform -rotate-95" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#b91c1c"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="font-outfit text-3xl font-extrabold text-slate-900 leading-none">14</span>
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">Days Left</span>
                  </div>
                </div>
              </div>

              {/* Total Impact metrics (40% width) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
                <div className="text-left font-sans">
                  <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider mb-4">
                    <Heart className="h-3.5 w-3.5 text-red-500 fill-red-100" />
                    Total Impact
                  </div>
                  
                  <h2 className="font-outfit text-3xl font-extrabold text-slate-900 leading-none mb-1">
                    12.5 <span className="text-lg font-semibold text-slate-500 font-sans">Liters</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Equivalent to saving approx. <strong className="text-slate-700">38 lives</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-6 text-left font-sans">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Donations
                    </span>
                    <span className="font-outfit text-xl font-extrabold text-slate-800 mt-1">
                      24
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-4">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Current Streak
                    </span>
                    <span className="font-outfit text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                      5x
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: AI-Matched Urgent Requests Grid */}
            <div className="flex flex-col font-sans">
              
              <div className="flex items-center justify-between mb-5 font-sans">
                <h3 className="font-outfit text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BrainCircuit className="h-5 w-5 text-red-600" />
                  AI-Matched Urgent Requests
                </h3>
                <a href="#explore" className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
                  Explore Hub &rarr;
                </a>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left font-sans">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl border border-red-200/50 p-5 flex flex-col justify-between shadow-sm relative group hover:border-red-300 transition-colors">
                  <div className="absolute inset-y-0 left-0 w-1 bg-red-600 rounded-l-2xl" />
                  
                  <div className="text-left font-sans">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-extrabold">
                      <span className="inline-flex items-center bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded uppercase">
                        ! Critical
                      </span>
                      <span className="text-slate-400 font-semibold font-mono">2.4 miles away</span>
                    </div>
                    
                    <h4 className="font-outfit text-base font-extrabold text-slate-950 mb-2">
                      Central General Hospital
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                      Immediate need for O- blood due to multi-vehicle accident trauma. Your type is a 100% match.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4 font-sans">
                      <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 border border-white text-[8px] font-bold flex items-center justify-center">JC</div>
                        <div className="h-6 w-6 rounded-full bg-blue-100 border border-white text-[8px] font-bold text-blue-600 flex items-center justify-center">MI</div>
                        <div className="h-6 w-6 rounded-full bg-red-100 border border-white text-[8px] font-bold text-red-600 flex items-center justify-center">+4</div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        6 other donors responding
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenRequest("O-", "Central General Hospital")}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-xs font-bold text-white transition-all cursor-pointer font-sans"
                    >
                      Respond Now
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between shadow-sm relative group hover:border-slate-200 transition-colors">
                  <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l-2xl" />
                  
                  <div className="text-left font-sans">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-extrabold">
                      <span className="inline-flex items-center bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded uppercase">
                        Urgent
                      </span>
                      <span className="text-slate-400 font-semibold font-mono">5.8 miles away</span>
                    </div>

                    <h4 className="font-outfit text-base font-extrabold text-slate-900 mb-2">
                      St. Jude's Pediatric
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-8 font-medium">
                      Platelet donation needed for ongoing therapy. AI predicts a supply dip in the next 48 hours.
                    </p>
                  </div>

                  <button
                    onClick={() => setRegisteredInterest(!registeredInterest)}
                    className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer font-sans ${
                      registeredInterest
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                        : "border border-red-600 bg-white hover:bg-red-50/50 text-red-600"
                    }`}
                  >
                    {registeredInterest ? "✓ Registered" : "Register Interest"}
                  </button>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between shadow-sm relative group hover:border-slate-200 transition-colors">
                  <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-l-2xl" />
                  
                  <div className="text-left font-sans">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-extrabold">
                      <span className="inline-flex items-center bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                        Scheduled
                      </span>
                      <span className="text-slate-400 font-semibold font-mono">0.9 miles away</span>
                    </div>

                    <h4 className="font-outfit text-base font-extrabold text-slate-900 mb-2">
                      Red Cross Mobile Unit
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-8 font-medium">
                      Next community drive at Market Square. Easy access and fast processing for recurring donors.
                    </p>
                  </div>

                  <button
                    onClick={() => setReminderSet(!reminderSet)}
                    className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer font-sans ${
                      reminderSet
                        ? "bg-slate-100 text-slate-500"
                        : "border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {reminderSet ? "✓ Reminder Active" : "Set Reminder"}
                  </button>
                </div>

                <button
                  onClick={() => handleOpenRequest()}
                  className="absolute bottom-[-20px] right-2 sm:right-4 h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-20 hover:scale-105"
                  title="AI Command Assistant"
                >
                  <MessageSquareCode className="h-5.5 w-5.5" />
                </button>
              </div>

            </div>

            {/* Row 3: History & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-8 text-left">
              
              {/* Donation History Chart */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between mb-6 font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-950">
                    Donation History
                  </h3>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 cursor-pointer font-sans">
                    Last 12 Months
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="w-full aspect-[2/1] min-h-[160px] flex items-end justify-between px-2 sm:px-6 relative font-mono text-[9px] font-bold text-slate-400 mt-2">
                  <div className="absolute inset-x-0 top-0 border-t border-slate-50" />
                  <div className="absolute inset-x-0 top-1/3 border-t border-slate-50" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-slate-50" />
                  <div className="absolute inset-x-0 bottom-6 border-t border-slate-100" />
                  
                  {[
                    { month: "JAN", height: "h-[20%]", active: false },
                    { month: "FEB", height: "h-[40%]", active: false },
                    { month: "MAR", height: "h-[30%]", active: false },
                    { month: "APR", height: "h-[85%]", active: true },
                    { month: "MAY", height: "h-[50%]", active: false },
                    { month: "JUN", height: "h-[65%]", active: false },
                    { month: "JUL", height: "h-[45%]", active: false },
                  ].map((bar) => (
                    <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end z-10 w-8">
                      <div
                        className={`w-4 sm:w-6 rounded-t-md transition-all duration-500 ease-out cursor-pointer hover:opacity-90 ${
                          bar.height
                        } ${
                          bar.active
                            ? "bg-red-600 shadow-md shadow-red-600/20"
                            : "bg-slate-200 hover:bg-slate-300"
                        }`}
                      />
                      <span className={`text-[10px] font-sans ${bar.active ? "text-red-600 font-extrabold" : ""}`}>
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements list */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
                <div className="text-left font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-6">
                    Donor Achievements
                  </h3>

                  <div className="flex flex-col gap-4 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-sm shrink-0">
                          🏆
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-800">Life Saver Gold</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            20+ lifetime donations reached
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 fill-emerald-50" />
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                          ⏱️
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-800">Perfect Consistency</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            Donated 4 times in 1 year
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        75%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200/50 shadow-sm shrink-0">
                          🤝
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-800">Network Builder</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            Referred 5 new donors
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 shrink-0">
                        <Lock className="h-3 w-3" />
                        Locked
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full pt-4 mt-6 border-t border-slate-100 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-center font-sans font-sans">
                  Show All Badges
                </button>
              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            VIEW B: DONOR PROFILE DASHBOARD
            ======================================================== */}
        {activeNav === "Profile" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 animate-in fade-in duration-300">
            
            {/* Top Profile Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col gap-6 text-left font-sans">
              <div className="absolute inset-0 rounded-3xl bg-radial from-red-600/[0.01] to-transparent pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative h-24 w-24 shrink-0 rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center font-outfit text-3xl font-extrabold text-slate-700 overflow-hidden">
                    {userImage ? <img src={userImage} alt={userName} className="h-full w-full object-cover" /> : userInitials}
                    <span className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white animate-pulse" />
                  </div>
                  
                  <div className="flex flex-col text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {userName}
                      </h1>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white text-xs font-black font-outfit shadow-sm shadow-red-600/30 shrink-0 self-center sm:self-auto">
                        {userBloodType}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans max-w-xl mb-4">
                      Dedicated life-saver since 2018. Passionate about community health and rapid emergency response.
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                        <CheckCircle className="h-3 w-3 fill-emerald-50" />
                        Available for Emergency
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-200/50 px-2.5 py-1 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <MapPin className="h-3 w-3" />
                        {userLocation}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer font-sans self-center md:self-start">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-100 pt-6 mt-2 text-left font-sans">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Last Donation</span>
                  <span className="font-outfit text-lg sm:text-xl font-extrabold text-red-600 mt-1">Feb 14, 2024</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-6">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Total Impact</span>
                  <span className="font-outfit text-lg sm:text-xl font-extrabold text-indigo-600 mt-1">36 Lives Saved</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-6">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Donation Tier</span>
                  <span className="font-outfit text-lg sm:text-xl font-extrabold text-slate-800 mt-1">Platinum</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-6">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Next Eligibility</span>
                  <span className="font-outfit text-lg sm:text-xl font-extrabold text-emerald-600 mt-1">Apr 10, 2024</span>
                </div>
              </div>
            </div>

            {/* Profile Grid content (3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 items-start text-left">
              
              {/* COLUMN 1 */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
                {/* Health Profile */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    Health Profile
                  </h3>

                  <div className="flex flex-col gap-3.5 font-sans text-xs font-semibold text-slate-500">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                      <span>Age</span>
                      <span className="text-slate-800 font-extrabold font-mono">32 Years</span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                      <span>Weight</span>
                      <span className="text-slate-800 font-extrabold font-mono">78 kg</span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                      <span>Pulse (Resting)</span>
                      <span className="text-slate-800 font-extrabold font-mono">64 bpm</span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                      <span>Blood Pressure</span>
                      <span className="text-slate-800 font-extrabold font-mono">118/76 mmHg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hemoglobin</span>
                      <span className="text-red-600 font-extrabold font-mono">15.4 g/dL</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    Emergency Contact
                  </h3>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col text-left font-sans gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-800 font-sans">Elena Thompson</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Spouse</span>
                    </div>
                    <a href="tel:+15552345678" className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors font-mono">
                      <Phone className="h-3 w-3 fill-red-100" />
                      +1 (555) 234-5678
                    </a>
                  </div>
                </div>

                {/* AI Health Insight */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <BrainCircuit className="h-4 w-4" />
                    </div>
                    AI Health Insight
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium mb-5">
                    Based on your recovery rate and recent pulse data, your ideal donation interval is <strong className="text-slate-800">54 days</strong>. You are maintaining peak nutritional balance for your O- profile.
                  </p>

                  <div className="flex flex-col gap-1.5 font-sans">
                    <div className="flex justify-between text-[10px] font-extrabold">
                      <span className="text-slate-400 uppercase tracking-wider font-mono">Readiness Score</span>
                      <span className="text-red-600 font-mono">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
                {/* Donation Timeline */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    Donation Timeline
                  </h3>

                  <div className="relative border-l-2 border-slate-100 pl-6 ml-3 flex flex-col gap-6 font-sans">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-red-600 border-4 border-white shadow-sm flex items-center justify-center" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-extrabold text-slate-800">Whole Blood Donation</span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Feb 14, 2024 • Seattle Central Hospital</span>
                        <div className="flex gap-1.5 mt-2">
                          <span className="bg-slate-100 text-slate-500 font-extrabold text-[8px] px-1.5 py-0.5 rounded tracking-wide">ID: #WB-9281</span>
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 font-extrabold text-[8px] px-1.5 py-0.5 rounded tracking-wide">SUCCESSFUL</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-slate-300 border-4 border-white shadow-sm flex items-center justify-center" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-700">Plasma Donation</span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Nov 22, 2023 • Northside Medical Center</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-slate-300 border-4 border-white shadow-sm flex items-center justify-center" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-700">Whole Blood Donation</span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Aug 15, 2023 • Community Blood Drive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-5 font-sans">
                    <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <Award className="h-4 w-4" />
                      </div>
                      Achievements
                    </h3>
                    <a href="#badges" className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors font-sans">
                      View All
                    </a>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5 font-sans">
                    {[
                      { icon: "⭐", label: "Top 1% Donor" },
                      { icon: "❤️", label: "Life Saver x10" },
                      { icon: "⚡", label: "Fast Responder" },
                      { icon: "🩸", label: "Gold Pumping" },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 text-center"
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-[8px] font-extrabold text-slate-500 leading-tight">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Travel Radius */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-4 font-sans">
                    <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <Compass className="h-4.5 w-4.5" />
                      </div>
                      Emergency Travel Radius
                    </h3>
                    <span className="text-xs font-extrabold text-slate-800">
                      {travelRadius} miles
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={travelRadius}
                    onChange={(e) => setTravelRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600 mb-5"
                  />

                  <div className="relative w-full aspect-[2/1] rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                      <defs>
                        <pattern id="travelGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                          <rect width="8" height="8" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#travelGrid)" />
                      <circle cx="100" cy="50" r="35" fill="rgba(239, 68, 68, 0.05)" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" strokeDasharray="3 1.5" />
                      <circle cx="100" cy="50" r="20" fill="rgba(239, 68, 68, 0.05)" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" />
                      <circle cx="100" cy="50" r="3.5" fill="#ef4444" />
                      <circle cx="100" cy="50" r="6" fill="rgba(239, 68, 68, 0.15)" className="animate-ping" />
                    </svg>
                    
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-lg p-2.5 border border-slate-100 flex items-center justify-between text-left font-sans text-[9px] shadow-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-slate-800">Home: Capitol Hill, Seattle</span>
                        <span className="text-slate-400 font-semibold">Active Radius: 15-min Response</span>
                      </div>
                      <MapPin className="h-4 w-4 text-red-600 fill-red-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="lg:col-span-3 flex flex-col gap-6 sm:gap-8">
                {/* Reliability */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-center flex flex-col items-center">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-6 flex items-center gap-2 self-start text-left">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    Reliability
                  </h3>

                  <div className="relative h-28 w-28 flex items-center justify-center mb-4">
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-outfit text-2xl font-black text-slate-900">
                      98%
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-500 font-sans">
                    Exceptional Reliability
                  </span>
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    Milestones
                  </h3>

                  <div className="flex flex-col gap-3 font-sans text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        📅
                      </div>
                      <div className="flex flex-col text-left font-sans">
                        <span className="font-extrabold text-slate-800">First Donation</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">June 2018</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                      <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        📅
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-slate-800">30th Donation</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Dec 2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferred Centers */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <Map className="h-4.5 w-4.5" />
                    </div>
                    Preferred Centers
                  </h3>

                  <div className="w-full aspect-[2/1.2] rounded-xl border border-slate-100 bg-slate-50 relative overflow-hidden flex items-center justify-center mb-3">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                      <defs>
                        <pattern id="prefGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <rect width="10" height="10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#prefGrid)" />
                      <path d="M 0,30 L 200,30 M 70,0 L 70,100 M 130,0 L 130,100" stroke="#cbd5e1" strokeWidth="2" />
                      <path d="M 0,30 Q 70,80 200,80" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                      <circle cx="130" cy="30" r="5" fill="rgba(239, 68, 68, 0.2)" />
                      <circle cx="130" cy="30" r="2.5" fill="#ef4444" />
                    </svg>
                  </div>

                  <div className="text-left font-sans text-xs">
                    <span className="font-extrabold text-slate-800">Seattle Central Hospital</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">Primary Location</span>
                  </div>
                </div>
              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            VIEW C: PRIVACY & SECURITY SETTINGS
            ======================================================== */}
        {activeNav === "Settings" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 sm:gap-8 text-left animate-in fade-in duration-300 font-sans">
            
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Privacy &amp; Security
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1">
                Manage how your medical data is shared and protect your account with advanced security controls.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left font-sans">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-900">Your Account is Secure</span>
                  <span className="text-xs text-slate-400 font-semibold mt-0.5">
                    AI-enhanced monitoring detected no unusual activity in the last 30 days.
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 text-[9px] font-extrabold text-emerald-600 tracking-wider uppercase shrink-0 font-sans font-sans">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Protection Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start font-sans">
              
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6">
                <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Authentication Control
                </h3>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col text-left max-w-[70%]">
                      <span className="font-bold text-slate-800">Multi-Factor Authentication (MFA)</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed font-sans">
                        Required for all login attempts
                      </span>
                    </div>
                    <button
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                        mfaEnabled ? "bg-red-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          mfaEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col text-left max-w-[70%]">
                      <span className="font-bold text-slate-800">Biometric Login</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed font-sans">
                        Use FaceID or Fingerprint on mobile
                      </span>
                    </div>
                    <button
                      onClick={() => setBiometricEnabled(!biometricEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                        biometricEnabled ? "bg-red-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          biometricEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl font-sans">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-slate-800">Last Password Change</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Changed 4 months ago
                      </span>
                    </div>
                    <button className="rounded-lg border border-slate-200 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-white transition-colors cursor-pointer font-sans">
                      Update
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6 h-full justify-between font-sans">
                <div>
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2 mb-6">
                    <Activity className="h-5 w-5 text-red-600" />
                    Active Sessions
                  </h3>

                  <div className="flex flex-col gap-4 font-sans text-xs">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                            session.isCurrent ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200/50"
                          }`}>
                            {session.type === "laptop" ? <Laptop className="h-4.5 w-4.5" /> : <Smartphone className="h-4.5 w-4.5" />}
                          </div>
                          
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-800 font-sans">{session.device}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 font-sans">
                              {session.location} • <span className={session.isCurrent ? "text-emerald-600 font-bold" : ""}>{session.time}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={handleLogoutAllOther}
                    className="w-full inline-flex items-center justify-center rounded-xl border border-red-200 hover:bg-red-50/50 text-red-600 py-3 text-xs font-bold transition-all cursor-pointer mt-6 font-sans"
                  >
                    Log Out All Other Devices
                  </button>
                )}
              </div>

            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative font-sans">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 font-sans">
                <div className="text-left font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-1">
                    Medical Data Sharing
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold font-sans">
                    Control which institutions can access your blood type and donation history in emergencies.
                  </p>
                </div>
                
                <button
                  onClick={handleSavePreferences}
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all cursor-pointer font-sans shrink-0 self-start sm:self-auto hover:-translate-y-0.5"
                >
                  Save Preferences
                </button>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-2">Institution Name</th>
                      <th className="py-3 px-2">Permissions</th>
                      <th className="py-3 px-2">Last Accessed</th>
                      <th className="py-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sharingCenters.map((center) => (
                      <tr key={center.id} className="text-xs font-bold text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-2 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-50 text-slate-400 border border-slate-200/50">
                            {center.name.includes("Lab") ? <Sparkles className="h-3.5 w-3.5" /> : center.name.includes("Bank") ? <Heart className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                          </div>
                          <span className="text-slate-800 font-extrabold">{center.name}</span>
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex gap-1.5 flex-wrap font-sans">
                            {center.permissions.map(perm => (
                              <span
                                key={perm}
                                className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border ${
                                  perm.includes("Full")
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : perm.includes("Anonymized")
                                    ? "bg-slate-100 text-slate-500 border-slate-200/50"
                                    : "bg-red-50 text-red-600 border-red-100"
                                }`}
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-2 text-slate-400 font-semibold font-mono">
                          {center.lastAccessed}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className={`absolute bottom-6 right-6 glass-panel rounded-2xl p-4 shadow-xl border border-emerald-100 bg-white/95 flex items-center gap-3 transition-all duration-300 z-30 ${
                  showToast ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Check className="h-4.5 w-4.5 stroke-[3px]" />
                </div>
                <div className="flex flex-col text-left font-sans">
                  <span className="text-xs font-bold text-slate-800">Settings Saved</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Your privacy preferences are updated.</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50/50 via-white to-red-50/50 rounded-2xl border border-red-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full bg-radial from-red-600/[0.03] to-transparent pointer-events-none" />
              
              <div className="flex-1 text-left font-sans">
                <h3 className="font-outfit text-lg font-extrabold text-red-600 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 fill-red-100 text-red-600" />
                  AI Privacy Shield
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mb-6">
                  Our AI system continuously monitors and scrubs PII (Personally Identifiable Information) before any data is sent for regional logistics analysis. You can opt-in to "Premium Anonymization" which uses differential privacy to protect your identity even from specific hospital administrators.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 font-sans">
                  <button
                    onClick={() => setPremiumAnonymization(!premiumAnonymization)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-xs font-bold transition-all cursor-pointer hover:-translate-y-0.5 ${
                      premiumAnonymization
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
                        : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    {premiumAnonymization ? "Premium Anonymization Enabled" : "Enable Premium Anonymization"}
                  </button>
                  <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 py-3 px-5 text-xs font-bold text-slate-700 transition-all cursor-pointer">
                    Learn More
                  </button>
                </div>
              </div>

              <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
                <div className="absolute h-28 w-28 rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: "3s" }} />
                <div className="absolute h-20 w-20 rounded-full border border-red-500/20 animate-pulse" />
                <div className="absolute h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shadow-md">
                  <Shield className="h-5.5 w-5.5 text-red-600 fill-red-200" />
                </div>
              </div>
            </div>

          </main>
        )}

        {/* ========================================================
            VIEW D: SUPPLY & PROCUREMENT LEDGER (LOGISTICS)
            ======================================================== */}
        {activeNav === "Supply Logistics" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 text-left animate-in fade-in duration-300">
            
            {/* Page Title & Subtitle Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
              <div>
                <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Supply &amp; Procurement Ledger
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1">
                  Fiscal Quarter Q3 2024 • Regional Network Alpha
                </p>
              </div>

              {/* Top Right Action Buttons */}
              <div className="flex gap-3 shrink-0 self-start sm:self-auto">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer font-sans">
                  <Download className="h-3.5 w-3.5" />
                  Export Report
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/10 transition-all cursor-pointer hover:-translate-y-0.5 font-sans">
                  New Contract
                </button>
              </div>
            </div>

            {/* Row 1: Four Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              
              {/* Card 1 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Contract Value
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900">$2.48M</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    4.2%
                  </span>
                </div>
                <div className="w-full h-1 bg-emerald-500/10 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-50 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Procurement
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900">142 Units</span>
                  <span className="text-[9px] font-extrabold text-red-600 animate-pulse bg-red-50 px-1 py-0.5 rounded font-mono">
                    ! Critical
                  </span>
                </div>
                <div className="w-full h-1 bg-red-500/10 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-red-50 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Vendor Compliance
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900">98.2%</span>
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-sans">
                    ✓ Stable
                  </span>
                </div>
                <div className="w-full h-1 bg-emerald-500/10 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-50 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Savings Forecast
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900">$14.2k</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-sans">per month</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

            </div>

            {/* Row 2: Contracts table & AI insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Contracts Table */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 font-sans font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900">
                    Active Supplier Contracts
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
                      <Compass className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-2">Vendor</th>
                        <th className="py-3 px-2">Agreement Type</th>
                        <th className="py-3 px-2">Monthly Vol.</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Utilization</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {contracts.map((con) => (
                        <tr key={con.id} className="text-xs font-bold text-slate-700 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-2 flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-full ${con.logoBg} flex items-center justify-center font-extrabold text-[10px]`}>
                              {con.logoInitials}
                            </div>
                            <span className="text-slate-800 font-extrabold">{con.vendor}</span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-505 font-sans">
                            {con.agreement} • <span className="text-[10px] font-bold text-slate-400">{con.duration}</span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-600 font-extrabold font-mono">
                            {con.volume}
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border ${
                              con.status === "active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : con.status === "renewal"
                                ? "bg-slate-100 text-slate-500 border-slate-200/50"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              {con.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right text-slate-800 font-extrabold font-mono">
                            {con.compliance}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: AI Insights & Ratings */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
                
                {/* AI Insights Alert */}
                <div className="bg-white rounded-2xl border border-red-200/50 p-5 shadow-sm text-left relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-red-600" />
                  
                  <h4 className="font-outfit text-xs font-black tracking-wider text-red-600 uppercase flex items-center gap-1.5 mb-3 font-sans">
                    <Sparkles className="h-4 w-4" />
                    AI Procurement Insights
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-semibold mb-5 font-sans">
                    {mixAdjusted 
                      ? "Procurement parameters updated. Delivery vectors recalculated to favor BioMatriX O+ reserves."
                      : "VitalAlpha Logistics has exceeded delivery windows by 12% this week. We recommend reallocating 150 units of O+ supply to BioMatriX to mitigate weekend stockout risks."}
                  </p>

                  <button
                    onClick={() => setMixAdjusted(!mixAdjusted)}
                    className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer font-sans hover:-translate-y-0.5 ${
                      mixAdjusted
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200/50 hover:bg-red-100/50"
                    }`}
                  >
                    {mixAdjusted ? "✓ Mix Adjusted Successfully" : "Adjust Procurement Mix"}
                  </button>
                </div>

                {/* Ratings */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h4 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 font-sans">
                    Vendor Performance Ratings
                  </h4>
                  
                  <div className="flex flex-col gap-4 font-sans">
                    {[
                      { name: "BioMatriX Solutions", rating: "4.8" },
                      { name: "VitalAlpha Logistics", rating: "3.2" },
                      { name: "GenoLife Dist.", rating: "4.9" },
                    ].map((item) => (
                      <div key={item.name} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-800">{item.name}</span>
                          <div className="flex gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="font-outfit text-lg font-extrabold text-slate-800">
                          {item.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Row 3: Budget and Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Budget Trend */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 font-sans">
                  <div className="text-left font-sans">
                    <h3 className="font-outfit text-base font-extrabold text-slate-900 font-sans">
                      Procurement Budget Trend
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Quarterly spend against baseline projections
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 cursor-pointer font-sans">
                    Last 6 Months
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="w-full aspect-[2/1] min-h-[160px] flex items-end justify-between px-2 sm:px-6 relative font-mono text-[9px] font-bold text-slate-400 mt-2">
                  <div className="absolute inset-x-0 top-0 border-t border-slate-50" />
                  <div className="absolute inset-x-0 top-1/3 border-t border-slate-50" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-slate-50" />
                  <div className="absolute inset-x-0 bottom-6 border-t border-slate-100" />
                  
                  {[
                    { month: "JAN", height: "h-[35%]", active: false },
                    { month: "FEB", height: "h-[48%]", active: false },
                    { month: "MAR", height: "h-[30%]", active: false },
                    { month: "APR", height: "h-[62%]", active: false },
                    { month: "MAY", height: "h-[75%]", active: false },
                    { month: "JUN", height: "h-[90%]", active: true, label: "$412k" },
                  ].map((bar) => (
                    <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end z-10 w-8">
                      {bar.label && (
                        <span className="text-[9px] font-bold text-red-600 mb-1 font-mono">{bar.label}</span>
                      )}
                      <div
                        className={`w-4 sm:w-6 rounded-t-md transition-all duration-500 ease-out cursor-pointer hover:opacity-90 ${
                          bar.height
                        } ${
                          bar.active
                            ? "bg-red-600 shadow-md shadow-red-600/20"
                            : "bg-red-200/55 hover:bg-red-300/60"
                        }`}
                      />
                      <span className={`text-[10px] font-sans ${bar.active ? "text-red-600 font-extrabold" : ""}`}>
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Map Visual */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm text-left flex flex-col gap-5 justify-between h-full font-sans">
                
                <div>
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-1">
                    Logistics Visualization
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mb-4">
                    Supply chain network density and route efficiency
                  </p>

                  <div className="relative w-full aspect-[2/1.1] rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner mb-4">
                    <svg className="absolute inset-0 w-full h-full bg-slate-950" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="45" fill="none" stroke="rgba(239, 68, 68, 0.03)" strokeWidth="1" />
                      <circle cx="100" cy="50" r="30" fill="none" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="1" />
                      <path d="M 40,20 Q 100,50 160,80" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
                      <path d="M 50,75 Q 100,50 150,25" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.5" />
                      <path d="M 100,10 Q 100,50 100,90" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
                      <circle cx="40" cy="20" r="2.5" fill="#ef4444" />
                      <circle cx="160" cy="80" r="2.5" fill="#ef4444" />
                      <circle cx="50" cy="75" r="2" fill="#ef4444" />
                      <circle cx="150" cy="25" r="2" fill="#ef4444" />
                      <circle cx="100" cy="50" r="4" fill="#ef4444" className="animate-pulse" />
                    </svg>

                    <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 border border-slate-800 flex items-center justify-between text-left font-sans text-[9px] text-white">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7px] text-slate-400 uppercase tracking-widest font-extrabold font-mono">Active Corridors</span>
                        <span className="text-xs font-black">24 Regional Hubs</span>
                      </div>
                      <Globe className="h-4.5 w-4.5 text-red-500 fill-red-950/40" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left font-sans text-xs">
                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/30">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Cold Chain Integrity</span>
                    <span className="text-xs font-black text-indigo-600 block mt-1 font-mono">99.9% Optimal</span>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/30">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Average Transit</span>
                    <span className="text-xs font-black text-slate-800 block mt-1 font-outfit font-mono">42.4 Minutes</span>
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            VIEW E: DONOR NETWORK DIRECTORY
            ======================================================== */}
        {activeNav === "Donor Network" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 text-left animate-in fade-in duration-300 font-sans">
            
            {/* Heading */}
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Donor Network Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1 font-sans">
                Connect with regional donors, search by blood types, compatibility, or dispatch radius.
              </p>
            </div>

            {/* KPI metrics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Donors</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">14,820</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5 font-mono">
                    ▲ 12.4%
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Emergency Standby</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">348 Donors</span>
                  <span className="text-[9px] font-extrabold text-red-600 bg-red-50 px-1 py-0.5 rounded font-mono">Alert</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Avg Response Time</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">18.4 mins</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 font-mono">Optimal</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Lives Connected</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-indigo-600 font-mono">84.2k Saved</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Searchable Directory Listing */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                  <h3 className="font-outfit text-base font-extrabold text-slate-900">
                    Verified Network Donors
                  </h3>
                  
                  {/* Blood Type Filter selectors */}
                  <div className="flex flex-wrap gap-1">
                    {["All", "O-", "O+", "A-", "A+", "B-", "AB-"].map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedBloodType(type)}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer uppercase ${
                          selectedBloodType === type
                            ? "bg-red-600 border-red-600 text-white font-black"
                            : "border-slate-200 hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Donor Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredDonors.map((donor) => (
                    <div
                      key={donor.id}
                      className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-red-200 transition-all flex flex-col justify-between gap-4 text-left relative"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-outfit font-black text-xs text-slate-600">
                            {donor.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-800">{donor.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {donor.location}
                            </span>
                          </div>
                        </div>

                        <span className="h-6 w-6 rounded-full bg-red-600 text-white text-[10px] font-black font-outfit flex items-center justify-center shadow-sm">
                          {donor.bloodType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100/70 pt-3 text-[10px] font-semibold text-slate-500">
                        <span>Lives Saved: <strong className="text-slate-800 font-mono">{donor.livesSaved}</strong></span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          donor.status === "Available"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : donor.status === "Standby"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}>
                          {donor.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredDonors.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-slate-400 font-medium text-xs">
                      No donors found matching criteria.
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Locator Map & Compatibility Matrix */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
                
                {/* Standby locator radar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Compass className="h-4 w-4 text-red-600" />
                    Network Standby Map
                  </h3>

                  <div className="relative w-full aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="25" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 1" />
                      <line x1="50" y1="10" x2="50" y2="90" stroke="#cbd5e1" strokeWidth="0.5" />
                      <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="0.5" />
                      {/* Pulsing coordinates */}
                      <circle cx="45" cy="30" r="2.5" fill="#10b981" />
                      <circle cx="45" cy="30" r="5" fill="rgba(16, 185, 129, 0.2)" className="animate-ping" />
                      <circle cx="65" cy="65" r="2.5" fill="#f59e0b" />
                      <circle cx="30" cy="70" r="2.5" fill="#10b981" />
                    </svg>
                  </div>
                </div>

                {/* Compatibility Reference Matrix */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-600 fill-red-100" />
                    Blood Matching Matrix
                  </h3>

                  <div className="flex flex-col gap-2.5 font-sans text-[10px] font-semibold text-slate-500">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50 text-slate-800 font-extrabold">
                      <span>Donor Type</span>
                      <span>Can Give To</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50 bg-red-50/50 p-1 rounded">
                      <span className="font-black text-red-600">O- (Sarah/Marcus)</span>
                      <span className="font-bold text-slate-800">ALL Blood Types (Universal)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <span className="font-bold">O+</span>
                      <span>O+, A+, B+, AB+</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <span className="font-bold">A-</span>
                      <span>A-, A+, AB-, AB+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">AB+</span>
                      <span>AB+ Only (Universal Recipient)</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            VIEW F: EMERGENCY AI HUB & DISPATCH
            ======================================================== */}
        {activeNav === "Emergency Hub" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 text-left animate-in fade-in duration-300 font-sans">
            
            {/* Title */}
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Emergency Dispatch &amp; AI Routing
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1 font-sans">
                Active critical trauma demands, live match coordination, and dispatch protocols.
              </p>
            </div>

            {/* KPI indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Emergency Tickets</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">3 Critical</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Transits</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">12 Deliveries</span>
                  <span className="text-[10px] text-emerald-600 font-mono">En Route</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Route Optimization</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">94.8%</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Efficient</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Dispatch Coordinators</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-indigo-600 font-mono">8 Online</span>
                </div>
              </div>
            </div>

            {/* Content layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Incidents tickets list */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-5">
                <h3 className="font-outfit text-base font-extrabold text-slate-900">
                  Active Emergency Incidents
                </h3>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  {/* Ticket 1 */}
                  <div className="border border-red-200/60 rounded-xl p-4 bg-red-50/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-red-600" />
                    
                    <div className="flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">Central General Hospital</span>
                        <span className="bg-red-100 text-red-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">Level 1 Trauma</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 font-sans">
                        <MapPin className="h-3 w-3" />
                        O- Whole Blood (2 Units) • 12 mins ago
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenRequest("O-", "Central General Hospital")}
                      className="rounded-lg bg-red-600 hover:bg-red-700 px-3.5 py-2 text-[10px] font-bold text-white shadow-md shadow-red-600/10 transition-colors cursor-pointer font-sans"
                    >
                      Initiate Dispatch
                    </button>
                  </div>

                  {/* Ticket 2 */}
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />
                    
                    <div className="flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">Children's Mercy Hospital</span>
                        <span className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">Pediatric Urgent</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 font-sans">
                        <MapPin className="h-3 w-3" />
                        A- Platelets (3 Units) • 24 mins ago
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenRequest("A-", "Children's Mercy Hospital")}
                      className="rounded-lg border border-red-600 hover:bg-red-50 text-red-600 px-3.5 py-2 text-[10px] font-bold transition-colors cursor-pointer font-sans"
                    >
                      Initiate Dispatch
                    </button>
                  </div>

                  {/* Ticket 3 */}
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left relative opacity-85">
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500" />
                    
                    <div className="flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">Northwest Medical Center</span>
                        <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">In Transit</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 font-sans font-sans">
                        <MapPin className="h-3 w-3" />
                        O- Red Cells (4 Units) • Courier TR-8812
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 font-sans">
                      Active tracking
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Live radar visual & Rolling logs */}
              <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
                
                {/* Live Radar visual mapping */}
                <div className="bg-slate-950 rounded-2xl border border-slate-900 p-5 shadow-sm text-left relative overflow-hidden">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-red-600 animate-spin" />
                    Live Emergency Radar
                  </h3>

                  <div className="relative w-full aspect-[2/1.1] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                      {/* Grid background lines */}
                      <path d="M 0,50 L 200,50 M 100,0 L 100,100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      <circle cx="100" cy="50" r="30" fill="none" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="1" />
                      
                      {/* Sweeping line */}
                      <line x1="100" y1="50" x2="180" y2="20" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" className="origin-[100px_50px] animate-spin" style={{ animationDuration: "6s" }} />
                      
                      {/* Pulse hospital markers */}
                      <circle cx="130" cy="30" r="3.5" fill="#ef4444" />
                      <circle cx="130" cy="30" r="7" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="0.5" className="animate-ping" />
                      
                      <circle cx="60" cy="70" r="2.5" fill="#ef4444" />
                    </svg>

                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 rounded-lg p-2 border border-slate-800 flex items-center justify-between text-left font-mono text-[9px] text-white">
                      <span>Coordinates: 47.6062° N, 122.3321° W</span>
                      <span className="text-red-500 font-bold uppercase animate-pulse">● Scanning</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch logs */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    AI Dispatch Ledger Logs
                  </h3>

                  <div className="flex flex-col gap-2.5 font-mono text-[9px] font-bold text-slate-500 max-h-[160px] overflow-y-auto">
                    {rollingLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 border-b border-slate-50 pb-2 last:border-0">
                        <span className="text-red-600 shrink-0 font-sans font-bold">[LEDGER]</span>
                        <span className="text-left font-medium leading-relaxed font-sans">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            VIEW G: AI INSIGHTS & NEURAL LEDGERS
            ======================================================== */}
        {activeNav === "AI Insights" && (
          <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 text-left animate-in fade-in duration-300 font-sans">
            
            {/* Title */}
            <div className="font-sans">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Diagnostics &amp; Insights
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-1 font-sans">
                Predictive models, network supply projections, and automated donor recruitment recommendations.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Model Accuracy</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">99.4%</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 font-mono">Optimal</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Forecast Horizon</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">14 Days</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-sans">Projections</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">PII Data Scrubbed</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-indigo-600 font-mono">3,248 Strings</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Models</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-outfit text-2xl font-extrabold text-slate-900 font-mono">12 Networks</span>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-6">
                
                {/* Supply Stock Projections SVG */}
                <div>
                  <h3 className="font-outfit text-base font-extrabold text-slate-900 mb-4 text-left">
                    Predictive Stock Forecast (Next 7 Days)
                  </h3>

                  <div className="w-full aspect-[2/1] min-h-[160px] relative bg-slate-50 rounded-xl border border-slate-100 flex items-end justify-between px-6 pt-10 font-mono text-[9px] font-bold text-slate-400">
                    <svg className="absolute inset-0 w-full h-full px-6 pt-10" viewBox="0 0 200 100" preserveAspectRatio="none">
                      {/* O- Supply Dip curve path representation */}
                      <path d="M 0,30 Q 50,85 100,90 T 200,45" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 1.5" />
                      {/* Safe boundary line */}
                      <line x1="0" y1="50" x2="200" y2="50" stroke="#10b981" strokeWidth="0.75" opacity="0.4" />
                    </svg>
                    
                    <span className="z-10">DAY 1</span>
                    <span className="z-10 text-red-600 font-black animate-pulse font-sans">DAY 4 (Dip)</span>
                    <span className="z-10">DAY 7</span>

                    {/* Floating warning bubble */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 bg-red-600 text-white rounded-lg p-2 flex items-center justify-between text-[9px] font-sans shadow-md">
                      <span>Projections indicate a critical O- stock level dip on Day 4.</span>
                      <button className="bg-white text-red-600 font-extrabold px-2 py-0.5 rounded uppercase font-sans">Resolve</button>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="text-left font-sans">
                  <h4 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    Automated Campaigns Recommendations
                  </h4>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-800">Seattle Standby Alert</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Contact O- standby list via sms/app channels</span>
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1.5 rounded-lg transition-colors font-sans shrink-0 cursor-pointer">
                        Trigger
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
                
                {/* Neural Networks log ledger */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
                  <h3 className="font-outfit text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-red-600" />
                    Neural Net Diagnostic Logs
                  </h3>

                  <div className="flex flex-col gap-2.5 font-mono text-[9px] font-bold text-slate-500 max-h-[220px] overflow-y-auto">
                    {aiLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 border-b border-slate-50 pb-2 last:border-0">
                        <span className="text-indigo-600 shrink-0 font-sans font-bold">[NEURAL]</span>
                        <span className="text-left font-medium leading-relaxed font-sans">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* ========================================================
            VIEW H: DONOR LOGISTICS MAP PANEL (FLOATING PLUS BUTTON STIMULATE)
            ======================================================== */}
        <button
          onClick={() => handleOpenRequest()}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50 hover:scale-105"
          title="Create New Request"
        >
          <Plus className="h-6 w-6 stroke-[3px]" />
        </button>

      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultBloodType={prefillBlood}
        defaultHospital={prefillHospital}
        onSuccess={() => {}}
      />
    </div>
  );
}
