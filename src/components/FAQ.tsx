"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>("faq-1"); // First item is expanded by default as shown in mockup

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "How does the AI matching work?",
      answer: "Our proprietary algorithm analyzes donor proximity, blood type rarity, traffic conditions, and clinical priority in real-time to ensure the fastest delivery of life-saving blood units.",
    },
    {
      id: "faq-2",
      question: "Is my data secure?",
      answer: "Yes, all donor files, medical records, and communication details are encrypted using AES-256 protocols and processed under strict HIPAA-compliant security measures.",
    },
    {
      id: "faq-3",
      question: "How often can I donate?",
      answer: "Whole blood donors can typically donate once every 56 days (8 weeks). Platelet donors can donate more frequently, up to 24 times per year, depending on screening guidelines.",
    },
  ];

  const toggleFAQ = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <section className="bg-white py-16 lg:py-24 border-t border-slate-200/50">
      <div className="mx-auto max-w-3xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="border-b border-slate-100 pb-4 transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between py-3 text-left font-outfit text-base font-bold text-slate-800 hover:text-red-600 transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-red-600 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                </button>
                
                {/* Collapsible Answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100 mt-2"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-slate-500 font-sans leading-relaxed text-left">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
