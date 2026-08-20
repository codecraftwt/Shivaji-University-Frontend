import { useState, useEffect } from "react";

const getIcon = (name) => {
  switch (name) {
    case 'chevron-down':
      return <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 448 512"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg>;
    case 'eye':
      return <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 384 512"><path d="M369.941 97.941l-83.882-83.882A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v416c0 26.51 21.49 48 48 48h288c26.51 0 48-21.49 48-48V131.882a48 48 0 0 0-14.059-33.941zM332.118 128H256V51.882L332.118 128zM48 464V48h160v104c0 13.255 10.745 24 24 24h104v288H48zm228.687-211.303L224 305.374V268c0-11.046-8.954-20-20-20H100c-11.046 0-20 8.954-20 20v104c0 11.046 8.954 20 20 20h104c11.046 0 20-8.954 20-20v-37.374l52.687 52.674C286.704 397.318 304 390.28 304 375.986V264.011c0-14.311-17.309-21.319-27.313-11.314z"></path></svg>;
    case 'phone':
      return <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path></svg>;
    case 'facebook':
      return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>;
    case 'instagram':
      return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>;
    case 'linkedin':
      return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>;
    default:
      return null;
  }
};

const defaultData = {
  languages: [{ code: "mr", label: "Marathi" }],
  leftLinks: [
    { label: "To Content", url: "#content", icon: "chevron-down" },
    { label: "To Navigation", url: "#menu", icon: "chevron-down" },
    { label: "Screen Reader", url: "https://www.unishivaji.ac.in/general/screem-reader", icon: "eye" },
    { label: "(0231) 2609000", url: "tel:+912312609000", icon: "phone" }
  ],
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/unishivaji.ac.in?mibextid=ZbWKwL" },
    { platform: "instagram", url: "https://www.instagram.com/" },
    { platform: "linkedin", url: "https://in.linkedin.com/school/shivaji-university/" }
  ],
  loginMenu: [
    { label: "Faculty", url: "#" },
    { label: "Student", url: "#" },
    { label: "Email Login", url: "#" },
    { label: "Staff", url: "#" },
    { label: "Research", url: "#" },
    { label: "Colleges", url: "#" },
    { label: "Section login", url: "#" }
  ]
};

// single flat background for the whole bar — no zone changes
const BG = "#1E90FF";
const ORANGE = "#FF7B12";

export default function TopUtilityBar() {
  const [barData, setBarData] = useState(defaultData);

  useEffect(() => {
    const strapiUrl = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
    fetch(`${strapiUrl}/api/top-utility-bar?populate=*`)
      .then(res => res.json())
      .then(json => {
        const d = json?.data;
        if (d) {
          const attributes = d.attributes || d;
          setBarData(prev => ({ ...prev, ...attributes }));
        }
      })
      .catch(err => {
        console.error("Failed to fetch Top Utility Bar from Strapi:", err);
      });
  }, []);

  return (
    <div className="hidden lg:block text-[12px] relative z-[200] bg-gradient-to-r from-[#1E90FF] from-50% to-[#FF7B12]">
      <div className="mx-auto max-w-7xl px-4 py-2 flex justify-between items-center">
        {/* Left Side */}
        <div className="flex items-center gap-5">
          {barData.languages?.length > 0 && (
            <div id="google_language_translator" className="flex items-center border-r border-white/20 pr-5">
              <select className="text-white/85 bg-transparent border-none outline-none uppercase text-[10.5px] tracking-wider cursor-pointer hover:text-white transition-colors">
                <option className="text-gray-800 normal-case" value="">Select language</option>
                {barData.languages.map((lang, idx) => (
                  <option className="text-gray-800 normal-case" key={idx} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
          )}

          {barData.leftLinks?.map((link, idx) => (
            <div key={idx} className="flex items-center">
              {idx > 0 && <span className="text-white/30 mr-5 select-none" aria-hidden="true">/</span>}
              <a
                href={link.url}
                target={link.url.startsWith('http') ? "_blank" : "_self"}
                rel="noreferrer"
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors relative group"
              >
                <span className="text-white/60 group-hover:text-[#FF7B12] transition-colors">
                  {getIcon(link.icon)}
                </span>
                <span className="uppercase text-[11px] tracking-wider">{link.label}</span>
                <span
                  className="absolute left-0 -bottom-[3px] h-[1.5px] w-0 group-hover:w-full transition-all duration-200"
                  style={{ backgroundColor: ORANGE }}
                ></span>
              </a>
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3.5 border-r border-white/20 pr-5">
            <span className="text-white uppercase text-[12px] tracking-wider">Follow us</span>
            {barData.socialLinks?.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="text-white/90 transition-colors"
                onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                {getIcon(social.platform)}
              </a>
            ))}
          </div>

          {/* Login — orange text link with underline, not a colored block */}
          <div className="relative group/login z-40 ml-2">
            <button className="flex items-center gap-1.5 font-semibold uppercase text-[11px] tracking-wider transition-colors text-white hover:text-white/80">
              Login
              <span className="transition-transform duration-200 group-hover/login:rotate-180">
                {getIcon('chevron-down')}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-xl z-50 text-gray-700 text-[13px] overflow-hidden opacity-0 invisible translate-y-1 group-hover/login:opacity-100 group-hover/login:visible group-hover/login:translate-y-0 transition-all duration-150">
              <div className="h-[3px] w-full" style={{ backgroundColor: ORANGE }}></div>
              {barData.loginMenu?.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  className="block px-4 py-2.5 border-b border-gray-100 last:border-b-0 font-medium transition-colors"
                  style={{ borderLeft: "3px solid transparent" }}
                  onMouseEnter={e => { e.currentTarget.style.borderLeftColor = ORANGE; e.currentTarget.style.backgroundColor = "#F7FAFF"; e.currentTarget.style.color = "#0B4C87"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = ""; }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}