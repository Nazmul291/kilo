import React from "react";

export function KiloLogo({
  className = "w-9 h-9",
  textClassName = "text-xl font-black",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Kilo Logo from public/logo.png */}
      <img
        src="/logo.png"
        alt="Kilo Logo"
        className={`${className} object-contain transition-transform duration-300 hover:scale-105`}
      />

      <span className={`tracking-tight text-white font-extrabold ${textClassName}`}>
        Kilo
      </span>
    </div>
  );
}
