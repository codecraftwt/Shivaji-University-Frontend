import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

export default function UniversityMap({ page }) {
  const [copied, setCopied] = useState(false);
  const [mapType, setMapType] = useState("m"); // 'm' for Roadmap, 'k' for Satellite

  // Parse Latitude and Longitude dynamically from Strapi page.content
  const parseCoordinates = (content) => {
    const latMatch = content?.match(/latitude:\s*([\d.-]+)/i);
    const lngMatch = content?.match(/longitude:\s*([\d.-]+)/i);
    const lat = latMatch ? parseFloat(latMatch[1]) : 16.678048997528975;
    const lng = lngMatch ? parseFloat(lngMatch[1]) : 74.25603925528482;
    return { lat, lng };
  };

  const { lat, lng } = parseCoordinates(page?.content);

  // Copy GPS Coordinates to Clipboard
  const handleCopyCoords = () => {
    const coordsText = `${lat}, ${lng}`;
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Maps Directions & View URLs
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=${mapType}&hl=en&z=16&output=embed`;

  return (
    <div className="w-full space-y-6">
      {/* Top Controls & Information Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#005bb5] leading-tight">
              Shivaji University Campus Map
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#ff7f00] shrink-0" />
            <span>Vidyanagar, Kolhapur, Maharashtra 416004, India</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="hidden sm:inline font-mono text-xs font-semibold text-gray-500">
              GPS: {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
            </span>
          </p>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-100 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setMapType("m")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                mapType === "m"
                  ? "bg-white text-[#005bb5] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Roadmap
            </button>
            <button
              type="button"
              onClick={() => setMapType("k")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                mapType === "k"
                  ? "bg-white text-[#005bb5] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Satellite
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCoords}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium text-xs rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Coordinates Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-500" />
                <span>Copy GPS</span>
              </>
            )}
          </button>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005bb5] hover:bg-[#ff7f00] text-white font-medium text-xs rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in Google Maps full screen"
            title="Open Fullscreen in Google Maps"
            className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:text-[#005bb5] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Stylish Google Map Frame */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
        <div className="w-full h-[380px] sm:h-[520px] md:h-[680px] bg-slate-100 relative">
          <iframe
            title="Shivaji University Google Map"
            src={embedUrl}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
