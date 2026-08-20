import { Link } from "react-router-dom";
import TopUtilityBar from "./TopUtilityBar";

export default function HeaderClient({ logoUrl, rightLogoUrl, header }) {
  // default logo from reference
  const defaultLogoUrl = "https://res.cloudinary.com/dwwykeft2/image/upload/v1786098502/Unishivaji_website/uni_logo_e3ed2df4ec.png";
  const defaultRightLogoUrl = "https://res.cloudinary.com/dwwykeft2/image/upload/v1786098492/Unishivaji_website/iso_naac_2d577e1b1f.png";

  const finalLogoUrl = logoUrl || header?.logoUrl || defaultLogoUrl;
  const finalRightLogoUrl = rightLogoUrl || header?.rightLogoUrl || defaultRightLogoUrl;

  return (
    <div className="w-full flex flex-col font-sans border-b border-gray-200">
      {/* Top Utility Bar */}
      <TopUtilityBar />

      {/* Middle Header Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-4 flex-shrink-0">
             <img src={finalLogoUrl} alt="University Logo" className="w-48 sm:w-64 h-auto object-contain" />
          </Link>
          
          <div className="flex-1 max-w-lg w-full flex items-center justify-center">
            <form className="w-full flex rounded border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow focus-within:ring-1 focus-within:ring-[#005bb5] focus-within:border-[#005bb5]">
               <input 
                 type="search" 
                 placeholder={header?.searchPlaceholder || "Type & Hit Enter..."}
                 className="flex-1 px-4 py-2 outline-none text-sm text-gray-700"
               />
               <button type="submit" className="bg-gray-100 text-gray-600 px-4 hover:bg-gray-200 transition-colors border-l border-gray-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
               </button>
            </form>
          </div>

          <div className="flex-shrink-0 hidden md:block">
            <img src={finalRightLogoUrl} alt="Certificates" className="h-[60px] w-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
