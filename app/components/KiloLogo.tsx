import React from "react";
import kiloLogoUrl from "../assets/logo.png";

export function KiloLogo({
  className = "w-9 h-9",
  textClassName = "text-xl font-black",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Kilo logo (hashed Vite asset, cached long-term) */}
      <img
        src={kiloLogoUrl}
        alt="Kilo Logo"
        width="36"
        height="36"
        className={`${className} object-contain transition-transform duration-300 hover:scale-105`}
      />

      <span className={`tracking-tight text-white font-extrabold ${textClassName}`}>
        Kilo
      </span>
    </div>
  );
}
