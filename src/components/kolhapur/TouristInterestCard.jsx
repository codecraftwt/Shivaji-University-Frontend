import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

export default function TouristInterestCard({ item, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  if (!item) return null;

  const title = item.title || "Landmark";
  const description = item.description || "";
  
  // If description is long (more than 280 characters), provide an elegant expand/collapse
  const isLong = description.length > 280;
  const shortText = isLong && !expanded ? description.slice(0, 260) + "..." : description;

  const formattedNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-blue-200">
      <div>
        {/* Top Header with Number and Pin */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#212E62] text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
              {formattedNumber}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#212E62]">
              {title}
            </h3>
          </div>
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF7B12] flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* Narrative Text */}
        <div className="text-gray-600 text-sm leading-relaxed space-y-3 whitespace-pre-line">
          <p>{shortText}</p>
        </div>
      </div>

      {/* Expand / Collapse Action if long */}
      {isLong && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004a99] hover:text-[#FF7B12] transition-colors cursor-pointer"
          >
            <span>{expanded ? "Show Less" : "Read Full Description"}</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          <span className="text-[11px] text-gray-400">
            {expanded ? "Expanded view" : "Compact view"}
          </span>
        </div>
      )}
    </div>
  );
}
