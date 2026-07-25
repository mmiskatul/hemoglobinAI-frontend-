"use client";

import React from "react";
import { MapPin, Navigation, ExternalLink, ShieldCheck } from "lucide-react";

interface RequestCard {
  id: string;
  bloodType: string;
  matchScore: number;
  timeAgo: string;
  isUrgent: boolean;
  hospital: string;
  distance: string;
  mapType: "grid" | "route" | "complex";
  actionText: string;
  actionStyle: "solid" | "outline";
}

interface LiveRequestsProps {
  onRespond: (bloodType: string, hospital: string) => void;
}

export default function LiveRequests({ onRespond }: LiveRequestsProps) {
  const requests: RequestCard[] = [
    {
      id: "req-1",
      bloodType: "O- Negative",
      matchScore: 98,
      timeAgo: "5 mins ago",
      isUrgent: false,
      hospital: "City General Hospital",
      distance: "2.4 km",
      mapType: "grid",
      actionText: "Respond to Request",
      actionStyle: "solid",
    },
    {
      id: "req-2",
      bloodType: "B+ Positive",
      matchScore: 92,
      timeAgo: "Immediate Urgent",
      isUrgent: true,
      hospital: "St. Mary's Medical",
      distance: "5.1 km",
      mapType: "route",
      actionText: "View Details",
      actionStyle: "outline",
    },
    {
      id: "req-3",
      bloodType: "A+ Positive",
      matchScore: 88,
      timeAgo: "Surgery Emergency",
      isUrgent: false,
      hospital: "Trauma Center Alpha",
      distance: "8.9 km",
      mapType: "complex",
      actionText: "Respond to Request",
      actionStyle: "solid",
    },
  ];

  // Helper to render responsive visual SVG maps
  const renderMockMap = (type: "grid" | "route" | "complex") => {
    if (type === "grid") {
      return (
        <svg className="w-full h-full bg-slate-50" viewBox="0 0 200 80">
          <defs>
            <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          {/* Main roads */}
          <line x1="0" y1="40" x2="200" y2="40" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="60" y1="0" x2="60" y2="80" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="140" y1="0" x2="140" y2="80" stroke="#cbd5e1" strokeWidth="3" />
          {/* Pulse target point */}
          <circle cx="100" cy="40" r="8" fill="rgba(239, 68, 68, 0.15)" />
          <circle cx="100" cy="40" r="4" fill="#ef4444" className="animate-ping" />
          <circle cx="100" cy="40" r="3" fill="#ef4444" />
          {/* Hospital indicator */}
          <rect x="94" y="24" width="12" height="10" rx="2" fill="#1e293b" />
          <path d="M 100 26 L 100 32 M 97 29 L 103 29" stroke="#ffffff" strokeWidth="1" />
        </svg>
      );
    }

    if (type === "route") {
      return (
        <svg className="w-full h-full bg-slate-50" viewBox="0 0 200 80">
          <defs>
            <pattern id="gridPattern2" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern2)" />
          {/* Intersecting roads */}
          <path d="M 20,10 Q 80,70 180,40" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          <line x1="120" y1="0" x2="120" y2="80" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Route path in green/teal */}
          <path d="M 20,10 Q 80,70 180,40" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
          {/* Start Point */}
          <circle cx="20" cy="10" r="3" fill="#3b82f6" />
          {/* Target End Point */}
          <circle cx="180" cy="40" r="7" fill="rgba(16, 185, 129, 0.2)" />
          <circle cx="180" cy="40" r="4" fill="#10b981" />
        </svg>
      );
    }

    return (
      <svg className="w-full h-full bg-slate-50" viewBox="0 0 200 80">
        <defs>
          <pattern id="gridPattern3" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern3)" />
        {/* Diagonal paths */}
        <line x1="0" y1="0" x2="200" y2="80" stroke="#cbd5e1" strokeWidth="3" />
        <line x1="200" y1="0" x2="0" y2="80" stroke="#cbd5e1" strokeWidth="2" />
        {/* Horizontal connect */}
        <line x1="20" y1="40" x2="180" y2="40" stroke="#cbd5e1" strokeWidth="3" />
        {/* Red Route line */}
        <path d="M 30,12 L 100,40 L 170,28" fill="none" stroke="#ef4444" strokeWidth="2" />
        {/* Target point */}
        <circle cx="170" cy="28" r="6" fill="rgba(239, 68, 68, 0.2)" />
        <circle cx="170" cy="28" r="3.5" fill="#ef4444" />
        {/* Origin node */}
        <circle cx="30" cy="12" r="3.5" fill="#1e293b" />
      </svg>
    );
  };

  return (
    <section className="bg-blue-50/40 border-y border-slate-200/50 py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-8">
          <div className="text-left">
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
              Live Urgent Requests
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-sans">
              Real-time emergency needs in your vicinity.
            </p>
          </div>
          
          <a
            href="#all-requests"
            className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 transition-colors shrink-0"
          >
            View All
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Request Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              {/* Header Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-outfit text-lg font-extrabold text-slate-900">
                    {req.bloodType}
                  </span>
                  
                  {/* Match Score Badge */}
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[10px] font-bold border uppercase ${
                      req.matchScore >= 95
                        ? "bg-red-50 text-red-600 border-red-100"
                        : req.matchScore >= 90
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {req.matchScore}% Match Score
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      req.isUrgent ? "bg-amber-500 animate-ping" : "bg-slate-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      req.isUrgent ? "text-amber-600" : "text-slate-400"
                    }`}
                  >
                    {req.timeAgo}
                  </span>
                </div>
              </div>

              {/* Location details */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {req.hospital}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Distance: {req.distance}
                  </span>
                </div>
              </div>

              {/* Map Preview Graphic */}
              <div className="w-full h-24 rounded-xl border border-slate-100 overflow-hidden mb-5">
                {renderMockMap(req.mapType)}
              </div>

              {/* Action Button */}
              {req.actionStyle === "solid" ? (
                <button
                  onClick={() => onRespond(req.bloodType, req.hospital)}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-xs font-bold transition-all cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5 mr-1.5 fill-white" />
                  {req.actionText}
                </button>
              ) : (
                <button
                  onClick={() => onRespond(req.bloodType, req.hospital)}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-3 text-xs font-semibold transition-all cursor-pointer"
                >
                  {req.actionText}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
