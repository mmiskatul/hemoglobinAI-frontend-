"use client";

import React from "react";
import { Star, MessageSquareQuote } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;
}

export default function MedicalTrust() {
  const testimonials: Testimonial[] = [
    {
      id: "t-1",
      quote: "The speed at which HEMOGLOBIN AI identifies and routes rare blood types is revolutionary. In trauma surgery, it's the difference between hope and tragedy.",
      name: "Dr. Sarah Chen",
      role: "Head of Hematology, City Medical",
      avatarInitials: "SC",
      avatarColor: "bg-red-600",
    },
    {
      id: "t-2",
      quote: "As a donor, the app makes it so easy to see my impact. Knowing my O- blood was matched to an emergency hospital within minutes is incredibly rewarding.",
      name: "Mark J. Thompson",
      role: "Premium Donor (O- Benefactor)",
      avatarInitials: "MT",
      avatarColor: "bg-blue-600",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Medical Trust
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-sans max-w-[600px] mx-auto leading-relaxed">
            Hear from the frontline professionals using HEMOGLOBIN AI to save lives daily.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4.5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50/50 rounded-2xl p-6 md:p-8 border border-slate-100 flex flex-col justify-between relative group hover:bg-slate-50 transition-colors"
            >
              {/* Quote Mark Decoration */}
              <div className="absolute top-6 right-6 text-red-500/10 pointer-events-none group-hover:text-red-500/20 transition-colors">
                <MessageSquareQuote className="h-10 w-10 fill-current" />
              </div>

              {/* Stars decoration */}
              <div className="flex gap-0.5 text-amber-500 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-base text-slate-600 italic font-sans leading-relaxed text-left mb-8 relative z-10">
                "{t.quote}"
              </p>

              {/* User Bio */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100/50">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${t.avatarColor} text-white font-bold text-sm shadow-md`}>
                  {t.avatarInitials}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-outfit text-sm font-bold text-slate-800">
                    {t.name}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mt-0.5">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
