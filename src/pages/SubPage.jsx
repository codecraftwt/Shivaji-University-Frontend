import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPage, getMainNavbar, getStrapiMediaUrl } from "../lib/strapi";
import SidebarMenu from "../components/SidebarMenu";
import HeroBanner from "../components/sections/HeroBanner";
import ContentWithImage from "../components/sections/ContentWithImage";
import ImageGrid from "../components/sections/ImageGrid";
import AboutKolhapur from "../components/kolhapur/AboutKolhapur";
import AboutUniversity from "../components/about-university/AboutUniversity";
import HowToReachSUK from "../components/reach/HowToReachSUK";
import UniversityMap from "../components/map/UniversityMap";
import ContactInformation from "../components/sections/ContactInformation";
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
          let currentMenuItem = null;
          if (parentSlug) {
            const parentHref = `/${parentSlug}`;
            currentMenuItem = navData.menu_items.find((item) => item.href === parentHref);
          }
          if (!currentMenuItem) {
            currentMenuItem = navData.menu_items.find((item) =>
              item.dropdown_items?.some(
                (d) =>
                  d.href === `/${slug}` ||
                  d.href?.toLowerCase().includes(slug?.toLowerCase()) ||
                  d.href?.endsWith(`/${slug}`) ||
                  d.sub_items?.some(
                    (s) =>
                      s.href === `/${slug}` ||
                      s.href?.toLowerCase().includes(slug?.toLowerCase()) ||
                      s.href?.endsWith(`/${slug}`)
                  )
              )
            );
          }
          if (!currentMenuItem) {
            currentMenuItem = navData.menu_items.find(
              (item) => item.label?.toLowerCase() === "about us"
            );
          }
          if (currentMenuItem) {
            setMenuData(currentMenuItem);
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

  const isHowToReachPage =
    slug?.toLowerCase().includes("reach") ||
    slug?.toLowerCase() === "how-to-reach-suk" ||
    slug?.toLowerCase() === "how-to-reach";

  const isKolhapurPage =
    !isHowToReachPage &&
    (slug?.toLowerCase().includes("kolhapur") ||
    page?.slug?.toLowerCase().includes("kolhapur") ||
    page?.documentId === "gsrdx141an1rqsi0a1l9un57");

  const isAboutUniversityPage =
    slug?.toLowerCase().includes("about-suk") ||
    slug?.toLowerCase().includes("about-university") ||
    page?.slug?.toLowerCase().includes("about-suk") ||
    page?.slug?.toLowerCase().includes("about-university") ||
    page?.documentId === "d9fqien3ktfmi9drt0vhptsu";

  const isMapPage =
    slug?.toLowerCase().includes("map") ||
    slug?.toLowerCase().includes("google-map") ||
    page?.slug?.toLowerCase().includes("map") ||
    page?.slug?.toLowerCase().includes("google-map") ||
    page?.title?.toLowerCase().includes("map") ||
    page?.documentId === "a1ffx89iq6dmxa7xgrmu3hb6";

  const isContactPage =
    slug?.toLowerCase().includes("contact") ||
    page?.slug?.toLowerCase().includes("contact") ||
    page?.documentId === "o819vnaik6s6l9g7ne2zzvr2";

  const hasContactSection = otherSections?.some(
    (s) => s.__component === "sections.contact-information"
  );

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

      {/* Main Content Area */}
      {isMapPage ? (
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8 md:py-10">
          <main className="w-full bg-white p-4 sm:p-7 md:p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <UniversityMap page={page} />
          </main>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10 md:py-12 flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 lg:gap-12 relative">
          {/* Sidebar Menu */}
          <SidebarMenu menuData={menuData} />

          {/* Page Content */}
          <main className="flex-1 min-w-0 bg-white p-4 sm:p-7 md:p-10 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            {isHowToReachPage ? (
              <HowToReachSUK page={page} />
            ) : isKolhapurPage ? (
              <AboutKolhapur page={page} />
            ) : isAboutUniversityPage ? (
              <AboutUniversity page={page} />
            ) : (
              <>
                {!hasContactSection && (
                  <h2 className="text-3xl font-semibold text-[#212E62] mb-6 pb-4 border-b border-gray-100">
                    {page.title}
                  </h2>
                )}
                
                {page.content && !hasContactSection && (
                  <div className="prose max-w-none text-gray-700">
                    <p className="leading-relaxed whitespace-pre-wrap">{page.content}</p>
                  </div>
                )}

                {/* Render other sections */}
                {otherSections?.map((section, idx) => {
                  if (section.__component === "sections.contact-information") {
                    return (
                      <ContactInformation
                        key={idx}
                        data={section}
                        pageContent={page.content}
                      />
                    );
                  }
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
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
