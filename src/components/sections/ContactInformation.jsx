import React, { useState, useMemo } from "react";
import {
  Phone,
  Mail,
  ExternalLink,
  Search,
  Building2,
  GraduationCap,
  Megaphone,
  BookOpen,
  FileCheck2,
  Copy,
  Check,
  MapPin,
  Clock,
  Globe,
} from "lucide-react";

export default function ContactInformation({ data, pageContent }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedText, setCopiedText] = useState(null);

  const contactList = data?.info || [];
  const sectionTitle = data?.title || "Department Contact Directory";

  // Helper to get matching department icon
  const getOfficeIcon = (officeName = "") => {
    const name = officeName.toLowerCase();
    if (name.includes("administration") || name.includes("registrar")) {
      return Building2;
    }
    if (name.includes("public relation") || name.includes("pro")) {
      return Megaphone;
    }
    if (name.includes("exam") || name.includes("coe")) {
      return GraduationCap;
    }
    if (name.includes("distance") || name.includes("cde")) {
      return BookOpen;
    }
    if (name.includes("facility") || name.includes("certificate") || name.includes("sfc")) {
      return FileCheck2;
    }
    return Building2;
  };

  // Clean email text by removing spaces (e.g. "registrar @ unishivaji . ac . in" -> "registrar@unishivaji.ac.in")
  const cleanEmail = (rawEmail) => {
    if (!rawEmail) return "";
    return rawEmail.replace(/\s+/g, "").trim();
  };

  // Split multi-line or comma-separated phone numbers
  const parseNumbers = (rawNumbers) => {
    if (!rawNumbers) return [];
    return rawNumbers
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter(Boolean);
  };

  // Format Office name if it contains sub-descriptions
  const formatOffice = (rawOffice = "") => {
    if (rawOffice.includes("Certificates:")) {
      const parts = rawOffice.split("Certificates:");
      return {
        mainTitle: parts[0].trim(),
        description: `Certificates: ${parts[1].trim()}`,
      };
    }
    return { mainTitle: rawOffice.trim(), description: "" };
  };

  // Copy to clipboard with temporary feedback
  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${type}:${text}`);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Filter contacts by search query
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contactList;
    const q = searchTerm.toLowerCase();
    return contactList.filter((item) => {
      const office = (item.office || "").toLowerCase();
      const numbers = (item.Numbers || "").toLowerCase();
      const email = (item.Email || "").toLowerCase();
      return office.includes(q) || numbers.includes(q) || email.includes(q);
    });
  }, [contactList, searchTerm]);

  // Parse general contact info dynamically from pageContent
  const parseGeneralContact = (content) => {
    if (!content) {
      return {
        name: "Shivaji University, Kolhapur",
        address: "Vidyanagar, Kolhapur - 416004, Maharashtra, India",
        phone: "(0231) 2609000",
        email: "info@unishivaji.ac.in",
      };
    }
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
    const name = lines[0] || "Shivaji University, Kolhapur";
    const address = lines[1] || "Vidyanagar, Kolhapur - 416004, Maharashtra, India";
    const phoneMatch = content.match(/phone:\s*([^\n]+)/i);
    const emailMatch = content.match(/email:\s*([^\n]+)/i);

    return {
      name,
      address,
      phone: phoneMatch ? phoneMatch[1].trim() : "(0231) 2609000",
      email: emailMatch ? emailMatch[1].trim() : "info@unishivaji.ac.in",
    };
  };

  const generalInfo = parseGeneralContact(pageContent);

  return (
    <div className="w-full space-y-6">
      {/* 1. Normal Formal University Information (No Cards, Pure API Data) */}
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#005bb5] leading-tight">
          {generalInfo.name}
        </h2>
        
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-gray-700">
          {generalInfo.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#ff7f00] shrink-0" />
              <span>{generalInfo.address}</span>
            </div>
          )}

          {generalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#005bb5] shrink-0" />
              <span className="text-gray-500 font-medium">Phone:</span>
              <a
                href={`tel:${generalInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="font-mono font-semibold text-gray-900 hover:text-[#005bb5] transition-colors"
              >
                {generalInfo.phone}
              </a>
            </div>
          )}

          {generalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#005bb5] shrink-0" />
              <span className="text-gray-500 font-medium">Email:</span>
              <a
                href={`mailto:${cleanEmail(generalInfo.email)}`}
                className="font-mono font-semibold text-gray-900 hover:text-[#005bb5] transition-colors"
              >
                {cleanEmail(generalInfo.email)}
              </a>
            </div>
          )}
        </div>

        <span className="mt-3.5 block h-[2.5px] w-14 rounded-full bg-[#ff7f00]" />
      </div>

      {/* 2. Section Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h3 className="text-base sm:text-lg font-bold font-serif text-[#005bb5] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#ff7f00]" />
          <span>{sectionTitle}</span>
        </h3>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search department, exam, SFC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] shadow-2xs transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>      {/* 4. Desktop & Tablet: Formal Compact Data Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200/90 shadow-2xs bg-white">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1e3a8a] text-white text-[11px] font-bold uppercase tracking-wider border-b border-blue-900">
              <th className="py-2.5 px-2 w-9 text-center font-mono border-r border-blue-800/60">
                #
              </th>
              <th className="py-2.5 px-3 w-[35%] border-r border-blue-800/60">
                Office / Department
              </th>
              <th className="py-2.5 px-3 w-[23%] border-r border-blue-800/60">
                Contact Numbers
              </th>
              <th className="py-2.5 px-3 w-[27%] border-r border-blue-800/60">
                Official Email
              </th>
              <th className="py-2.5 px-2 w-[15%] text-center">
                Services & Portal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((item, index) => {
                const Icon = getOfficeIcon(item.office);
                const { mainTitle, description } = formatOffice(item.office);
                const numbers = parseNumbers(item.Numbers);
                const cleanMail = cleanEmail(item.Email);
                const isCopiedEmail = copiedText === `email:${cleanMail}`;
                const isEven = index % 2 === 1;

                return (
                  <tr
                    key={item.id || index}
                    className={`transition-colors ${
                      isEven ? "bg-slate-50/50" : "bg-white"
                    } hover:bg-blue-50/40`}
                  >
                    {/* # Serial */}
                    <td className="py-2.5 px-2 text-center font-mono text-[11px] font-medium text-gray-400 border-r border-gray-100 align-top">
                      {index + 1}
                    </td>

                    {/* Department / Office */}
                    <td className="py-2.5 px-3 align-top border-r border-gray-100">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-[#005bb5] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-xs leading-snug">
                            {mainTitle}
                          </h4>
                          {description && (
                            <p className="text-[10px] text-gray-500 mt-1 leading-tight bg-slate-50 p-1.5 rounded border border-slate-100/80">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Numbers */}
                    <td className="py-2.5 px-3 align-top border-r border-gray-100">
                      <div className="flex flex-col gap-1">
                        {numbers.length > 0 ? (
                          numbers.map((num, idx) => {
                            const cleanNum = num.replace(/\s+/g, "");
                            const isCopiedNum = copiedText === `phone:${cleanNum}`;
                            return (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1 max-w-full"
                              >
                                <a
                                  href={`tel:${cleanNum}`}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 hover:bg-amber-50 hover:text-[#ff7f00] text-gray-700 font-mono text-[11px] font-medium border border-gray-200 transition-colors truncate"
                                  title={`Call ${num}`}
                                >
                                  <Phone className="w-2.5 h-2.5 text-[#ff7f00] shrink-0" />
                                  <span className="truncate">{num}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(cleanNum, "phone")}
                                  title="Copy phone number"
                                  className="p-0.5 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer shrink-0"
                                >
                                  {isCopiedNum ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-gray-400 text-[11px] italic">N/A</span>
                        )}
                      </div>
                    </td>

                    {/* Official Email */}
                    <td className="py-2.5 px-3 align-top border-r border-gray-100">
                      {cleanMail ? (
                        <div className="inline-flex items-center gap-1 max-w-full">
                          <a
                            href={`mailto:${cleanMail}`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-[#005bb5] text-gray-700 font-mono text-[11px] font-medium border border-gray-200 transition-colors truncate"
                            title={`Email ${cleanMail}`}
                          >
                            <Mail className="w-2.5 h-2.5 text-[#005bb5] shrink-0" />
                            <span className="truncate">{cleanMail}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(cleanMail, "email")}
                            title="Copy email address"
                            className="p-0.5 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer shrink-0"
                          >
                            {isCopiedEmail ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">N/A</span>
                      )}
                    </td>

                    {/* Services & Portal Link */}
                    <td className="py-2.5 px-2 text-center align-top">
                      {item.Links ? (
                        <a
                          href={item.Links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 px-2 py-1 bg-[#005bb5] hover:bg-[#ff7f00] text-white font-medium text-[11px] rounded transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">
                          Direct
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  <p className="font-semibold text-xs">No departments matching "{searchTerm}"</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Please try searching with another keyword.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Mobile Card View (< 768px screens) */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((item, index) => {
            const Icon = getOfficeIcon(item.office);
            const { mainTitle, description } = formatOffice(item.office);
            const numbers = parseNumbers(item.Numbers);
            const cleanMail = cleanEmail(item.Email);
            const isCopiedEmail = copiedText === `email:${cleanMail}`;

            return (
              <div
                key={item.id || index}
                className="bg-white rounded-xl p-4 border border-gray-200/90 shadow-2xs space-y-3"
              >
                {/* Header: Number & Title */}
                <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-gray-100">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#005bb5] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                        {mainTitle}
                      </h4>
                      {description && (
                        <p className="text-[11px] text-gray-500 mt-1 leading-normal bg-slate-50 p-1.5 rounded border border-slate-100">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                    #{index + 1}
                  </span>
                </div>

                {/* Contact Info: Phone & Email */}
                <div className="space-y-2 text-xs">
                  {/* Phone numbers */}
                  {numbers.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#ff7f00] shrink-0 mt-1" />
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {numbers.map((num, idx) => {
                          const cleanNum = num.replace(/\s+/g, "");
                          const isCopiedNum = copiedText === `phone:${cleanNum}`;
                          return (
                            <div key={idx} className="inline-flex items-center gap-1">
                              <a
                                href={`tel:${cleanNum}`}
                                className="px-2 py-1 rounded bg-slate-50 hover:bg-amber-50 hover:text-[#ff7f00] text-gray-700 font-mono text-xs font-medium border border-gray-200 transition-colors"
                              >
                                {num}
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopy(cleanNum, "phone")}
                                className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer"
                              >
                                {isCopiedNum ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {cleanMail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#005bb5] shrink-0" />
                      <div className="inline-flex items-center gap-1.5 min-w-0">
                        <a
                          href={`mailto:${cleanMail}`}
                          className="px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 hover:text-[#005bb5] text-gray-700 font-mono text-xs font-medium border border-gray-200 transition-colors truncate"
                        >
                          {cleanMail}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(cleanMail, "email")}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer shrink-0"
                        >
                          {isCopiedEmail ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Portal Link / Footer */}
                {item.Links && (
                  <div className="pt-2 border-t border-gray-100 flex justify-end">
                    <a
                      href={item.Links}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#005bb5] hover:bg-[#ff7f00] text-white font-medium text-xs rounded-lg transition-all shadow-2xs"
                    >
                      <span>Open Department Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200 text-gray-500">
            <p className="font-semibold text-xs">No departments matching "{searchTerm}"</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Please try searching with another keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}

