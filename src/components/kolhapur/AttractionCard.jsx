import React, { useState } from "react";
import { getStrapiMediaUrl } from "../../lib/strapi";

export default function AttractionCard({ item, onClick }) {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const label = item.label?.trim() || "Attraction";
  const rawImageUrl = getStrapiMediaUrl(item.image);

  return (
    <div
      onClick={() => onClick?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(item);
        }
      }}
      className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 shadow-xs hover:shadow-md transition-all duration-300 group aspect-[16/10] w-44 sm:w-52 md:w-56 shrink-0 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#005bb5]"
    >
      {/* Image Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-100">
        {rawImageUrl && !imageError ? (
          <img
            src={rawImageUrl}
            alt={label}
            loading="lazy"
            draggable={false}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2 text-center text-gray-400 text-xs">
            Photo unavailable
          </div>
        )}
      </div>

      {/* Subtle bottom gradient overlay for label legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"></div>

      {/* API Label */}
      <div className="absolute bottom-1.5 inset-x-2 z-10 text-center">
        <span className="text-white text-[11px] sm:text-xs font-semibold drop-shadow line-clamp-1">
          {label}
        </span>
      </div>
    </div>
  );
}
