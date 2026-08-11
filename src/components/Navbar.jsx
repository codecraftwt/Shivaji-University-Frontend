import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export default function Navbar({ initialMenu }) {
  const { pathname } = useLocation();
  const isDeptPage = pathname.startsWith("/departments/");
  const deptSlug = isDeptPage ? pathname.split("/")[2] : null;
  const isDiplomaPage = pathname.startsWith("/diploma/");
  const diplomaSlug = isDiplomaPage ? pathname.split("/")[2] : null;

  const [menuItems, setMenuItems] = useState(initialMenu?.menu_items || []);
  const [baseMenuItems, setBaseMenuItems] = useState(initialMenu?.menu_items || []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [mobileSubAccordion, setMobileSubAccordion] = useState(null);

  /* ===== Fetch Global Navbar Data ===== */
  useEffect(() => {
    if (initialMenu) return;

    async function fetchNavbar() {
      try {
        const menuRes = await fetch(
          `${STRAPI_URL}/api/main-navbar?populate[menu_items][populate][dropdown_items][populate][sub_items]=true`
        );
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          if (menuData?.data) {
            setMenuItems(menuData.data.menu_items || []);
            setBaseMenuItems(menuData.data.menu_items || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch navbar:", error);
      }
    }
    fetchNavbar();
  }, [initialMenu]);

  /* ===== Fetch Department / Diploma Specific Navbar Data ===== */
  useEffect(() => {
    async function fetchPageNavbar() {
      if (!deptSlug && !diplomaSlug) {
        setMenuItems(baseMenuItems);
        return;
      }

      try {
        if (deptSlug) {
          const res = await fetch(
            `${STRAPI_URL}/api/departments?filters[slug][$eq]=${deptSlug}&populate[menu_items][populate][dropdown_items][populate][sub_items]=true`
          );
          if (res.ok) {
            const result = await res.json();
            const deptData = result.data?.[0];
            if (deptData && deptData.menu_items?.length > 0) {
              setMenuItems(deptData.menu_items);
            }
          }
        } else if (diplomaSlug) {
          const res = await fetch(
            `${STRAPI_URL}/api/diplomas?filters[slug][$eq]=${diplomaSlug}&populate[menu_items][populate][dropdown_items][populate][sub_items]=true`
          );
          if (res.ok) {
            const result = await res.json();
            const diplomaData = result.data?.[0];
            if (diplomaData && diplomaData.menu_items?.length > 0) {
              setMenuItems(diplomaData.menu_items);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch department/diploma navbar:", error);
      }
    }
    fetchPageNavbar();
  }, [deptSlug, diplomaSlug, baseMenuItems]);

  /* ===== Body Scroll Lock ===== */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ===== Keyboard Navigation ===== */
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [dropdownPos, setDropdownPos] = useState({});
  const navItemRefs = useRef({});
  const setNavItemRef = useCallback((id, el) => {
    if (el) navItemRefs.current[id] = el;
  }, []);

  const computeDropdownPos = useCallback((itemId) => {
    const el = navItemRefs.current[itemId];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dropdownEl = el.querySelector('[role="menu"]');
    const panelW = dropdownEl ? dropdownEl.getBoundingClientRect().width : 380;
    const vw = window.innerWidth;
    const M = 16;
    let panelLeft = rect.left + rect.width / 2 - panelW / 2;
    if (panelLeft < M) panelLeft = M;
    if (panelLeft + panelW > vw - M) panelLeft = vw - panelW - M;
    const offset = panelLeft + panelW / 2 - rect.left;
    setDropdownPos((prev) => ({ ...prev, [itemId]: offset }));
  }, []);

  const sortedMenu = menuItems.slice();

  return (
    <>
      <div className="relative w-full max-w-[100vw] overflow-x-clip">
        {/* Simple Navbar Bar */}
        <div className="w-full bg-[#1E90FF] border-t border-white/20 shadow-md relative z-[100]">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between xl:justify-center min-h-[50px]">
            
            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center justify-center gap-0 w-full">
              {sortedMenu.map((item) => {
                const hasDropdownItems = item.dropdown_items && item.dropdown_items.length > 0;
                const posOffset = dropdownPos[item.id];

                return (
                  <div
                    key={item.id}
                    className="group relative flex items-center"
                    ref={(el) => setNavItemRef(item.id, el)}
                    onMouseEnter={() => computeDropdownPos(item.id)}
                  >
                    <Link
                      to={hasDropdownItems ? "#" : (item.href || "#")}
                      className="flex items-center gap-1 px-1.5 py-1 text-[13 px] font-medium uppercase tracking-wide text-white hover:text-[#FF7B12] transition-colors whitespace-nowrap relative"
                      onClick={(e) => {
                        if (hasDropdownItems) e.preventDefault();
                      }}
                    >
                      {item.label}
                      {hasDropdownItems && (
                        <svg className="w-3.5 h-3.5 opacity-80 shrink-0 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {hasDropdownItems && (
                      <div
                        className="absolute top-[100%] pt-2 z-[1100] invisible opacity-0 translate-y-2 -translate-x-1/2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        style={{ left: posOffset !== undefined ? posOffset : "50%" }}
                        role="menu"
                      >
                        <div className="flex min-w-[320px] max-w-[480px] bg-white shadow-xl border-t-[3px] border-t-[#FF7B12] rounded-b-xl overflow-visible">
                          <div className="flex-1 py-3 px-4 flex flex-col gap-1 text-gray-800">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#1E90FF] mb-2 pb-2 border-b border-gray-100">
                              {item.label}
                            </div>
                            <div className="flex flex-col gap-1">
                              {item.dropdown_items.map((dropdown, idx) => {
                                const hasSubItems = dropdown.sub_items && dropdown.sub_items.length > 0;
                                return (
                                  <div key={dropdown.id || idx} className="group/sub relative">
                                    {hasSubItems ? (
                                      <>
                                        <div className="flex items-center justify-between py-2 px-3 rounded-md cursor-pointer hover:bg-[#F7FAFF] hover:text-[#1E90FF] transition-colors">
                                          <span className="text-sm font-medium">{dropdown.label}</span>
                                          <svg className="w-3 h-3 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <SubFlyout items={dropdown.sub_items} />
                                      </>
                                    ) : (
                                      <Link to={dropdown.href || "#"} className="block py-2 px-3 text-sm font-medium hover:bg-[#F7FAFF] hover:text-[#1E90FF] rounded-md transition-colors">
                                        {dropdown.label}
                                      </Link>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Hamburger (visible only on small screens) */}
            <div className="xl:hidden flex items-center justify-between w-full">
               <span className="text-white font-semibold text-sm uppercase tracking-wider">Menu</span>
               <button
                 className="flex flex-col justify-center items-center gap-[4px] w-9 h-9 rounded cursor-pointer bg-white/10 hover:bg-white/20 transition-colors"
                 onClick={() => setMobileOpen(!mobileOpen)}
               >
                 <span className={`block w-4 h-0.5 bg-white rounded-sm transition-transform ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                 <span className={`block w-4 h-0.5 bg-white rounded-sm transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
                 <span className={`block w-4 h-0.5 bg-white rounded-sm transition-transform ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <div
        className={`fixed top-0 right-0 h-dvh w-[min(350px,85vw)] bg-white shadow-2xl z-[2000] overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <span className="text-[15px] font-bold text-[#1E90FF] uppercase tracking-wider">Navigation</span>
          <button onClick={() => setMobileOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-1">
          {sortedMenu.map((item) => {
            const hasDropdownItems = item.dropdown_items && item.dropdown_items.length > 0;
            const isAccordionOpen = mobileAccordion === item.id;

            return (
              <div key={item.id} className="mb-1">
                {hasDropdownItems ? (
                  <>
                    <button
                      className={`w-full flex items-center justify-between p-3 text-[14.5px] font-semibold uppercase text-left rounded-lg transition-colors ${
                        isAccordionOpen ? "bg-[#F7FAFF] text-[#1E90FF]" : "text-gray-800 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileAccordion(isAccordionOpen ? null : item.id)}
                    >
                      <span>{item.label}</span>
                      <svg className={`w-4 h-4 transition-transform ${isAccordionOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isAccordionOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="p-2 ml-3 border-l-2 border-gray-100 flex flex-col gap-1">
                        {item.dropdown_items.map((dropdown, idx) => {
                          const hasSubItems = dropdown.sub_items && dropdown.sub_items.length > 0;
                          const isSubAccordionOpen = mobileSubAccordion === dropdown.id;
                          return (
                            <div key={dropdown.id || idx}>
                              {hasSubItems ? (
                                <>
                                  <button
                                    className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 hover:text-[#1E90FF] rounded-md transition-colors"
                                    onClick={() => setMobileSubAccordion(isSubAccordionOpen ? null : dropdown.id)}
                                  >
                                    <span>{dropdown.label}</span>
                                    <svg className={`w-3 h-3 transition-transform ${isSubAccordionOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                  <div className={`overflow-hidden transition-all duration-300 ${isSubAccordionOpen ? "max-h-[500px]" : "max-h-0"}`}>
                                    <div className="pl-3 ml-2 border-l border-gray-100 flex flex-col mt-1 mb-2 gap-1">
                                      {dropdown.sub_items.map((sub, subIdx) => (
                                        <Link key={sub.id || subIdx} to={sub.href || "#"} onClick={() => setMobileOpen(false)} className="p-1.5 text-[13px] text-gray-500 hover:text-[#1E90FF]">
                                          {sub.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <Link to={dropdown.href || "#"} onClick={() => setMobileOpen(false)} className="block p-2 text-sm font-medium text-gray-700 hover:text-[#1E90FF] rounded-md transition-colors">
                                  {dropdown.label}
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className="flex p-3 text-[14.5px] font-semibold uppercase text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1900] animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

function SubFlyout({ items }) {
  const ref = useRef(null);
  const [dir, setDir] = useState("left-full");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.closest(".group\\/sub");
    if (!parent) return;

    const open = () => {
      const megaPanel = parent.closest("[role='menu']");
      if (!megaPanel) return;
      const panelRect = megaPanel.getBoundingClientRect();
      if (panelRect.right + 200 > window.innerWidth - 12) setDir("right-full");
      else setDir("left-full");
    };

    parent.addEventListener("mouseenter", open);
    return () => parent.removeEventListener("mouseenter", open);
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute ${dir} top-[-10px] pb-5 min-w-[200px] z-[1200] invisible opacity-0 -translate-x-1 group-hover/sub:visible group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-200`}
      style={dir === "right-full" ? { left: "auto", right: "100%", paddingRight: "8px" } : { paddingLeft: "8px" }}
    >
      <div className={`bg-white shadow-lg border border-gray-100 rounded-md p-2 mt-2 ${dir === "right-full" ? "border-r-[3px] border-r-[#FF7B12]" : "border-l-[3px] border-l-[#FF7B12]"}`}>
        {items.map((sub, subIdx) => (
          <Link key={sub.id || subIdx} to={sub.href || "#"} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#F7FAFF] hover:text-[#1E90FF] rounded transition-colors">
            {sub.label}
          </Link>
        ))}
      </div>
    </div>
  );
}