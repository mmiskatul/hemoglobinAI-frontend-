"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Activity, ShieldCheck, HeartPulse } from "lucide-react";

interface HeroProps {
  onOpenEmergency: () => void;
  onOpenDonor: () => void;
}

export default function Hero({ onOpenEmergency, onOpenDonor }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background glow graphics */}
      <div className="absolute top-[-10%] right-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-radial from-red-600/5 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-radial from-blue-600/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3.5 py-1.5 text-xs font-bold tracking-wider text-red-600 uppercase mb-6">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              AI-Powered Advanced Precision
            </div>
            
            {/* Title */}
            <h1 className="font-outfit text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Revolutionizing <span className="text-red-600">Blood Logistics</span> with Precision AI
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-[620px] mb-8 font-sans">
              Connecting donors, hospitals, and recipients in real-time. HEMOGLOBIN AI reduces delivery times by 60% when seconds matter most.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenEmergency}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Emergency Blood Request
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onOpenDonor}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 px-6 py-4 text-base font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Find Blood
              </button>
            </div>
          </div>

          {/* Right Column: Visual Dashboard Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[390px] aspect-[1/1] rounded-3xl p-5 border border-slate-100 bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <div className="absolute inset-0 rounded-3xl bg-radial from-red-600/[0.02] to-transparent pointer-events-none" />
              
              {/* Card Top Details */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4 text-red-600 animate-pulse" />
                    <span className="font-outfit text-sm font-extrabold text-slate-900">hemoglobin AI</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Cardiac Care</span>
                </div>
                
                {/* Tech Status grid */}
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                </div>
              </div>

              {/* Heart Image Graphic container */}
              <div className="relative w-full h-[65%] rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 shadow-inner flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-300">
                <Image
                  src="/assets/heart_diagnostic_ai.png"
                  alt="AI Diagnostic Cardiac Model"
                  fill
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* HUD Coordinates overlays */}
                <div className="absolute inset-0 p-3 pointer-events-none">
                  <div className="w-full h-full border border-red-500/10 rounded-lg relative">
                    <div className="absolute top-2 left-2 font-mono text-[8px] text-red-400/70 tracking-wider">SYS.ACTIVE // TRACE.SYS_88</div>
                    <div className="absolute bottom-2 right-2 font-mono text-[8px] text-blue-400/70 tracking-wider">LAT: 40.7128° N // LON: 74.0060° W</div>
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-1">
                      <div className="h-1 w-3 bg-red-500/30 rounded" />
                      <div className="h-1 w-6 bg-red-500/40 rounded" />
                      <div className="h-1 w-4 bg-red-500/30 rounded" />
                    </div>
                  </div>
                </div>

                {/* Laser scan animation overlay */}
                <div className="absolute left-0 w-full h-0.5 bg-red-500/50 shadow-md shadow-red-500/80 animate-scan pointer-events-none" />
              </div>

              {/* Overlay Match Result Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-2xl p-4 shadow-xl border border-white/60 flex items-center gap-3.5 animate-float">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <MapPin className="h-5 w-5 fill-red-100" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-outfit text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    Verified AI Match
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-100" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Optimal Donor identified in <strong className="text-red-600">2.6s</strong>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
