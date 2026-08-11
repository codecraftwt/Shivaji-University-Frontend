import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const NAVY_DEEP = "#0A2E4D";
const NAVY_MID = "#123A5E";
const GOLD = "#D9A441";
const GOLD_LIGHT = "#F0CD86";
const INK = "#22303F";
const MUTED = "#7C8A9A";

const DocIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

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

  const displayedItems = showAll ? activeGroup.items : activeGroup.items.slice(0, 5);
  const hasMore = activeGroup.items.length > 5;

  return (
    <section
      ref={sectionRef}
      className="py-20 overflow-hidden relative bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          className="mb-12 transition-all duration-700 ease-out"
          style={{
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div
                className="text-[11px] font-bold tracking-[0.25em] uppercase mb-2"
                style={{ color: GOLD, letterSpacing: "0.25em" }}
              >
                Office Notices
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  color: NAVY_DEEP,
                  fontFamily: "'Fraunces', 'Georgia', serif",
                  letterSpacing: "-0.01em",
                }}
              >
                Circulars
              </h2>
            </div>
            <a
              href="#"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold group px-4 py-2 rounded-full transition-colors duration-300"
              style={{ color: NAVY_DEEP, backgroundColor: "#fff", border: `1px solid ${NAVY_DEEP}22` }}
            >
              View all circulars
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </a>
          </div>
          {/* double rule, letterhead signature */}
          <div className="mt-5 flex items-center gap-2">
            <div
              className="h-[3px] transition-all duration-700 ease-out"
              style={{ backgroundColor: NAVY_DEEP, width: sectionInView ? "3.5rem" : "0rem" }}
            />
            <div
              className="h-[1px] flex-1 transition-all duration-700 ease-out delay-150"
              style={{ backgroundColor: GOLD, opacity: sectionInView ? 0.6 : 0 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 lg:gap-0">
          {/* Category rail */}
          <div
            className="relative rounded-2xl lg:rounded-r-none overflow-hidden transition-all duration-700 ease-out"
            style={{
              background: `linear-gradient(165deg, ${NAVY_MID} 0%, ${NAVY_DEEP} 100%)`,
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateX(0)" : "translateX(-16px)",
              boxShadow: sectionInView ? `0 24px 48px -20px ${NAVY_DEEP}66` : "none",
            }}
          >


            <div
              ref={railRef}
              className="relative flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible px-3 py-3 lg:pt-3 lg:pb-6"
            >
              {/* sliding indicator */}
              <div
                className="hidden lg:block absolute left-3 right-3 rounded-lg transition-all duration-300 ease-out"
                style={{
                  backgroundColor: "#FFFFFF14",
                  top: indicator.top,
                  height: indicator.height,
                  opacity: indicator.ready ? 1 : 0,
                }}
              />
              <div
                className="hidden lg:block absolute left-3 w-[3px] rounded-full transition-all duration-300 ease-out"
                style={{
                  backgroundColor: GOLD,
                  top: indicator.top + 8,
                  height: Math.max(indicator.height - 16, 0),
                  opacity: indicator.ready ? 1 : 0,
                }}
              />

              {grouped.map((group, idx) => {
                const isActive = active === group.category;
                return (
                  <button
                    key={group.category}
                    ref={(el) => (tabRefs.current[group.category] = el)}
                    onClick={() => setActive(group.category)}
                    className="relative z-10 flex-shrink-0 lg:flex-shrink text-left px-4 py-3.5 text-sm font-semibold rounded-lg transition-all duration-500 ease-out whitespace-nowrap lg:whitespace-normal"
                    style={{
                      color: isActive ? "#FFFFFF" : "#9FB0C4",
                      opacity: sectionInView ? 1 : 0,
                      transform: sectionInView ? "translateX(0)" : "translateX(-12px)",
                      transitionDelay: sectionInView ? `${150 + idx * 70}ms` : "0ms",
                    }}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {CATEGORY_DISPLAY[group.category] || group.category}
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 tabular-nums"
                        style={{
                          backgroundColor: isActive ? GOLD : "#FFFFFF1A",
                          color: isActive ? NAVY_DEEP : "#C9D6E4",
                        }}
                      >
                        {group.items.length}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document list */}
          <div
            className="border rounded-2xl lg:rounded-l-none overflow-hidden transition-all duration-700 ease-out"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: `${NAVY_DEEP}14`,
              borderLeftWidth: 0,
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "150ms",
              boxShadow: sectionInView ? `0 30px 60px -15px ${NAVY_DEEP}33, 0 10px 25px -5px ${NAVY_DEEP}1A` : "none",
            }}
          >
            {activeGroup.items.length > 0 ? (
              <>
                <motion.div
                  key={active}
                  layout
                  className="divide-y overflow-hidden"
                  style={{
                    borderColor: `${NAVY_DEEP}0F`,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <AnimatePresence initial={false}>
                    {displayedItems.map((circular, idx) => (
                      <motion.a
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        key={circular.title + idx}
                        href={circular.link}
                        className="group flex items-start gap-4 px-6 py-4.5 transition-colors duration-200 overflow-hidden"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${NAVY_DEEP}08`)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span
                          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg mt-0.5 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(155deg, ${NAVY_MID}, ${NAVY_DEEP})`,
                            color: GOLD_LIGHT,
                          }}
                        >
                          <DocIcon />
                        </span>
                        <span
                          className="flex-1 text-[14px] leading-snug font-medium pt-1"
                          style={{ color: INK }}
                        >
                          {circular.title}
                        </span>
                        <span
                          className="flex-shrink-0 mt-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                          style={{ color: GOLD }}
                        >
                          <ArrowIcon />
                        </span>
                      </motion.a>
                    ))}
                  </AnimatePresence>
                </motion.div>
                {hasMore && (
                  <div
                    className="px-6 py-4 flex justify-end"
                    style={{ backgroundColor: `${NAVY_DEEP}05`, borderTop: `1px solid ${NAVY_DEEP}0F` }}
                  >
                    <Button
                      onClick={() => {
                        if (showAll) {
                          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setShowAll(false);
                        } else {
                          setShowAll(true);
                        }
                      }}
                      className="text-xs font-bold uppercase tracking-wider"
                    >
                      {showAll ? "Show Less" : "View More"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="px-6 py-14 text-center text-sm" style={{ color: MUTED }}>
                No circulars available in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&display=swap');
      `}</style>
    </section>
  );
}