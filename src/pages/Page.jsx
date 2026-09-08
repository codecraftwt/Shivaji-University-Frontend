import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPage } from "../lib/strapi";
import Loader from "../components/Loader";
import AboutKolhapur from "../components/kolhapur/AboutKolhapur";
import AboutUniversity from "../components/about-university/AboutUniversity";
import HowToReachSUK from "../components/reach/HowToReachSUK";
import ContactInformation from "../components/sections/ContactInformation";

export default function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPage(slug)
      .then((p) => {
        if (mounted) setPage(p);
      })
      .catch(() => {
        if (mounted) setPage(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <Loader fullScreen={true} />;
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-3xl font-bold text-[#212E62]">Page not found</h1>
        <p className="mt-4 text-gray-600">
          The requested page could not be found on the Strapi backend.
        </p>
      </div>
    );
  }

  const isHowToReachPage =
    slug?.toLowerCase().includes("reach") ||
    page?.slug?.toLowerCase().includes("reach");

  const isKolhapurPage =
    !isHowToReachPage &&
    (slug?.toLowerCase().includes("kolhapur") ||
    page?.slug?.toLowerCase().includes("kolhapur") ||
    page?.documentId === "gsrdx141an1rqsi0a1l9un57");

  const isAboutUniversityPage =
    slug?.toLowerCase() === "about-suk" ||
    slug?.toLowerCase() === "about-university" ||
    page?.slug?.toLowerCase() === "about-suk" ||
    page?.slug?.toLowerCase() === "about-university" ||
    page?.documentId === "d9fqien3ktfmi9drt0vhptsu";

  const contactSection = page.sections?.find(
    (s) => s.__component === "sections.contact-information"
  );

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10 md:py-16">
      {isHowToReachPage ? (
        <HowToReachSUK page={page} />
      ) : isKolhapurPage ? (
        <AboutKolhapur page={page} />
      ) : isAboutUniversityPage ? (
        <AboutUniversity page={page} />
      ) : contactSection ? (
        <ContactInformation data={contactSection} pageContent={page.content} />
      ) : (
        <>
          <h1 className="text-4xl font-bold text-[#212E62] mb-6">{page.title}</h1>
          {page.content && <p className="text-gray-700 leading-relaxed">{page.content}</p>}
        </>
      )}
    </div>
  );
}
