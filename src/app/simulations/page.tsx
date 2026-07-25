"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sectionApi } from "@/lib/backend-api";
import {
  Menu,
  X,
  LayoutDashboard,
  BrainCircuit,
  Settings,
  LogOut,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  TrendingDown,
  Activity,
  Heart,
  ArrowRight
} from "lucide-react";

type ScenarioId = "surge" | "storm" | "holiday";

interface Scenario {
  id: ScenarioId;
  name: string;
  description: string;
  intensity: string;
  effect: string;
}

export default function SimulationsCenter() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("surge");
  const [selectedBloodType, setSelectedBloodType] = useState("O-");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: "surge",
      name: "Trauma Surge (Mass Casualty)",
      description: "A major multi-vehicle collision on Interstate 5 triggers emergency surges.",
      intensity: "CRITICAL (+85% Demand)",
      effect: "Rapid depletion of O- and O+ stocks within 24 hours."
    },
    {
      id: "storm",
      name: "Severe Winter Storm",
      description: "Freezing conditions block supply routes and cancel regional donor camps.",
      intensity: "SEVERE (-40% Supply)",
      effect: "Anticipated stockouts across all negative blood types by Day 4."
    },
    {
      id: "holiday",
      name: "Holiday Long-Weekend",
      description: "Low donor attendance coupled with highway travel accident spikes.",
      intensity: "MODERATE (+25% Demand)",
      effect: "Slow downward decline in general stocks over a 7-day period."
    }
  ];

  const handleStartSimulation = () => {
    void sectionApi.simulation({ scenario: selectedScenario, blood_type: selectedBloodType }).catch(() => undefined);
    setIsSimulating(true);
    setSimulationProgress(0);
    setIsAuthorized(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsSimulating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  // Dynamic SVG path calculator based on scenario and blood type
  const getCurvePath = () => {
    if (selectedScenario === "surge") {
      // Dips down instantly
      return "M 10,20 Q 50,90 100,105 T 290,110";
    } else if (selectedScenario === "storm") {
      // Dips down in the middle
      return "M 10,20 Q 100,30 150,75 T 290,108";
    } else {
      // Gradual decline
      return "M 10,20 Q 120,45 200,65 T 290,85";
    }
  };

  const getDepletionDay = () => {
    if (selectedScenario === "surge") return "1.2 Days";
    if (selectedScenario === "storm") return "4.5 Days";
    return "8.2 Days";
  };

  const getReallocationDetails = () => {
    if (selectedScenario === "surge") {
      return { units: 14, source: "Tacoma Donor Bank", dest: "Seattle Central Hospital" };
    }
    if (selectedScenario === "storm") {
      return { units: 8, source: "Bellevue Clinic Node", dest: "Seattle Central Hospital" };
    }
    return { units: 5, source: "Regional Reserve Hub", dest: "Seattle Central Hospital" };
  };

  const handleAuthorizeRedistribution = () => {
    setIsAuthorized(true);
    // Log to local storage
    const newLog = {
      id: `sim-log-${Date.now()}`,
      title: "AI Reallocation Authorized",
      description: `Dispatched redistribution contract for ${getReallocationDetails().units} units of ${selectedBloodType} from ${getReallocationDetails().source}.`,
      time: new Date().toLocaleTimeString()
    };
    const currentLogs = JSON.parse(localStorage.getItem("hospitalLogs") || "[]");
    localStorage.setItem("hospitalLogs", JSON.stringify([newLog, ...currentLogs]));
  };

  const activeScenarioDetails = scenarios.find(s => s.id === selectedScenario)!;

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

          {/* Identity Tag */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-sm shrink-0">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 font-sans">AI Forecaster</span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5 font-sans leading-none">
                Prediction Suite Console
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {[
                { id: "simulations", label: "Predictive Sandbox", icon: <LayoutDashboard className="h-4.5 w-4.5" /> }
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

        {/* Footer actions */}
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

      {/* Main Workspace */}
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
              Predictive Allocation Simulator
            </h1>
          </div>
        </header>

        {/* Console Container */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
          
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Stress-Test Regional Supply Grids
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Select an emergency scenario and test response models to balance regional reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Left Column: Select Scenario & Graph (~60%) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Scenario cards switcher */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 text-left">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">1. Select Emergency Scenario</span>
                <div className="flex flex-col gap-2.5">
                  {scenarios.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenario(sc.id);
                        setIsAuthorized(false);
                      }}
                      className={`w-full p-4 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        selectedScenario === sc.id
                          ? "bg-slate-950 border-red-500/50 text-white"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs">{sc.name}</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded leading-none ${
                          sc.id === "surge" ? "bg-red-500/10 text-red-500" : sc.id === "storm" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                        }`}>{sc.intensity}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">{sc.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Depletion Curve Graph */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">2. 14-Day Stock Depletion Model</span>
                  
                  {/* Select Blood group */}
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-bold text-white focus:outline-none"
                  >
                    {["O-", "O+", "A-", "A+", "B-", "AB-"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full aspect-[2.4/1] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-3">
                  {isSimulating ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${simulationProgress}%` }} />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">Computing AI Math projections...</span>
                    </div>
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 300 120">
                      {/* Grid lines */}
                      <path d="M 0,30 L 300,30 M 0,60 L 300,60 M 0,90 L 300,90" stroke="#1e293b" strokeWidth="0.5" />
                      
                      {/* Critical line */}
                      <line x1="0" y1="90" x2="300" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                      
                      {/* Prediction path curve */}
                      <path d={getCurvePath()} fill="none" stroke="#ef4444" strokeWidth="2.5" className="transition-all duration-300" />
                      
                      {/* Indicator markers */}
                      <text x="15" y="112" className="text-[7px] font-bold fill-slate-500">Day 1</text>
                      <text x="145" y="112" className="text-[7px] font-bold fill-slate-500 font-sans">Day 7</text>
                      <text x="275" y="112" className="text-[7px] font-bold fill-slate-500 font-sans">Day 14</text>
                      <text x="280" y="85" className="text-[6px] font-bold fill-red-500 font-mono">DEPLETION LINE</text>
                    </svg>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[9px] text-slate-500 block uppercase">Projected Depletion</span>
                    <span className="text-white font-bold text-sm font-mono">{getDepletionDay()}</span>
                  </div>
                  <button
                    onClick={handleStartSimulation}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Re-Run Model
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: AI Action allocations (~40%) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Allocation recommendation card */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-md flex flex-col justify-between gap-5 text-left">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">AI Reallocation Engine</span>
                  <h3 className="font-outfit text-base font-extrabold text-white mt-0.5">Balancing Actions Suggested</h3>
                </div>

                <div className="flex flex-col gap-3 font-sans text-xs bg-slate-950 p-4 rounded-xl border border-slate-850 text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-outfit font-black text-[10px] border border-red-500/15">
                      {selectedBloodType}
                    </span>
                    <span className="font-black text-white">{getReallocationDetails().units} Bags Required</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    AI suggests transfer from regional surplus to prevent inventory dip at Seattle Central:
                  </p>
                  
                  <div className="border-t border-slate-900 pt-3 flex flex-col gap-2 font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-350">{getReallocationDetails().source}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Destination:</span>
                      <span className="text-white">{getReallocationDetails().dest}</span>
                    </div>
                  </div>
                </div>

                {isAuthorized ? (
                  <span className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 py-3 text-xs font-bold text-emerald-500 font-sans">
                    ✓ Reallocation Contract Authorized
                  </span>
                ) : (
                  <button
                    onClick={handleAuthorizeRedistribution}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-xs font-bold text-white shadow-md shadow-red-500/10 transition-all cursor-pointer hover:-translate-y-0.5"
                  >
                    <Play className="h-4 w-4" />
                    Authorize Stock Reallocation
                  </button>
                )}
              </div>

              {/* Safety notification card */}
              <div className="bg-slate-900 rounded-2xl border border-slate-850 p-5 shadow-md flex items-start gap-3.5 text-left font-sans text-xs">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-200">Regional Safety Thresholds</span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Reallocations are computed using real-time courier availability, temperature safety bounds, and local hospital urgency levels.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
