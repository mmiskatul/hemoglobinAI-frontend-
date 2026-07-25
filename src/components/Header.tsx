"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, HeartHandshake, Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenEmergency: () => void;
}

export default function Header({ onOpenEmergency }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      message: "Emergency Shortage Alert: Seattle Central inventory level dipped to 14%. O- dispatch recommended.",
      time: "10 mins ago",
      read: false
    },
    {
      id: 2,
      type: "telemetry",
      message: "Transit Telemetry Warning: Route #XM-902 G-force shock spike. Lid seal lock validated.",
      time: "24 mins ago",
      read: false
    },
    {
      id: 3,
      type: "lab",
      message: "Lab Screening Verified: Blood Bag ID BAG-8821-O-POS screened. Pathogen negative signed.",
      time: "1 hour ago",
      read: true
    },
    {
      id: 4,
      type: "roster",
      message: "Roster Expansion: 42 local donors added to standby SMS campaign routes.",
      time: "2 hours ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navLinks = ["Home", "Network", "AI Match", "Emergency"];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-red-600 fill-red-600" />
          <span className="font-outfit text-xl font-extrabold tracking-tight text-slate-900">
            HEMOGLOBIN <span className="text-red-600">AI</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                setActiveTab(link);
                if (link === "Emergency") {
                  onOpenEmergency();
                } else {
                  const elementId = link === "Home" ? "home" : link === "Network" ? "network" : "ai-match";
                  document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`font-sans text-[15px] font-medium transition-colors relative py-1 cursor-pointer ${
                activeTab === link
                  ? "text-red-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {link}
              {activeTab === link && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer relative"
              title="Notifications Desk"
            >
              <Bell className="h-[20px] w-[20px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                  <span className="font-outfit font-extrabold text-xs text-slate-900 uppercase">Emergency Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[9px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border text-[10px] font-sans flex flex-col gap-1 transition-all ${
                        item.read
                          ? "bg-white border-slate-100 text-slate-500"
                          : "bg-red-50/40 border-red-100/60 text-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-black uppercase text-[8px] ${item.read ? "text-slate-400" : "text-red-600"}`}>
                          {item.type === "alert" ? "🚨 SHORTAGE ALERT" : item.type === "telemetry" ? "🚚 TELEMETRY" : item.type === "lab" ? "🧬 LAB COMPLIANCE" : "👥 STANDBY ROSTER"}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 font-mono">{item.time}</span>
                      </div>
                      <p className="leading-relaxed font-semibold">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/login" className="rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-red-700">
            Login
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-6 py-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setActiveTab(link);
                  setMobileMenuOpen(false);
                  if (link === "Emergency") {
                    onOpenEmergency();
                  } else {
                    const elementId = link === "Home" ? "home" : link === "Network" ? "network" : "ai-match";
                    document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`text-left font-sans text-base font-semibold py-2 transition-colors ${
                  activeTab === link ? "text-red-600" : "text-slate-600"
                }`}
              >
                {link}
              </button>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 font-sans text-xs">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="flex items-center justify-between w-full p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Bell className="h-5 w-5" />
                  <span>Notifications ({unreadCount})</span>
                </div>
                {unreadCount > 0 && (
                  <span className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
                )}
              </button>

              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-extrabold text-white hover:bg-red-700">
                Login
              </Link>

              {notificationsOpen && (
                <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-1">
                    <span className="font-extrabold text-[8px] text-slate-500 uppercase">Emergency Desk Alerts</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[8px] font-bold text-red-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded-lg border text-[9px] font-sans flex flex-col gap-1 ${
                        item.read ? "bg-white border-slate-100 text-slate-500" : "bg-red-50 border-red-100 text-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-black uppercase text-[7px] ${item.read ? "text-slate-400" : "text-red-600"}`}>
                          {item.type}
                        </span>
                        <span className="text-[7px] text-slate-400 font-mono">{item.time}</span>
                      </div>
                      <p className="leading-normal font-semibold">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
