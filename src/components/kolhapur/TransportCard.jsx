import React from "react";
import { Plane, Train, Bus, CarTaxiFront, Navigation } from "lucide-react";

function getTransportIcon(type = "") {
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("air") || normalized.includes("plane") || normalized.includes("flight")) {
    return Plane;
  }
  if (normalized.includes("rail") || normalized.includes("train")) {
    return Train;
  }
  if (normalized.includes("road") || normalized.includes("bus")) {
    return Bus;
  }
  if (normalized.includes("local") || normalized.includes("transit") || normalized.includes("taxi")) {
    return CarTaxiFront;
  }
  return Navigation;
}

export default function TransportCard({ item }) {
  if (!item) return null;

  const rawType = item.type || "Transit";
  const description = item.discription || item.description || "";
  const Icon = getTransportIcon(rawType);

  // Normalize display title (e.g. "Air" -> "By Air", if already "By Air" keep it)
  const displayTitle = rawType.toLowerCase().startsWith("by ")
    ? rawType
    : `By ${rawType}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-shadow flex items-start gap-3.5 sm:gap-5">
      {/* Logo / Icon on one side */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#005bb5]/10 text-[#005bb5] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5" />
      </div>

      {/* Vertical Divider | */}
      <div className="hidden sm:block w-[1px] self-stretch bg-gray-200 shrink-0"></div>

      {/* Text on other side: Title & Description */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold font-serif text-[#005bb5] mb-1">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}
