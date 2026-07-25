"use client";

import React from "react";
import { ShieldCheck, Heart, Users, ShieldAlert } from "lucide-react";

export default function WhyDonate() {
  const benefits = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-red-600" />,
      bg: "bg-red-50",
      title: "Emergency Preparedness",
      desc: "Constant supply ensures that hospital emergencies are always manageable.",
    },
    {
      icon: <Heart className="h-5 w-5 text-pink-600" />,
      bg: "bg-pink-50",
      title: "Universal Support",
      desc: "Help individuals with chronic conditions or those undergoing complex surgeries.",
    },
    {
      icon: <Users className="h-5 w-5 text-red-600" />,
      bg: "bg-red-50",
      title: "AI Matcher Efficiency",
      desc: "Our platform ensures your specific blood type goes exactly where it is most needed.",
    },
  ];

  const compatibilityData = [
    { type: "O-", give: "Universal Donor", receive: "O-" },
    { type: "O+", give: "O+, A+, B+, AB+", receive: "O+, O-" },
    { type: "A+", give: "A+, AB+", receive: "A+, A-, O+, O-" },
    { type: "AB+", give: "AB+", receive: "Universal Recipient" },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Why Donate Info */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
              Why Donate Blood?
            </h2>
            <p className="text-base text-slate-500 font-sans leading-relaxed mb-8 max-w-[500px]">
              One donation can save up to three lives. Your contribution powers the network that keeps our community safe.
            </p>
            
            <div className="flex flex-col gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${b.bg} border border-red-100/30`}>
                    {b.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-outfit text-base font-bold text-slate-800 mb-1">
                      {b.title}
                    </span>
                    <span className="text-sm text-slate-500 leading-relaxed font-sans max-w-[440px]">
                      {b.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Compatibility Table Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-outfit text-lg font-extrabold text-slate-900 mb-4 text-left">
                Blood Compatibility Guide
              </h3>
              
              {/* Responsive Table wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-2">Blood Type</th>
                      <th className="py-3 px-2">Can Give To</th>
                      <th className="py-3 px-2">Can Receive From</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {compatibilityData.map((row) => (
                      <tr key={row.type} className="text-xs font-semibold text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-2 text-red-600 font-extrabold font-outfit text-sm">
                          {row.type}
                        </td>
                        <td className="py-3.5 px-2 text-slate-600 font-medium">
                          {row.give}
                        </td>
                        <td className="py-3.5 px-2 text-slate-600 font-medium">
                          {row.receive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Disclaimer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2 text-[10px] text-slate-400 font-semibold leading-relaxed">
                <ShieldAlert className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <span className="text-left mt-0.5">
                  All matches verify at medical center before donor dispatch.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
