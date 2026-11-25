import type { Route } from "./+types/$";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import { ArrowLeft } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Not Found — Kilo" },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <HeaderNavigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center">
        <span className="text-6xl font-extrabold text-emerald-400 mb-4">404</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-400 max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>
      </main>

      <FooterCredits />
    </div>
  );
}
