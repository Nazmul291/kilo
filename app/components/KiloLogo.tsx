import React from "react";

export function KiloLogo({ className = "w-8 h-8", textClassName = "text-xl font-black" }: { className?: string; textClassName?: string }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Kilo custom bold K with compression notch icon */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} transition-transform duration-300 hover:scale-105`}
        >
          {/* Subtle glowing background shield */}
          <rect width="48" height="48" rx="12" fill="url(#kilo-bg)" />
          
          {/* Vertical stem of the K */}
          <path
            d="M13 11H19V37H13V11Z"
            fill="white"
          />

          {/* Upper diagonal stroke */}
          <path
            d="M34 11H26L18 22L23 26L34 11Z"
            fill="url(#kilo-electric-cyan)"
          />

          {/* Lower diagonal stroke with inward compression arrow/notch */}
          <path
            d="M21 24L17 29L26 37H34L25 28L21 24Z"
            fill="url(#kilo-electric-emerald)"
          />

          {/* Inward data reduction arrow notch */}
          <path
            d="M33 22L27 25L33 28V22Z"
            fill="#10B981"
            className="animate-pulse"
          />

          <defs>
            <linearGradient id="kilo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="kilo-electric-cyan" x1="18" y1="11" x2="34" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="kilo-electric-emerald" x1="17" y1="24" x2="34" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex items-baseline">
        <span className={`tracking-tight text-white font-extrabold ${textClassName}`}>
          Kilo
        </span>
        <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">
          Client-Side
        </span>
      </div>
    </div>
  );
}
