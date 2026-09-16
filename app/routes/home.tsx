import React, { useState } from "react";
import type { Route } from "./+types/home";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { HeroSection } from "../components/HeroSection";
import { MediaDropzone } from "../components/MediaDropzone";
import { OptimizationStatusAlert } from "../components/OptimizationStatusAlert";
import { CompressionControls } from "../components/CompressionControls";
import { ActionButton } from "../components/ActionButton";
import { AdGateModal } from "../components/AdGateModal";
import { ResultDownloadCard } from "../components/ResultDownloadCard";
import { StocklyFeaturedCard } from "../components/StocklyFeaturedCard";
import { FooterCredits } from "../components/FooterCredits";
import { LegalModal } from "../components/LegalModal";
import { CookieConsentBanner } from "../components/CookieConsentBanner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kilo — Fast Media Compression & Format Converter" },
    {
      name: "description",
      content:
        "Transform heavy megabyte (MB) assets into fast-loading kilobytes (KB). High-speed media compression and format conversion sponsored by Stockly.",
    },
    { property: "og:title", content: "Kilo — Turn Heavy MBs into Lightweight KBs" },
    {
      property: "og:description",
      content:
        "High-performance media compression. Convert and compress WebP, PNG, JPEG, and ICO easily.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"privacy" | "terms">("privacy");

  const openLegal = (tab: "privacy" | "terms") => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Component 1: HeaderNavigation */}
      <HeaderNavigation />

      <main className="flex-1 pb-12">
        {/* Component 2: HeroSection */}
        <HeroSection />

        {/* Component 3: MediaDropzone */}
        <MediaDropzone />

        {/* Component 4: OptimizationStatusAlert */}
        <OptimizationStatusAlert />

        {/* Component 5: CompressionControls */}
        <CompressionControls />

        {/* Component 6: ActionButton */}
        <ActionButton />

        {/* Component 7: AdGateModal */}
        <AdGateModal />

        {/* Component 8: ResultDownloadCard */}
        <ResultDownloadCard />

        {/* Component 9: StocklyFeaturedCard */}
        <StocklyFeaturedCard />
      </main>

      {/* Component 10: FooterCredits */}
      <FooterCredits onOpenLegal={openLegal} />

      {/* Legal & Privacy Policy Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      {/* GDPR / AdSense Cookie Consent Banner */}
      <CookieConsentBanner onOpenPrivacy={() => openLegal("privacy")} />
    </div>
  );
}
