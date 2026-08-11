import React from "react";

const socialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 110 4 2 2 0 010-4z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px]">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function FloatingSocials({ socialLinks = [] }) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] hidden xl:flex flex-col gap-4">
      {socialLinks.map((s, i) => {
        const Icon = socialIcons[s.platform.toLowerCase()];
        if (!Icon) return null;
        
        let hoverColorClass = "group-hover:bg-gray-800";
        let glowClass = "group-hover:shadow-gray-500/50";
        if (s.platform.toLowerCase() === "facebook") {
          hoverColorClass = "group-hover:bg-[#3b5998]";
          glowClass = "group-hover:shadow-[#3b5998]/50";
        }
        if (s.platform.toLowerCase() === "linkedin") {
          hoverColorClass = "group-hover:bg-[#007bb5]";
          glowClass = "group-hover:shadow-[#007bb5]/50";
        }
        if (s.platform.toLowerCase() === "instagram") {
          hoverColorClass = "group-hover:bg-[#e4405f]";
          glowClass = "group-hover:shadow-[#e4405f]/50";
        }
        if (s.platform.toLowerCase() === "youtube") {
          hoverColorClass = "group-hover:bg-[#cd201f]";
          glowClass = "group-hover:shadow-[#cd201f]/50";
        }

        return (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className={`group relative w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white transition-all duration-500 ease-out hover:-translate-x-1 ${hoverColorClass} ${glowClass} hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]`}
            aria-label={s.platform}
          >
            {/* SVG icon that changes color on hover */}
            <span className="text-[#0B4C87] group-hover:text-white transition-colors duration-500">
              {Icon}
            </span>

            {/* Tooltip that slides out from the left */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-semibold tracking-wide opacity-0 invisible translate-x-4 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
              {s.platform}
              {/* Tooltip Arrow */}
              <div className="absolute top-1/2 right-0 translate-x-[90%] -translate-y-1/2 border-[5px] border-transparent border-l-gray-900"></div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
