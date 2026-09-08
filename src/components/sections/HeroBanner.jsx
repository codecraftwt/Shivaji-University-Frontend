import React from "react";
import { getStrapiMediaUrl } from "../../lib/strapi";

export default function HeroBanner({ data }) {
  if (!data) return null;

  const { title, image } = data;
  const imageUrl = getStrapiMediaUrl(image);
  const cleanTitle = (title || "About University").trim();

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-[#1a2b49] overflow-hidden shadow-md">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={cleanTitle}
          className="absolute inset-0 w-full h-full object-cover object-[center_25%] transition-transform duration-1000 hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#212E62] to-[#FF7B12] opacity-80"></div>
      )}

      {/* Subtle gradient overlay to keep building bright while ensuring high text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-8 sm:pb-12 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg font-serif">
          {cleanTitle}
        </h1>
        {/* Decorative orange accent underline */}
        <div className="w-16 sm:w-20 h-1.5 bg-[#FF7B12] rounded-full mt-2 sm:mt-3 shadow-[0_0_10px_rgba(255,123,18,0.5)]"></div>
      </div>
    </div>
  );
}
