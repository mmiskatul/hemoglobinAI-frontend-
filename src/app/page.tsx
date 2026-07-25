"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveRequests from "@/components/LiveRequests";
import Stats from "@/components/Stats";
import WhyDonate from "@/components/WhyDonate";
import PlatformPulse from "@/components/PlatformPulse";
import MedicalTrust from "@/components/MedicalTrust";
import FAQ from "@/components/FAQ";
import JoinBanner from "@/components/JoinBanner";
import Footer from "@/components/Footer";
import RequestModal from "@/components/RequestModal";
import DonorModal from "@/components/DonorModal";

export default function Home() {
  // Modal states
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isDonorOpen, setIsDonorOpen] = useState(false);
  const [donorRole, setDonorRole] = useState<"donor" | "hospital">("donor");

  // Pre-filled states for emergency modal
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");

  const handleOpenEmergency = (bloodType = "", hospital = "") => {
    setSelectedBloodType(bloodType);
    setSelectedHospital(hospital);
    setIsEmergencyOpen(true);
  };

  const handleOpenDonor = (role: "donor" | "hospital" = "donor") => {
    setDonorRole(role);
    setIsDonorOpen(true);
  };

  const handleEmergencySuccess = (bloodType: string) => {
    console.log(`AI Dispatch Activated for: ${bloodType}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Header onOpenEmergency={() => handleOpenEmergency()} />

      {/* Hero Section */}
      <main className="flex-grow">
        <div id="home">
          <Hero
            onOpenEmergency={() => handleOpenEmergency()}
            onOpenDonor={() => handleOpenDonor("donor")}
          />
        </div>

        {/* Live requests */}
        <LiveRequests
          onRespond={(bloodType, hospital) => handleOpenEmergency(bloodType, hospital)}
        />

        {/* Key Metrics Stats */}
        <Stats />

        {/* Benefits & Compatibility matrix */}
        <div id="network">
          <WhyDonate />
        </div>

        {/* Timeline updates */}
        <div id="ai-match">
          <PlatformPulse />
        </div>

        {/* Medical trust reviews */}
        <MedicalTrust />

        {/* FAQ Accordion */}
        <FAQ />

        {/* Call to action network bottom banner */}
        <JoinBanner
          onJoinDonor={() => handleOpenDonor("donor")}
          onJoinHospital={() => handleOpenDonor("hospital")}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals Containers */}
      <RequestModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        defaultBloodType={selectedBloodType}
        defaultHospital={selectedHospital}
        onSuccess={handleEmergencySuccess}
      />

      <DonorModal
        isOpen={isDonorOpen}
        onClose={() => setIsDonorOpen(false)}
        defaultRole={donorRole}
      />
    </div>
  );
}
