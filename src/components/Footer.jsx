import { useEffect, useState } from "react";
import { getFooter } from "../lib/strapi";

const defaultColumns = [
  {
    title: "Useful Links",
    links: [
      { label: "Admissions", href: "#" },
      { label: "Examinations", href: "#" },
      { label: "Departments", href: "#" },
      { label: "Affiliated Colleges", href: "#" },
      { label: "Mandatory Disclosure", href: "#" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Library", href: "#" },
      { label: "Placement Cell", href: "#" },
      { label: "NIRF", href: "#" },
      { label: "Student Portal", href: "#" },
      { label: "e-Governance", href: "#" },
    ],
  },
  {
    title: "Other Links",
    links: [
      { label: "Alumni", href: "#" },
      { label: "Research", href: "#" },
      { label: "RTI", href: "#" },
      { label: "Grievances Redressal", href: "#" },
      { label: "Code of Conduct", href: "#" },
    ],
  },
];

const socialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-inherit">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-inherit">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 110 4 2 2 0 010-4z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-inherit">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-inherit">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-inherit">
      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function Footer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    getFooter()
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch(() => {
        if (mounted) setData(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const instituteName = data?.instituteName || "Shivaji University, Kolhapur";
  const instituteSubtitle = data?.instituteSubtitle || "Maharashtra, India";
  const address = data?.address || "Vidyanagar, Kolhapur, Maharashtra, India (416004)";
  const phone = data?.phone || "+91 231-2609000";
  const email = data?.email || "info@unishivaji.ac.in";

  const columns = data?.columns?.length
    ? data.columns.map((col) => ({
        title: col.title,
        links: (col.links || []).map((lnk) => ({ label: lnk.label, href: lnk.href || "#" })),
      }))
    : defaultColumns;

  const socialLinks = data?.socialLinks?.length
    ? data.socialLinks.map((s) => ({ platform: s.platform, href: s.href || "#" }))
    : [{ platform: "facebook", href: "#" }, { platform: "twitter", href: "#" }];

  return (
    <footer className="relative bg-gradient-to-br from-[#04060b] via-[#090d16] to-[#04060b] text-white/80 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FCD53A] to-transparent opacity-70"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-[#FCD53A]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#FCD53A]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-14 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col items-start backdrop-blur-md bg-white/[0.02] p-6 rounded-2xl border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-transform duration-500 hover:scale-[1.02]">
            <h3 className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FCD53A] to-[#ffeba1] mb-2 tracking-tight leading-snug">
              {instituteName}
            </h3>
            {instituteSubtitle && (
              <p className="text-[14px] font-medium text-white/60 mb-8">{instituteSubtitle}</p>
            )}
            <div className="space-y-4 text-[13.5px] text-white/70 w-full">
              {address && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.02]">
                  <svg className="w-5 h-5 text-[#FCD53A] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed">{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.02]">
                  <svg className="w-4 h-4 text-[#FCD53A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.02]">
                  <svg className="w-4 h-4 text-[#FCD53A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-4 lg:mt-0 lg:pl-10">
            {columns.map((column, colIdx) => (
              <div key={column.title || colIdx} className="flex flex-col">
                <h4 className="text-[16px] font-bold text-white mb-6 tracking-widest uppercase relative inline-block">
                  {column.title}
                  <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-gradient-to-r from-[#FCD53A] to-transparent rounded-full"></span>
                </h4>
                <ul className="space-y-3.5 text-[14px]">
                  {(column.links || []).map((link, linkIdx) => (
                    <li key={link.label || linkIdx}>
                      <a
                        href={link.href}
                        className="group flex items-center text-white/50 hover:text-white transition-all duration-300"
                      >
                        <span className="relative flex items-center justify-center w-5 h-5 mr-3 rounded-full bg-white/5 group-hover:bg-[#FCD53A]/20 group-hover:scale-110 transition-all duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[#FCD53A] transition-colors duration-300" />
                        </span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative border-t border-white/10 bg-[#020306]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-[13px] text-white/40 font-medium">
            <a href="#" className="hover:text-[#FCD53A] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#FCD53A] hover:after:w-full after:transition-all after:duration-300">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <a href="#" className="hover:text-[#FCD53A] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#FCD53A] hover:after:w-full after:transition-all after:duration-300">Terms & Conditions</a>
          </div>
          
          <p className="text-[13px] text-white/40 text-center order-3 md:order-none">
            &copy; {new Date().getFullYear()} <span className="text-white/60 font-semibold">{instituteName}</span>. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3.5 order-2 md:order-none">
            {socialLinks.map((s, i) => {
              const Icon = socialIcons[s.platform.toLowerCase()] || null;
              if (!Icon) return null;
              return (
                <a
                  key={i}
                  href={s.href}
                  className="group relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#FCD53A]/50 hover:shadow-[0_0_15px_rgba(252,213,58,0.3)] hover:-translate-y-1"
                  title={s.platform}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FCD53A] to-[#ffeba1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-white/60 group-hover:text-[#04060b] transition-colors duration-300 w-4 h-4 flex items-center justify-center">
                    {Icon}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
