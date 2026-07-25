"use client";

import React, { useEffect, useState } from "react";
import { X, Heart, HeartHandshake } from "lucide-react";

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: "donor" | "hospital";
}

export default function DonorModal({ isOpen, onClose, defaultRole = "donor" }: DonorModalProps) {
  const [role, setRole] = useState<"donor" | "hospital">(defaultRole);
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [consent, setConsent] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);

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
  }, [defaultRole, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setName("");
      setBloodType("");
      setPhone("");
      setLocation("");
      setConsent(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="network-title" className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-950 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="text-center mb-6 flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-3">
                <Heart className="h-6 w-6" />
              </div>
              <h2 id="network-title" className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">
                Join the Donor Network
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed max-w-[360px]">
                Register as a verified hero donor or hospital network node.
              </p>
            </div>

            {/* Toggle Role */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl mb-5 font-sans">
              <button
                type="button"
                onClick={() => setRole("donor")}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  role === "donor"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Hero Donor
              </button>
              <button
                type="button"
                onClick={() => setRole("hospital")}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  role === "hospital"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Hospital / Bank
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {role === "donor" ? "Full Name" : "Organization Name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "donor" ? "Enter your full name" : "e.g., Central Valley Blood Bank"}
                  className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    {role === "donor" ? "Blood Type" : "Operating Status"}
                  </label>
                  {role === "donor" ? (
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select...</option>
                      <option value="O-">O-</option>
                      <option value="O+">O+</option>
                      <option value="A-">A-</option>
                      <option value="A+">A+</option>
                      <option value="B-">B-</option>
                      <option value="B+">B+</option>
                      <option value="AB-">AB-</option>
                      <option value="AB+">AB+</option>
                    </select>
                  ) : (
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select...</option>
                      <option value="Full">Full Node (Receiving & Giving)</option>
                      <option value="Supply">Supply Only</option>
                      <option value="Receiver">Receiving Hub Only</option>
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Contact Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-800">Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Manhattan, New York"
                  className="rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all"
                  required
                />
              </div>

              <label className="flex items-start gap-2.5 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20 cursor-pointer"
                  required
                />
                <span className="text-[11px] font-semibold text-slate-500 leading-relaxed text-left">
                  {role === "donor"
                    ? "I consent to receive emergency SMS alerts when a critical match for my blood type is requested nearby."
                    : "I agree to integrate our hospital supply ledger with Hemoglobin AI API parameters."}
                </span>
              </label>

              <button
                type="submit"
                className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Register Node
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-6 border border-blue-100">
              <HeartHandshake className="h-9 w-9" />
            </div>

            <h3 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">
              Welcome to the Network!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-[340px] mb-6">
              Your registration has been securely processed. Thank you for contributing to our medical safety infrastructure.
            </p>

            <button
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
