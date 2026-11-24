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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kilo — Fast Media Compression & Format Converter" },
    {
      name: "description",
      content:
        "Transform heavy megabyte (MB) assets into fast-loading kilobytes (KB). High-speed media compression and format conversion sponsored by Stockly.",
    },
    { name: "robots", content: "index, follow" },
    { name: "keywords", content: "image compressor, media compression, webp converter, png to webp, jpeg optimizer, favicon ico generator, client-side compressor" },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://kilo.nazmulcodes.org/",
    },
    { property: "og:title", content: "Kilo — Turn Heavy MBs into Lightweight KBs" },
    {
      property: "og:description",
      content:
        "High-performance media compression. Convert and compress WebP, PNG, JPEG, and ICO easily.",
    },
    { property: "og:url", content: "https://kilo.nazmulcodes.org/" },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
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

      {/* Component 10: FooterCredits (contains crawlable /privacy and /terms links) */}
      <FooterCredits />
    </div>
  );
}
