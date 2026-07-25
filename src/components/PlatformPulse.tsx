"use client";

import React from "react";
import { Check, Clock, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";

interface PulseCard {
  id: string;
  timeAgo: string;
  description: string;
  extraIcon: React.ReactNode;
  extraText: string;
}

export default function PlatformPulse() {
  const pulses: PulseCard[] = [
    {
      id: "p-1",
      timeAgo: "2 mins ago",
      description: "Matched 2 units of O-Negative for surgery at City General.",
      extraIcon: <Clock className="h-3.5 w-3.5 text-slate-400" />,
      extraText: "Transit Time: 8 mins",
    },
    {
      id: "p-2",
      timeAgo: "10 mins ago",
      description: "Blood drive in Suburbia collected 42 units of various types.",
      extraIcon: <HeartPulse className="h-3.5 w-3.5 text-slate-400" />,
      extraText: "Donors: 42",
    },
    {
      id: "p-3",
      timeAgo: "1 hour ago",
      description: "Emergency Air supply delivered to Pediatrics Wing Alpha.",
      extraIcon: <Sparkles className="h-3.5 w-3.5 text-slate-400" />,
      extraText: "Delivery Confirmed",
    },
  ];

  return (
    <section className="bg-blue-50/40 border-y border-slate-200/50 py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Platform Pulse: Recent Matches
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-sans">
            Live telemetry of medical dispatches within the network.
          </p>
        </div>

        {/* Pulse Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pulses.map((pulse) => (
            <div
              key={pulse.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    Successful Match
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {pulse.timeAgo}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium text-left mb-6">
                  {pulse.description}
                </p>
              </div>

              {/* Footer details */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                  <Check className="h-4 w-4 stroke-[3px]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  {pulse.extraIcon}
                  <span>{pulse.extraText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
