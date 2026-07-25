"use client";

import React from "react";
import Link from "next/link";
import { HeartHandshake, Settings, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshake className="h-6 w-6 text-red-600 fill-red-600" />
              <span className="font-outfit text-lg font-extrabold tracking-tight text-white">
                HEMOGLOBIN <span className="text-red-600">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-sm">
              Connecting the world's blood supply through advanced intelligence and compassionate logistics.
            </p>
          </div>

          {/* Links Column 1: DASHBOARDS */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">
              Dashboards
            </span>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-slate-400">
              <li><Link href="/donor" className="hover:text-white transition-colors">Donor Portal</Link></li>
              <li><Link href="/hospital" className="hover:text-white transition-colors">Hospital Portal</Link></li>
              <li><Link href="/requester" className="hover:text-white transition-colors">Patient Portal</Link></li>
              <li><Link href="/courier" className="hover:text-white transition-colors">Fleet Courier</Link></li>
            </ul>
          </div>

          {/* Links Column 2: ADVANCED AI */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">
              Advanced AI
            </span>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-slate-400">
            </ul>
          </div>

          {/* Links Column 3: RESOURCES */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">
              Resources
            </span>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-slate-400">
              <li><a href="#blog" className="hover:text-white transition-colors">Health Blog</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs font-semibold text-slate-500">
          <span>
            &copy; 2024 HEMOGLOBIN AI. All rights reserved.
          </span>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-white transition-colors cursor-pointer">
              <Settings className="h-4.5 w-4.5" />
            </button>
            <button className="p-2 hover:text-white transition-colors cursor-pointer">
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
