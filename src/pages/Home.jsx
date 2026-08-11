import { useState, useEffect } from "react";
import { getStrapiMediaUrl } from "../lib/strapi";
import HeroSection from "../components/home/HeroSection";
import QuickLinksRow from "../components/home/QuickLinksRow";
import DepartmentsLeadership from "../components/home/DepartmentsLeadership";
import AnnouncementsTicker from "../components/home/AnnouncementsTicker";
import Loader from "../components/Loader";

import Circulars from "../components/home/Circulars";
import ImportantLinksStats from "../components/home/ImportantLinksStats";
import DocumentaryVideos from "../components/home/DocumentaryVideos";
import PartnerLogos from "../components/home/PartnerLogos";

export default function Home() {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    // `populate=*` does NOT deep-populate media inside nested components (e.g. leadership.image),
    // so the `on` syntax must list every component used in the dynamic zone explicitly.
    const query = [
      "filters[slug][$eq]=home",
      "populate[sections][on][sections.hero-section][populate][slides][populate][image]=true",
      "populate[sections][on][sections.quick-links][populate][links]=true",
      "populate[sections][on][sections.departments-leadership][populate][leadership][populate][image]=true",
      "populate[sections][on][sections.departments-leadership][populate][departments]=true",
      "populate[sections][on][sections.announcements-ticker][populate][announcements]=true",
      "populate[sections][on][sections.updates-events-achievements][populate][updates]=true",
      "populate[sections][on][sections.updates-events-achievements][populate][events]=true",
      "populate[sections][on][sections.updates-events-achievements][populate][achievements]=true",
      "populate[sections][on][sections.updates-events-achievements][populate][updatesImage]=true",
      "populate[sections][on][sections.updates-events-achievements][populate][eventsImage]=true",
      "populate[sections][on][sections.updates-events-achievements][populate][achievementsImage]=true",
      "populate[sections][on][sections.circulars][populate][circulars]=true",
      "populate[sections][on][sections.important-links-stats][populate][importantLinks]=true",
      "populate[sections][on][sections.important-links-stats][populate][stats]=true",
      "populate[sections][on][sections.documentary-videos][populate][videos]=true",
      "populate[sections][on][sections.partner-logos][populate][partners][populate][image]=true",
    ].join("&");

    fetch(`${import.meta.env.VITE_STRAPI_URL || "http://localhost:1337"}/api/pages?${query}`)
      .then((res) => res.json())
      .then((json) => {
        const fetched = json?.data?.[0]?.sections;
        if (fetched && fetched.length) {
          const heroSection = fetched.find((sec) => sec.__component === "sections.hero-section");
          const firstSlide = heroSection?.slides?.[0];
          if (firstSlide && firstSlide.image) {
            const imgUrl = getStrapiMediaUrl(firstSlide.image);
            const img = new Image();
            img.src = imgUrl;
            img.onload = () => setSections(fetched);
            img.onerror = () => setSections(fetched);
          } else {
            setSections(fetched);
          }
        } else {
          // If no data was returned from Strapi (empty database)
          setSections([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch home page data:", err);
        setSections([]); // Set to empty array on error so loader stops
      });
  }, []);

  const getSection = (name) => sections?.find((sec) => sec.__component === name);

  if (sections === null) {
    return <Loader fullScreen={true} />;
  }

  return (
    <>
      <HeroSection data={getSection("sections.hero-section")} />
      <QuickLinksRow data={getSection("sections.quick-links")} />
      {/* Spacer for the overlapping cards */}
      {/* <div className="h-16 sm:h-24 bg-transparent w-full"></div> */}
      <DepartmentsLeadership data={getSection("sections.departments-leadership")} />
      <AnnouncementsTicker data={getSection("sections.updates-events-achievements")} />

      <Circulars data={getSection("sections.circulars")} />
      <ImportantLinksStats data={getSection("sections.important-links-stats")} />
      <DocumentaryVideos data={getSection("sections.documentary-videos")} />
      <PartnerLogos data={getSection("sections.partner-logos")} />
    </>
  );
}
