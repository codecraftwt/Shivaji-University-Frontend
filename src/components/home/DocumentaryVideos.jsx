import { useState } from "react";

const defaultVideos = [
  { title: "Shivaji University Documentary", link: "" },
  { title: "Hon'ble Chancellor message on the occasion of 60th Foundation Day of Shivaji University", link: "" },
  { title: "Hon'ble Vice Chancellor - Address to Students on International Youth Day at Campus Ground", link: "" },
  { title: "A Message From Vice Chancellor, Kolhapur", link: "" },
  { title: "Shivaji University Community Radio: 90.4 FM (Tomato FM)", link: "" },
];

const FALLBACK_THUMB = "https://placehold.co/800x450/333/666?text=Shivaji+University";

function getYouTubeId(link = "") {
  const m = link.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : null;
}

export default function DocumentaryVideos({ data }) {
  const videos = data?.videos?.length
    ? data.videos.map((v) => ({ title: v.title, link: v.link || "" })).filter((v) => v.title)
    : defaultVideos;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const active = videos[activeIndex] || videos[0];
  const youTubeId = getYouTubeId(active?.link);
  const thumb = youTubeId
    ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
    : FALLBACK_THUMB;
  const embedSrc = youTubeId
    ? `https://www.youtube.com/embed/${youTubeId}`
    : active?.link || "";

  const openVideo = (i) => {
    setActiveIndex(i);
    setIsOpen(true);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          {/* Video Player */}
          <div
            className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video flex items-center justify-center group cursor-pointer border-4 border-white shadow-lg"
            onClick={() => openVideo(activeIndex)}
          >
            {isOpen ? (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={() => setIsOpen(false)}>
                <div className="relative w-full max-w-3xl p-4" onClick={(e) => e.stopPropagation()}>
                  <button className="absolute top-2 right-2 text-white text-2xl" onClick={() => setIsOpen(false)}>&times;</button>
                  {embedSrc ? (
                    <iframe
                      src={embedSrc}
                      title={active?.title || "Video"}
                      className="w-full h-64 md:h-96"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center gap-4 bg-gray-900 text-white text-center px-6">
                      <p className="font-semibold">{active?.title}</p>
                      <a
                        href={active?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF7B12] underline"
                      >
                        Open video page
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <img
                  src={thumb}
                  alt={active?.title || "Video cover"}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl z-10 hover:bg-[#FF7B12] hover:text-white transition-all duration-300">
                  <svg className="w-8 h-8 text-[#0B4C87] ml-1 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                </div>
                <span className="absolute bottom-3 left-4 right-4 z-10 text-white text-sm font-semibold text-left line-clamp-2 drop-shadow">
                  {active?.title}
                </span>
              </>
            )}
          </div>
          {/* Video List */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[2.5px] text-[#FF7B12] mb-1.5 block">
              Media
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B4C87] mb-6 leading-tight">
              Documentary Videos
            </h2>
            <div className="space-y-2">
              {videos.map((v, i) => (
                <div
                  key={i}
                  onClick={() => openVideo(i)}
                  className={`flex items-start p-3 rounded-lg cursor-pointer border transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-[#0B4C87]/[0.06] border-[#0B4C87]/20"
                      : "hover:bg-[#0B4C87]/[0.03] border-transparent hover:border-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5 text-[#FF7B12] mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                  <span className={`text-sm font-semibold leading-tight transition-colors duration-300 ${i === activeIndex ? "text-[#FF7B12]" : "text-[#0B4C87] hover:text-[#FF7B12]"}`}>
                    {v.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
