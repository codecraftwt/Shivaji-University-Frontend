import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Button from "../Button";

const CATEGORY_ORDER = [
  "General Administration",
  "Affiliation",
  "Examination",
  "Finance",
  "Board of Research",
];

const CATEGORY_DISPLAY = {
  "General Administration": "General Administration",
  "Affiliation": "Affiliation",
  "Examination": "Examination",
  "Finance": "Finance",
  "Board of Research": "Board of Research Development Section",
};

const defaultCirculars = [
  { title: "परिपत्रक - सुधारित कार्यालयीन वेळ (दिनांक २३/०८/२०२३)", link: "#", category: "General Administration" },
  { title: "National Level Seminar \"Role of NEP in Restructuring Education - 2024\"", link: "#", category: "General Administration" },
  { title: "Guidelines for Establishment of Endowment fund (New / Increase in amount)", link: "#", category: "General Administration" },
  { title: "शिवाजी विद्यापीठ कार्यकक्षेतील सर्व महाविद्यालये / मान्यताप्राप्त संस्था यांना माहितीसाठी", link: "#", category: "General Administration" },
  { title: "Revised Examination Timetable for Winter Session 2024", link: "#", category: "Examination" },
  { title: "Affiliation Renewal Guidelines for Constituent Colleges", link: "#", category: "Affiliation" },
];

const DEEP = "#0B4C87";
const LIGHT = "#1E90FF";
const ORANGE = "#FF7B12";

const DocIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Fires once, true after element crosses into viewport
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function Circulars({ data }) {
  const [active, setActive] = useState("General Administration");
  const [sectionRef, sectionInView] = useInView(0.1);
  const railRef = useRef(null);
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ top: 0, height: 0, ready: false });
  const [showAll, setShowAll] = useState(false);

  const circulars = data?.circulars?.length
    ? data.circulars.map((c) => ({
        title: c.title,
        link: c.link || "#",
        category: c.category,
      }))
    : defaultCirculars;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: circulars.filter((c) => c.category === cat),
  }));

  const activeGroup = grouped.find((g) => g.category === active) || grouped[0];

  // Reset showAll when switching categories
  useEffect(() => {
    setShowAll(false);
  }, [active]);

  useLayoutEffect(() => {
    const el = tabRefs.current[active];
    const container = railRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({
        top: elRect.top - containerRect.top,
        height: elRect.height,
        ready: true,
      });
    }
  }, [active, sectionInView]);

  const displayedItems = showAll 
    ? activeGroup.items 
    : activeGroup.items.slice(0, 5);

  const hasMore = activeGroup.items.length > 5;

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="flex items-end justify-between mb-10 transition-all duration-700 ease-out"
          style={{
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: DEEP }}>
              Circulars
            </h2>
            <div
              className="mt-2 h-[3px] transition-all duration-700 ease-out delay-200"
              style={{
                backgroundColor: ORANGE,
                width: sectionInView ? "3rem" : "0rem",
              }}
            ></div>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold group"
            style={{ color: LIGHT }}
          >
            View all circulars
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
          {/* Category rail */}
          <div
            ref={railRef}
            className="relative flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0"
          >
            {/* sliding indicator (desktop only) */}
            <div
              className="hidden lg:block absolute left-0 w-full rounded transition-all duration-300 ease-out"
              style={{
                backgroundColor: "#F2F7FF",
                top: indicator.top,
                height: indicator.height,
                opacity: indicator.ready ? 1 : 0,
                zIndex: 0,
              }}
            ></div>
            <div
              className="hidden lg:block absolute left-0 w-[3px] rounded-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: ORANGE,
                top: indicator.top,
                height: indicator.height,
                opacity: indicator.ready ? 1 : 0,
                zIndex: 1,
              }}
            ></div>

            {grouped.map((group, idx) => {
              const isActive = active === group.category;
              return (
                <button
                  key={group.category}
                  ref={(el) => (tabRefs.current[group.category] = el)}
                  onClick={() => setActive(group.category)}
                  className="relative z-10 flex-shrink-0 lg:flex-shrink text-left px-4 py-3 text-sm font-semibold rounded transition-all duration-500 ease-out whitespace-nowrap lg:whitespace-normal"
                  style={{
                    color: isActive ? DEEP : "#6B7280",
                    opacity: sectionInView ? 1 : 0,
                    transform: sectionInView ? "translateX(0)" : "translateX(-12px)",
                    transitionDelay: sectionInView ? `${150 + idx * 70}ms` : "0ms",
                  }}
                >
                  <span className="flex items-center justify-between gap-3">
                    {CATEGORY_DISPLAY[group.category] || group.category}
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: isActive ? ORANGE : "#E5E7EB",
                        color: isActive ? "#fff" : "#6B7280",
                      }}
                    >
                      {group.items.length}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Document list */}
          <div
            className="border border-gray-100 rounded-lg overflow-hidden transition-all duration-700 ease-out"
            style={{
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "150ms",
              boxShadow: sectionInView ? "0 20px 40px -15px rgba(11,76,135,0.2)" : "none",
            }}
          >
            {activeGroup.items.length > 0 ? (
              <>
                <div 
                  key={active} 
                  className="divide-y divide-gray-100 transition-all duration-[800ms] overflow-hidden"
                  style={{
                    maxHeight: showAll ? "1000px" : "320px",
                    minHeight: "320px",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  {displayedItems.map((circular, idx) => (
                    <a
                      key={idx}
                      href={circular.link}
                      className="circular-row group flex items-start gap-3 px-5 py-4 hover:bg-[#F7FAFF] transition-colors duration-200"
                      style={{ animationDelay: `${idx * 70}ms` }}
                    >
                      <span
                        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md mt-0.5 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: "#F2F7FF", color: LIGHT }}
                      >
                        <DocIcon />
                      </span>
                      <span className="flex-1 text-[13.5px] leading-snug font-medium text-gray-700 group-hover:text-[#0B4C87] transition-colors">
                        {circular.title}
                      </span>
                      <span
                        className="flex-shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                        style={{ color: ORANGE }}
                      >
                        <ArrowIcon />
                      </span>
                    </a>
                  ))}
                </div>
                {hasMore && (
                  <div className="px-5 py-3.5 bg-gray-50/60 flex justify-end">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-xs px-4 py-1.5 font-bold uppercase tracking-wider text-white bg-[#0B4C87] hover:bg-[#FF7B12] rounded transition-colors duration-300"
                    >
                      {showAll ? "Show Less" : "View More"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-gray-400">
                No circulars available in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes circularRowIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .circular-row {
          animation: circularRowIn 0.45s ease-out both;
        }
      `}</style>
    </section>
  );
}