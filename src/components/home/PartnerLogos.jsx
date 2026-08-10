import { getStrapiMediaUrl } from "../../lib/strapi";

const defaultPartners = [
  { name: "Skill India", imageUrl: "" },
  { name: "Swachh Bharat", imageUrl: "" },
  { name: "MAKE IN INDIA", imageUrl: "" },
  { name: "Digital India", imageUrl: "" },
];

export default function PartnerLogos({ data }) {
  const partners = data?.partners?.length
    ? data.partners.map((p) => ({
        name: p.name,
        imageUrl: p.image || p.imageUrl || ""
      })).filter((p) => p.name || p.imageUrl)
    : defaultPartners;

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[3px] text-[#ff7f00]">
            Trusted Partners
          </span>
          <h2 className="mt-1.5 text-2xl font-bold text-[#005bb5] sm:text-3xl">
            Our Partners
          </h2>
          <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#ff7f00] to-[#005bb5]" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {partners.map((partner, i) => {
            const imgSrc = partner.imageUrl ? getStrapiMediaUrl(partner.imageUrl) : null;
            return imgSrc ? (
              <div
                key={i}
                title={partner.name}
                className="group flex h-28 w-44 items-center justify-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#005bb5]/20 hover:shadow-lg hover:shadow-[#005bb5]/10"
              >
                <img
                  src={imgSrc}
                  alt={partner.name || "partner logo"}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ) : (
              <span key={i} className="font-bold text-gray-400 text-xl tracking-wider uppercase">
                {partner.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
