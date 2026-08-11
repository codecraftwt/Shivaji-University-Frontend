import { Link, useLocation } from "react-router-dom";

export default function SidebarMenu({ menuData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  if (!menuData || !menuData.dropdown_items) return null;

  return (
    <aside className="w-full md:w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-6 self-start sticky top-24">
      <h3 className="text-xl font-bold text-[#212E62] mb-6 border-b-2 border-[#FF7B12] pb-2 inline-block">
        {menuData.label || "Quick Navigation"}
      </h3>
      <nav className="flex flex-col gap-2">
        {menuData.dropdown_items.map((item, idx) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={idx}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                isActive
                  ? "bg-[#212E62] text-white shadow-md translate-x-1"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#FF7B12] hover:translate-x-1"
              }`}
            >
              {/* Arrow Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-300 ${
                  isActive ? "text-[#FF7B12]" : "text-gray-400 group-hover:text-[#FF7B12]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
