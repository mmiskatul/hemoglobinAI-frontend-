import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import DashboardAssistant from "@/components/DashboardAssistant";
import DashboardAuthGuard from "@/components/DashboardAuthGuard";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "HEMOGLOBIN AI - Revolutionizing Blood Logistics",
  description: "Connecting donors, hospitals, and recipients in real-time. HEMOGLOBIN AI reduces delivery times by 60% when seconds matter most.",
  applicationName: "Hemoglobin AI",
  keywords: ["blood logistics", "blood donors", "emergency blood request"],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-slate-50 text-slate-900 flex flex-col">
        <DashboardAuthGuard>{children}</DashboardAuthGuard>
        {modal}
        <DashboardAssistant dashboard="global" />
      </body>
    </html>
  );
}
