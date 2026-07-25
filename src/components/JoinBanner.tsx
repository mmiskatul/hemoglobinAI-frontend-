"use client";

import React from "react";

interface JoinBannerProps {
  onJoinDonor: () => void;
  onJoinHospital: () => void;
}

export default function JoinBanner({ onJoinDonor, onJoinHospital }: JoinBannerProps) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-xl relative overflow-hidden">
          {/* Decorative glowing overlay */}
          <div className="absolute top-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-radial from-white/10 to-transparent blur-3xl" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-radial from-black/20 to-transparent blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Join the Network that Saves Lives Every Day.
            </h2>
            <p className="text-sm sm:text-base text-red-100 font-sans leading-relaxed mb-8 max-w-[500px] mx-auto">
              Whether you're a donor, a hospital representative, or an emergency service provider, your presence strengthens the network.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onJoinDonor}
                className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-red-700 px-6 py-3.5 text-sm font-bold shadow-md shadow-red-950/10 transition-all hover:-translate-y-0.5 cursor-pointer font-sans"
              >
                Join as a Donor
              </button>
              <button
                onClick={onJoinHospital}
                className="inline-flex items-center justify-center rounded-xl border border-white hover:bg-white/10 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer font-sans"
              >
                Hospital Integration
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
