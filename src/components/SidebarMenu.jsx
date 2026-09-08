import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { resolveHref } from "../lib/strapi";

export default function SidebarMenu({ menuData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  if (!menuData || !menuData.dropdown_items) return null;

  return (
    <aside className="w-full md:w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 self-stretch flex flex-col">
      <h3 className="text-lg sm:text-xl font-bold font-serif text-[#005bb5] mb-5 border-b-2 border-[#ff7f00] pb-2 inline-block">
        {menuData.label || "Quick Navigation"}
      </h3>
      <nav className="flex flex-col gap-1.5">
        {menuData.dropdown_items.map((item, idx) => {
          const itemHref = resolveHref(item);
          const hasSubItems = item.sub_items && item.sub_items.length > 0;
          const isItemActive = currentPath === itemHref;

          return (
            <div key={item.id || idx} className="flex flex-col gap-1">
              {hasSubItems ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 bg-slate-50/80 rounded-lg">
                    <span>{item.label}</span>
                  </div>
                  <div className="pl-2 flex flex-col gap-1 border-l-2 border-slate-100 ml-2 my-1">
                    {item.sub_items.map((sub, subIdx) => {
                      const subHref = resolveHref(sub);
                      const isSubActive = currentPath === subHref;
                      const isExternal = subHref.startsWith("http");

                      return isExternal ? (
                        <a
                          key={sub.id || subIdx}
                          href={subHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </a>
                      ) : (
                        <Link
                          key={sub.id || subIdx}
                          to={subHref}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            isSubActive
                              ? "bg-[#005bb5] text-white shadow-xs font-semibold translate-x-0.5"
                              : "text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSubActive ? "bg-[#ff7f00]" : "bg-gray-300"
                            }`}
                          />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : itemHref.startsWith("http") ? (
                <a
                  href={itemHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-gray-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="truncate">{item.label}</span>
                </a>
              ) : (
                <Link
                  to={itemHref}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isItemActive
                      ? "bg-[#005bb5] text-white shadow-xs font-semibold translate-x-0.5"
                      : "text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isItemActive ? "text-[#ff7f00]" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
