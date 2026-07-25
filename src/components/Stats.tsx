"use client";

import React from "react";

interface StatItem {
  number: string;
  label: string;
  sub: string;
}

export default function Stats() {
  const stats: StatItem[] = [
    { number: "2.4M+", label: "ACTIVE DONORS", sub: "Verified database" },
    { number: "150k", label: "LIVES SAVED", sub: "Emergency matches" },
    { number: "850+", label: "HOSPITALS", sub: "Integrated nodes" },
    { number: "12s", label: "AVG. MATCH TIME", sub: "Neural query dispatch" },
  ];

  return (
    <section className="bg-white border-b border-slate-200/50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center px-4 ${
                idx >= 2 ? "pt-6 lg:pt-0" : "lg:pt-0"
              } ${idx % 2 === 1 ? "border-l-0 sm:border-l-0" : ""}`}
            >
              <span className="font-outfit text-3xl sm:text-4xl md:text-[44px] font-extrabold text-red-600 leading-none mb-2">
                {stat.number}
              </span>
              <span className="text-[11px] font-extrabold tracking-wider text-slate-800 uppercase mb-1">
                {stat.label}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
