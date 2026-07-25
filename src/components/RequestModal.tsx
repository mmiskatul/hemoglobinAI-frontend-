"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle2, BrainCircuit } from "lucide-react";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBloodType?: string;
  defaultHospital?: string;
  onSuccess: (bloodType: string) => void;
}

export default function RequestModal({
  isOpen,
  onClose,
  defaultBloodType = "",
  defaultHospital = "",
  onSuccess,
}: RequestModalProps) {
  const [bloodType, setBloodType] = useState(defaultBloodType);
  const [hospitalName, setHospitalName] = useState(defaultHospital);
  const [volume, setVolume] = useState(2);
  const [urgency, setUrgency] = useState("critical");
  const [details, setDetails] = useState("");

  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Scanning Neural Network...");
  const [subText, setSubText] = useState("Analyzing spatial parameters and donor coordinates.");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setBloodType(defaultBloodType);
      setHospitalName(defaultHospital);
      setStep("form");
      setProgress(0);
    }
  }, [isOpen, defaultBloodType, defaultHospital]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("loading");
    setProgress(0);

    const phases = [
      { threshold: 15, title: "Locating nearby coordinates...", desc: "Scanning geographical grids in a 5km radius." },
      { threshold: 45, title: "Searching live blood registry...", desc: "Filtering verified donors with positive response histories." },
      { threshold: 75, title: "Synthesizing dispatch routes...", desc: "Mapping optimal courier vectors avoiding traffic congestion." },
      { threshold: 95, title: "Securing medical blockchain hash...", desc: "Generating smart contract authentication node." },
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setStep("success");
          onSuccess(bloodType);
        }, 500);
      } else {
        setProgress(currentProgress);
        const currentPhase = phases.find((p) => currentProgress < p.threshold);
        if (currentPhase) {
          setStatusText(currentPhase.title);
          setSubText(currentPhase.desc);
        }
      }
    }, 150);
  };

  const handleClose = () => {
    onClose();
    // Allow animation to finish before resetting
    setTimeout(() => {
      setStep("form");
      setProgress(0);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="emergency-request-title" className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-950 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* STEP 1: FORM DISPLAY */}
        {step === "form" && (
          <div>
            <div className="text-center mb-6 flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 mb-3">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 id="emergency-request-title" className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">
                Submit Emergency Request
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed max-w-[360px]">
                Activate the real-time AI dispatch system for immediate blood logistics.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-800">Required Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-600/10 transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select blood type...</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-800">Hospital / Facility Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g., Metropolitan Hospital Center"
                  className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-600/10 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Volume (Units)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-600/10 transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Urgency Priority</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-600/10 transition-all cursor-pointer"
                    required
                  >
                    <option value="critical">Critical (Immediate)</option>
                    <option value="high">High (Within 1 hr)</option>
                    <option value="medium">Medium (Within 4 hrs)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-800">Additional Instructions</label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter medical instructions or specific details..."
                  className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-600/10 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-sm font-bold text-white shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Initialize AI Match Protocol
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: SIMULATED LOADING DISPLAY */}
        {step === "loading" && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-heartbeat opacity-30" />
              <div className="absolute inset-[-10px] rounded-full border-2 border-dashed border-red-500/20 animate-spin" style={{ animationDuration: "12s" }} />
              <BrainCircuit className="h-9 w-9" />
            </div>

            <h3 className="font-outfit text-lg sm:text-xl font-extrabold text-slate-900 mb-1.5">
              {statusText}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-[340px] mb-6">
              {subText}
            </p>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-red-600 mt-2">{progress}% SECURE</span>
          </div>
        )}

        {/* STEP 3: SUCCESS DISPLAY */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6 border border-emerald-100">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
              Emergency Protocol Active!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mb-6">
              AI matching completed successfully in <strong className="text-slate-800">324ms</strong>.
            </p>

            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3 text-left font-sans text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Target Type:</span>
                <span className="text-slate-800 font-extrabold text-red-600 font-outfit text-sm">{bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Hospital:</span>
                <span className="text-slate-800 font-extrabold text-right line-clamp-1">{hospitalName || "Metropolitan Hospital"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Status:</span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-extrabold uppercase text-[9px] border border-emerald-100">
                  3 Donors Responding
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mb-6">
              Automated courier routes generated. Real-time ETA coordinates pushed to ambulance terminals.
            </p>

            <button
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center rounded-xl bg-slate-950 hover:bg-slate-900 py-3.5 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Acknowledge & Return
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
