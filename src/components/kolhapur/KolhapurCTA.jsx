import React from "react";
import { ArrowRight } from "lucide-react";

export default function KolhapurCTA({ onNext }) {
  return (
    <div className="pb-3 mb-5 border-b border-gray-100 flex justify-end">
      <button
        type="button"
        onClick={onNext}
        className="group inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#004a99] hover:bg-[#ff7f00] text-white font-medium text-xs sm:text-sm rounded shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
      >
        <span>Next</span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
