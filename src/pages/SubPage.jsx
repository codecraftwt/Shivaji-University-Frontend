import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPage, getMainNavbar, getStrapiMediaUrl } from "../lib/strapi";
import SidebarMenu from "../components/SidebarMenu";
import HeroBanner from "../components/sections/HeroBanner";
import ContentWithImage from "../components/sections/ContentWithImage";
import ImageGrid from "../components/sections/ImageGrid";
import Loader from "../components/Loader";

export default function SubPage() {
  const { parentSlug, slug } = useParams();
  const [page, setPage] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // Fetch page data and navbar data concurrently
    Promise.all([
      getPage(slug, parentSlug),
      getMainNavbar()
    ])
      .then(([p, navData]) => {
        if (!mounted) return;
        setPage(p);
        
        if (navData && navData.menu_items) {
          const parentHref = `/${parentSlug}`;
          const currentMenuItem = navData.menu_items.find(
            (item) => item.href === parentHref || item.label.toLowerCase() === "about us"
          );
          
          if (currentMenuItem) {
            setMenuData(currentMenuItem);
          }
        }

        if (p?.sections) {
          const heroBannerSection = p.sections.find((s) => s.__component === "sections.hero-banner");
          if (heroBannerSection?.image) {
            const imgUrl = getStrapiMediaUrl(heroBannerSection.image);
            const img = new Image();
            img.src = imgUrl;
            img.onload = () => { if (mounted) setLoading(false); };
            img.onerror = () => { if (mounted) setLoading(false); };
            return; // Wait for image to load before setting loading false
          }
        }
        if (mounted) setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load subpage data", err);
        if (mounted) setPage(null);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, parentSlug]);

  if (loading) {
    return <Loader fullScreen={true} />;
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-3xl font-bold text-[#212E62]">Page not found</h1>
        <p className="mt-4 text-gray-600">
          The requested page could not be found on the backend.
        </p>
      </div>
    );
  }

  // Find the hero-banner section if it exists
  const heroBannerSection = page.sections?.find((s) => s.__component === "sections.hero-banner");
  const otherSections = page.sections?.filter((s) => s.__component !== "sections.hero-banner");

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner Area */}
      {heroBannerSection ? (
        <HeroBanner data={heroBannerSection} />
      ) : (
        <div className="bg-[#212E62] pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
              {page.title}
            </h1>
            <div className="w-20 h-1 bg-[#FF7B12] rounded mt-4"></div>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row gap-8 lg:gap-12 relative">
        {/* Sidebar Menu */}
        <SidebarMenu menuData={menuData} />

        {/* Page Content */}
        <main className="flex-1 bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-semibold text-[#212E62] mb-6 pb-4 border-b border-gray-100">
            {page.title}
          </h2>
          
          {page.content && (
            <div className="prose max-w-none text-gray-700">
              <p className="leading-relaxed whitespace-pre-wrap">{page.content}</p>
            </div>
          )}

          {/* Render other sections if needed */}
          {otherSections?.map((section, idx) => {
            if (section.__component === "sections.content-with-image") {
              return <ContentWithImage key={idx} data={section} />;
            }
            if (section.__component === "sections.image-grid") {
              return <ImageGrid key={idx} data={section} />;
            }
            return (
              <div key={idx} className="mt-8 hidden">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(section, null, 2)}
                </pre>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
