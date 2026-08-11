import { useEffect, useState } from "react";
import { getFooter, getStrapiMediaUrl } from "../lib/strapi";
import FloatingSocials from "./FloatingSocials";

const DoubleRightIcon = () => (
  <svg aria-hidden="true" className="w-3 h-3 flex-shrink-0 fill-current mt-1" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path>
  </svg>
);

const LocationMarkerIcon = () => (
  <svg aria-hidden="true" className="w-[18px] h-[18px] flex-shrink-0 fill-current mt-0.5" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg aria-hidden="true" className="w-[18px] h-[18px] flex-shrink-0 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
  </svg>
);

const EnvelopeIcon = () => (
  <svg aria-hidden="true" className="w-[18px] h-[18px] flex-shrink-0 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M512 464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V200.724a48 48 0 0 1 18.387-37.776c24.913-19.529 45.501-35.365 164.2-121.511C199.412 29.17 232.797-.347 256 .003c23.198-.354 56.596 29.172 73.413 41.433 118.687 86.137 139.303 101.995 164.2 121.512A48 48 0 0 1 512 200.724V464zm-65.666-196.605c-2.563-3.728-7.7-4.595-11.339-1.907-22.845 16.873-55.462 40.705-105.582 77.079-16.825 12.266-50.21 41.781-73.413 41.43-23.211.344-56.559-29.143-73.413-41.43-50.114-36.37-82.734-60.204-105.582-77.079-3.639-2.688-8.776-1.821-11.339 1.907l-9.072 13.196a7.998 7.998 0 0 0 1.839 10.967c22.887 16.899 55.454 40.69 105.303 76.868 20.274 14.781 56.524 47.813 92.264 47.573 35.724.242 71.961-32.771 92.263-47.573 49.85-36.179 82.418-59.97 105.303-76.868a7.998 7.998 0 0 0 1.839-10.967l-9.071-13.196z"></path>
  </svg>
);


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

  const logoUrl = (data?.logoImage ? getStrapiMediaUrl(data.logoImage) : data?.logoUrl) || "/placeholder-logo.png";
  const description = data?.description || "Shivaji University, Kolhapur, is a premier educational institution offering a wide range of academic programs and research initiatives.";
  const address = data?.address || "Shivaji University, Vidyanagar, Kolhapur - 416 004, Maharashtra, India.";
  const phone = data?.phone || "(0231) 2609000";
  const email = data?.email || "mail.unishivaji.ac.in";
  
  const quickLinksTitle = data?.quickLinksTitle || "Quick Link";
  const quickLinks = data?.quickLinks || [];
  
  const columns = data?.columns || [];
  const socialLinks = data?.socialLinks || [];
  
  const copyrightText = data?.copyrightText || `Copyright ©Shivaji University Kolhapur ${new Date().getFullYear()} . All rights reserved.`;
  const developerText = data?.developerText || "Design & Developed by <span class=\"text-[#FF7B12]\">Walstar Media LLP</span>";

  return (
    <footer className="bg-black text-white font-sans w-full border-t-[3px] border-[#FF7B12]">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <a href="/" className="inline-block">
              {data?.logoUrl ? (
                <img src={logoUrl} alt="Shivaji University" className="w-[150px] h-[150px] object-contain" />
              ) : (
                <div className="w-[150px] h-[150px] bg-white rounded-full flex items-center justify-center p-2">
                  <span className="text-black text-xs text-center font-bold">Logo Placeholder</span>
                </div>
              )}
            </a>
            <p className="text-[14px] leading-relaxed text-white max-w-xs">{description}</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:pl-10">
            <h2 className="text-[#FF7B12] text-xl font-semibold mb-5">{quickLinksTitle}</h2>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="flex items-start gap-2.5 text-[15px] hover:text-[#FF7B12] transition-colors group">
                    <span className="text-white group-hover:text-[#FF7B12] transition-colors"><DoubleRightIcon /></span>
                    <span className="leading-snug">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <h2 className="text-[#FF7B12] text-xl font-semibold mb-5">Location</h2>
            <ul className="space-y-5">
              {address && (
                <li className="flex items-start gap-3 text-[14px]">
                  <span className="text-white mt-0.5"><LocationMarkerIcon /></span>
                  <span className="leading-relaxed">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3 text-[14px]">
                  <span className="text-white"><PhoneIcon /></span>
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-[#FF7B12] transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3 text-[14px]">
                  <span className="text-white"><EnvelopeIcon /></span>
                  <a href={`mailto:${email}`} className="hover:text-[#FF7B12] transition-colors">{email}</a>
                </li>
              )}
            </ul>
          </div>
          
        </div>
      </div>

      {/* Orange Divider */}
      <div className="w-full h-px bg-[#FF7B12] max-w-[90%] mx-auto mb-10"></div>

      {/* Middle Columns Section */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
          {columns.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col">
              <ul className="space-y-3.5">
                {(col.links || []).map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href={link.href} className="flex items-start gap-2.5 text-[14px] hover:text-[#FF7B12] transition-colors group">
                      <span className="text-white group-hover:text-[#FF7B12] transition-colors"><DoubleRightIcon /></span>
                      <span className="leading-snug">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-white/20 max-w-[95%] mx-auto"></div>

      {/* Bottom Section */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-medium text-white">
          <div className="text-center md:text-left">
            {copyrightText}
          </div>
          <div className="text-center md:text-right" dangerouslySetInnerHTML={{ __html: developerText }} />
        </div>
      </div>
      
      {/* Floating Social Sidebar */}
      <FloatingSocials socialLinks={socialLinks} />
    </footer>
  );
}
