import { getStrapiMediaUrl } from "../../lib/strapi";

export default function HeroBanner({ data }) {
  if (!data) return null;

  const { title, image } = data;
  const imageUrl = getStrapiMediaUrl(image);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] bg-gray-900 overflow-hidden shadow-md">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title || "Hero Banner"}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 transition-transform duration-1000 hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#212E62] to-[#FF7B12] opacity-80"></div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12 md:pb-16 z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
          {title}
        </h1>
        {/* Decorative underline */}
        <div className="w-24 h-1.5 bg-[#FF7B12] rounded-full mt-4 mb-2 shadow-[0_0_10px_rgba(255,123,18,0.5)]"></div>
      </div>
    </div>
  );
}
