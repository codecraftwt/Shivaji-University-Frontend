import { useEffect, useRef, useState } from "react";
import { getStrapiMediaUrl } from "../../lib/strapi";
import "./DepartmentsLeadership.css";

const defaultDepartments = [
  { name: "Department of Agrochemicals and Pest Management", link: "https://www.unishivaji.ac.in/dptagpm/" },
  { name: "Department of Computer Science", link: "https://computer.instantbusinesslistings.com/" },
  { name: "Department of Architecture", link: "#" },
  { name: "Department of Environmental Science", link: "https://www.unishivaji.ac.in/dptenvsc/" },
  { name: "Department of Biotechnology", link: "https://www.unishivaji.ac.in/dptbiotech/" },
  { name: "Department of Commerce", link: "#" },
  { name: "Department of Botany", link: "https://www.unishivaji.ac.in/dptbot/" },
  { name: "Department of Education", link: "https://www.unishivaji.ac.in/dptedu/" },
  { name: "Department of Chemistry", link: "https://www.unishivaji.ac.in/dptchem/" },
  { name: "Department of Electronics", link: "https://www.unishivaji.ac.in/dptelect/" },
  { name: "Department of Chemical Technology", link: "#" },
  { name: "Department of History", link: "https://www.unishivaji.ac.in/dpthistory/" },
  { name: "Department of Communication and Journalism", link: "https://www.unishivaji.ac.in/dptjc/" },
  { name: "YRC Distance Education by Shivaji University, Kolhapur (SUK)", link: "#" },
];

const defaultLeadership = [
  {
    name: "Shri. C. P. Radhakrishnan",
    role: "Hon'ble Chancellor",
    photo: "https://placehold.co/200x200/ddd/333?text=Photo",
  },
  {
    name: "Prof. (Dr.) D. T. Shirke",
    role: "Hon'ble Vice Chancellor",
    photo: "https://placehold.co/200x200/ddd/333?text=Photo",
  },
];

// Fires once when the element scrolls into view, then disconnects.
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

export default function DepartmentsLeadership({ data }) {
  const [sectionRef, inView] = useInView(0.1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [leadership, setLeadership] = useState(defaultLeadership);
  const [searchVal, setSearchVal] = useState("");
  const leadershipRef = useRef(null);

  useEffect(() => {
    const carousel = leadershipRef.current;
    if (!carousel || leadership.length <= 2) return;

    const interval = setInterval(() => {
      const firstChild = carousel.firstElementChild;
      if (!firstChild) return;
      
      const cardWidth = firstChild.getBoundingClientRect().width;
      const gap = 20; // gap-5 is 20px
      const step = cardWidth + gap;

      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScrollLeft - 5) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollTo({ left: carousel.scrollLeft + step, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [leadership]);

  useEffect(() => {
    if (!data) return;

    if (data.departments?.length) {
      setDepartments(
        data.departments
          .map((d) => ({ name: d.name, link: d.link }))
          .filter((d) => d.name)
      );
    }
    if (data.leadership?.length) {
      setLeadership(
        data.leadership
          .map((l) => ({
            name: l.name,
            role: l.title,
            photo: l.image || l.imageUrl || l.photo || "https://placehold.co/200x200/ddd/333?text=Photo",
          }))
          .filter((p) => p.name)
      );
    }
  }, [data]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const revealed = inView || reduceMotion;

  const filteredDepts = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10">
        {/* ===== Departments ===== */}
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[2.5px] text-[#ff7f00]">
                Academics
              </span>
              <h2 className="mt-1.5 text-[1.7rem] sm:text-3xl font-bold text-[#005bb5] leading-tight">
                Our Departments
              </h2>
              <span className="mt-3 block h-[3px] w-12 rounded-full bg-[#ff7f00]" />
            </div>
            <span className="mb-1 shrink-0 text-xs font-medium text-gray-400">
              {filteredDepts.length} departments
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#005bb5] focus:ring-1 focus:ring-[#005bb5] transition-all"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchVal && (
              <button
                onClick={() => setSearchVal("")}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Scrollable single column with visible scrollbar */}
          <div className="overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-blue-600">
            <div className="flex flex-col gap-1">
              {filteredDepts.length > 0 ? (
                filteredDepts.map((dept, i) => (
                  <a
                    key={dept.name}
                    href={dept.link || "#"}
                    target={dept.link && dept.link !== "#" ? "_blank" : undefined}
                    rel={dept.link && dept.link !== "#" ? "noopener noreferrer" : undefined}
                    style={{
                      transitionDelay: revealed && !reduceMotion ? `${i * 30}ms` : "0ms",
                    }}
                    className={`group relative flex items-start gap-2.5 rounded-lg py-2.5 pl-3 pr-2 text-[13px] leading-tight text-gray-700 transition-all duration-500 ease-out hover:bg-[#005bb5]/[0.05] ${
                      revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[#ff7f00] transition-all duration-300 group-hover:h-[70%]" />
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff7f00] transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="transition-colors duration-200 group-hover:text-[#005bb5]">
                      {dept.name}
                    </span>
                  </a>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-gray-400">
                  No departments found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Leadership ===== */}
        <div>
          <div className="mb-7">
            <span className="text-[11px] font-semibold uppercase tracking-[2.5px] text-[#ff7f00]">
              Governance
            </span>
            <h2 className="mt-1.5 text-[1.7rem] sm:text-3xl font-bold text-[#005bb5] leading-tight">
              Leadership Team
            </h2>
            <span className="mt-3 block h-[3px] w-12 rounded-full bg-[#ff7f00]" />
          </div>

          <div
            ref={leadershipRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4 px-2 -mx-2"
          >
            {leadership.map((person, i) => (
              <div
                key={person.name}
                style={{
                  transitionDelay:
                    revealed && !reduceMotion ? `${150 + i * 120}ms` : "0ms",
                }}
                className={`group relative flex-shrink-0 w-[calc(50%-10px)] snap-start snap-always overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-[#005bb5]/10 ${
                  revealed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#ff7f00] to-[#ffb347]" />

                <div className="relative mx-auto mb-5 w-fit">
                  <span className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#ff7f00]/25 to-[#005bb5]/15" />
                  <img
                    src={getStrapiMediaUrl(person.photo)}
                    alt={person.role}
                    className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#ff7f00]">
                  {person.role}
                </span>
                <h3 className="mt-2 text-[17px] font-bold text-[#005bb5]">
                  {person.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}