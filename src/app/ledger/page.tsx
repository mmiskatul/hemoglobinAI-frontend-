"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Search,
  CheckCircle,
  Database,
  Lock,
  Download,
  AlertCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Globe
} from "lucide-react";

interface AuditStep {
  title: string;
  description: string;
  actor: string;
  time: string;
  status: "verified" | "pending";
  hash: string;
  publicKey: string;
}

export default function LedgerExplorer() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("BAG-9902-O-MINUS");
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Delivery hash from Courier page localstorage sync
  const [latestDeliveryHash, setLatestDeliveryHash] = useState("ledger-tx-1784979188432");
  const [latestDeliveryTime, setLatestDeliveryTime] = useState("09:42 AM");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHash = localStorage.getItem("latestDeliveryHash");
      const storedTime = localStorage.getItem("latestDeliveryTime");
      if (storedHash) setLatestDeliveryHash(storedHash);
      if (storedTime) setLatestDeliveryTime(storedTime);
    }
  }, []);

  const auditSteps: AuditStep[] = [
    {
      title: "Donation Intake Authorized",
      description: "Blood unit collected from verified hero donor. Initial screening completed.",
      actor: "Donor: Marcus Thompson (ID: #MT-4822)",
      time: "08:12 AM",
      status: "verified",
      hash: "0x8fa37d2f9bc8e5473919c0bde8374a2f89",
      publicKey: "pub_key_donor_thompson_9981"
    },
    {
      title: "Lab Processing & Antigen Typing",
      description: "Pathogen clearance checks completed. O- group confirmed and barcoded.",
      actor: "Lab Specialist: Dr. Sandra Patel",
      time: "08:45 AM",
      status: "verified",
      hash: "0x2bc938f2928ac7c7b830d8c7c7f1a2380",
      publicKey: "pub_key_lab_patel_seattle"
    },
    {
      title: "Cold Chain Logistics Escrow",
      description: "Bio-box sealed. Telemetry logged (avg temp 3.8°C, lid seal locked).",
      actor: "Fleet Courier: Vance Marcus (#XM-902)",
      time: "09:10 AM",
      status: "verified",
      hash: "0x6f920da83c9288e2c6c64188b0a9f8f2b",
      publicKey: "pub_key_courier_marcus_vance"
    },
    {
      title: "Hospital Registry Handover",
      description: "Delivery completed. Signature confirmed and hash verified en route.",
      actor: "Hospital Staff: Sarah Chen",
      time: latestDeliveryTime,
      status: "verified",
      hash: latestDeliveryHash,
      publicKey: "pub_key_hospital_chen_sarah"
    },
    {
      title: "Clinical Transfusion Outcome",
      description: "Successfully transfused. Post-transfusion wellness score at 85.",
      actor: "Patient Recipient: Sarah Chen (ID: #SC-4489)",
      time: "10:15 AM",
      status: "verified",
      hash: "0xfa99201bda827c7f83ab293e827b728a",
      publicKey: "pub_key_patient_sarah_chen"
    }
  ];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
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

          {/* Identity Tag */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
              <Database className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 font-sans">Audit Ledger</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5 font-sans leading-none">
                Compliance Explorer
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="font-sans">
            <ul className="flex flex-col gap-1">
              {[
                { id: "ledger", label: "Ledger Registry", icon: <FileText className="h-4.5 w-4.5" /> }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all bg-red-50 text-red-600 text-left"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer Settings */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 text-xs font-bold font-sans">
            <button className="w-full flex items-center gap-3 py-1.5 text-slate-400 hover:text-slate-800 transition-colors text-left cursor-pointer">
              <Settings className="h-4.5 w-4.5" />
              Settings
            </button>
            <Link href="/" className="flex items-center gap-3 py-1.5 text-slate-400 hover:text-red-600 transition-colors text-left cursor-pointer">
              <LogOut className="h-4.5 w-4.5" />
              Exit Console
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            
            {/* Search Input bar */}
            <div className="relative w-64 sm:w-80 font-sans">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Blood Bag IDs, Tx hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all animate-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-sans">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Ledger Secure
            </span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 text-left animate-in fade-in duration-300 font-sans">
          
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Cryptographic Chain-of-Custody
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Verify absolute traceability hashes from collection to transfusion clinical results.
              </p>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <Download className="h-4 w-4" />
              Export PDF Audit
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Left Column: Interactive Audit Timeline (~65%) */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left">
              <div>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Bag Registry Timeline</span>
                <h3 className="font-outfit text-base font-extrabold text-slate-900 mt-0.5">Tracking Pedigree: {searchQuery}</h3>
              </div>

              {/* Vertical timeline steps */}
              <div className="relative border-l border-slate-150 pl-6 ml-3 flex flex-col gap-8 font-sans">
                {auditSteps.map((step, idx) => (
                  <div key={idx} className="relative text-left">
                    {/* Circle bullet */}
                    <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-50 border border-emerald-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                    </span>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          {step.title}
                          <span className="text-[8px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100 px-1 py-0.2 rounded uppercase leading-none">Verified</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1 font-sans">{step.description}</p>
                        
                        <div className="mt-2 text-[9px] text-slate-400 font-semibold font-sans flex flex-col gap-0.5">
                          <span>Verified Actor: <strong className="text-slate-700">{step.actor}</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[8px] font-mono text-slate-400 font-bold">{step.time}</span>
                        <button
                          onClick={() => setActiveStepIndex(activeStepIndex === idx ? null : idx)}
                          className="text-[9px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer mt-1"
                        >
                          Verify Signature
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable signature drawer */}
                    {activeStepIndex === idx && (
                      <div className="mt-3 bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col gap-3 font-mono text-[9px] text-slate-500 animate-in slide-in-from-top-2 duration-150 text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-bold uppercase">Transaction Hash:</span>
                          <button
                            onClick={() => handleCopyHash(step.hash)}
                            className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                          >
                            {isCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <span className="bg-white p-2 rounded border border-slate-100 font-semibold break-all text-slate-800">{step.hash}</span>
                        
                        <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                          <span className="font-bold uppercase">Block Signer Public Key:</span>
                        </div>
                        <span className="bg-white p-2 rounded border border-slate-100 font-semibold text-slate-800">{step.publicKey}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Security overview & Stats (~35%) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Ledger database card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5 text-left">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Ledger Status</span>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs text-slate-800 block">SHA-256 Encrypted</span>
                      <span className="text-[9px] text-slate-400 font-semibold font-sans mt-0.5 leading-none">Immutable Ledger Nodes</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-xs font-semibold leading-relaxed text-slate-500 text-left flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span>Total Chain Height</span>
                      <strong className="text-slate-800 font-mono">14,812 Blocks</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Verification Audits</span>
                      <strong className="text-slate-800 font-mono">100% Compliant</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Hash Velocity</span>
                      <strong className="text-slate-800 font-mono">1.8s BlockTime</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory warning card */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm flex items-start gap-3 text-left font-sans text-xs text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">FDA compliance notices</span>
                  <p className="text-[10px] text-amber-700 font-semibold leading-relaxed mt-1 font-sans">
                    All transaction logs, signatures, and biological temperature readings comply with Title 21 CFR Part 11 requirements.
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
