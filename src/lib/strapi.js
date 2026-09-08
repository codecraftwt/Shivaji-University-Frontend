const STRAPI_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_STRAPI_URL) ||
  "https://shivaji-university-strapi.onrender.com";

export function getStrapiUrl(path = "") {
  return `${STRAPI_URL}${path}`;
}

const apiMemoryCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function fetchApi(path) {
  const cacheKey = path;
  const now = Date.now();

  // 1. Check in-memory cache
  if (apiMemoryCache.has(cacheKey)) {
    const { timestamp, data } = apiMemoryCache.get(cacheKey);
    if (now - timestamp < CACHE_TTL_MS) {
      return data;
    }
  }

  // 2. Check browser sessionStorage
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(`strapi_v3_${cacheKey}`);
      if (stored) {
        const { timestamp, data } = JSON.parse(stored);
        if (now - timestamp < CACHE_TTL_MS) {
          apiMemoryCache.set(cacheKey, { timestamp, data });
          return data;
        }
      }
    } catch (_) { }
  }

  const url = getStrapiUrl(`/api${path}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Strapi ${res.status}`);
    const data = await res.json();

    // Cache successful response
    apiMemoryCache.set(cacheKey, { timestamp: now, data });
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(
          `strapi_v3_${cacheKey}`,
          JSON.stringify({ timestamp: now, data })
        );
      } catch (_) { }
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    // Return stale cache if available
    if (apiMemoryCache.has(cacheKey)) {
      return apiMemoryCache.get(cacheKey).data;
    }
    throw error;
  }
}

export async function getHeader() {
  const data = await fetchApi("/header?populate[logo]=true");
  return data.data;
}

export async function getFooter() {
  const data = await fetchApi("/footer?populate[columns][populate][links]=true&populate[socialLinks]=true&populate[quickLinks]=true&populate[logoImage]=true");
  return data.data;
}

export async function getNavItems() {
  const data = await fetchApi(
    "/nav-items?sort=order:asc&populate[parent]=true&populate[children]=true"
  );
  return data.data;
}

export async function getMainNavbar() {
  const data = await fetchApi(
    "/main-navbar?populate[menu_items][populate][dropdown_items][populate][sub_items]=*"
  );
  return data.data;
}

export async function getPage(slug, parentSlug) {
  const onQueries = [
    "populate[sections][on][sections.reaching-kolhapur-city][populate][reaching_type]=true",
    "populate[sections][on][sections.tourist-interest-prime-attractions][populate][Prime_attractions][populate][items][populate][image]=true",
    "populate[sections][on][sections.hero-banner][populate][image]=true",
    "populate[sections][on][sections.content-with-image][populate][image]=true",
    "populate[sections][on][sections.image-grid][populate][items][populate][image]=true",
    "populate[sections][on][sections.hero-section][populate][slides][populate][image]=true",
    "populate[sections][on][sections.about-content][populate][image]=true",
    "populate[sections][on][sections.about-rit][populate][image]=true",
    "populate[sections][on][sections.stats-counter][populate][stats]=true",
    "populate[sections][on][sections.vision-mission][populate][visionImage]=true",
    "populate[sections][on][sections.vision-mission][populate][missionImage]=true",
    "populate[sections][on][sections.departments-leadership][populate][leadership][populate][image]=true",
    "populate[sections][on][sections.departments-leadership][populate][departments]=true",
    "populate[sections][on][sections.updates-events-achievements][populate][updates]=true",
    "populate[sections][on][sections.updates-events-achievements][populate][events]=true",
    "populate[sections][on][sections.updates-events-achievements][populate][achievements]=true",
    "populate[sections][on][sections.updates-events-achievements][populate][updatesImage]=true",
    "populate[sections][on][sections.updates-events-achievements][populate][eventsImage]=true",
    "populate[sections][on][sections.updates-events-achievements][populate][achievementsImage]=true",
    "populate[sections][on][sections.quick-links][populate][links]=true",
    "populate[sections][on][sections.circulars][populate][circulars]=true",
    "populate[sections][on][sections.important-links-stats][populate][importantLinks][populate][image]=true",
    "populate[sections][on][sections.important-links-stats][populate][stats]=true",
    "populate[sections][on][sections.documentary-videos][populate][videos]=true",
    "populate[sections][on][sections.partner-logos][populate][partners][populate][image]=true",
    "populate[sections][on][sections.contact-information][populate][info]=true",
  ].join("&");

  // Build targeted slug candidates to fetch only what is needed
  const slugCandidates = [
    slug,
    `/${slug}`,
    slug?.toLowerCase(),
    slug?.toUpperCase(),
    slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : null,
    slug ? slug.replace(/_/g, '-') : null,
    slug ? slug.replace(/-/g, '_') : null,
    parentSlug ? `${parentSlug}/${slug}` : null,
    parentSlug ? `/${parentSlug}/${slug}` : null,
    slug?.includes("reach") ? "About-Kolhapur" : null,
    slug?.includes("reach") ? "/about-suk/about-kolhapur" : null,
  ].filter(Boolean);

  const filterParams = slugCandidates
    .map((s, i) => `filters[slug][$in][${i}]=${encodeURIComponent(s)}`)
    .join("&");

  // First attempt fast targeted fetch
  let data = await fetchApi(`/pages?${filterParams}&${onQueries}`);
  let pages = data?.data || [];

  // If targeted fetch did not return any page, fallback to full fetch
  if (pages.length === 0) {
    data = await fetchApi(`/pages?${onQueries}`);
    pages = data?.data || [];
  }

  const normalize = (str) => str ? str.toLowerCase().replace(/_/g, '-') : '';
  const nSlug = normalize(slug);
  const nParentSlug = normalize(parentSlug);

  // 1. First priority: Special page aliases with guaranteed populated sections
  if (nSlug === "how-to-reach-suk" || nSlug === "how-to-reach" || nSlug.includes("reach")) {
    const reachPage = pages.find(
      (p) =>
        p.documentId === "gsrdx141an1rqsi0a1l9un57" ||
        p.sections?.some((s) => s.__component === "sections.reaching-kolhapur-city")
    );
    if (reachPage) return reachPage;
  }

  if (nSlug.includes("map") || nSlug.includes("google-map")) {
    const mapPage = pages.find(
      (p) =>
        p.slug === "university-map" ||
        p.documentId === "a1ffx89iq6dmxa7xgrmu3hb6" ||
        normalize(p.title).includes("map")
    );
    if (mapPage) return mapPage;
  }

  if (nSlug.includes("kolhapur")) {
    const kolhapurPage = pages.find(
      (p) =>
        p.documentId === "gsrdx141an1rqsi0a1l9un57" ||
        p.slug === "About-Kolhapur" ||
        (p.sections && p.sections.length > 1)
    );
    if (kolhapurPage) return kolhapurPage;
  }

  if (nSlug === "about-suk" || nSlug === "about-university") {
    const aboutUnivPage = pages.find(
      (p) =>
        p.slug === "about-suk" ||
        p.documentId === "d9fqien3ktfmi9drt0vhptsu" ||
        normalize(p.title).includes("about university")
    );
    if (aboutUnivPage) return aboutUnivPage;
  }

  if (nSlug === "contact" || nSlug === "contact-us" || nSlug.includes("contact")) {
    const contactPage = pages.find(
      (p) =>
        p.slug === "contact" ||
        p.documentId === "o819vnaik6s6l9g7ne2zzvr2" ||
        normalize(p.title).includes("contact")
    );
    if (contactPage) return contactPage;
  }

  // 2. Second priority: Exact slug match (e.g. 'About-Kolhapur' when slug is 'about-kolhapur')
  const exactSlugCandidates = pages.filter((p) => {
    const pSlug = normalize(p.slug);
    if (nSlug === "home" && (pSlug === "/" || pSlug === "")) return true;
    return pSlug === nSlug || pSlug === `/${nSlug}`;
  });
  const exactWithSections = exactSlugCandidates.find((p) => p.sections && p.sections.length > 0);
  if (exactWithSections) return exactWithSections;
  if (exactSlugCandidates.length > 0) return exactSlugCandidates[0];

  // 3. Third priority: Hierarchical slug match (e.g. '/about-suk/about-kolhapur')
  if (nParentSlug) {
    const hierarchicalCandidates = pages.filter((p) => {
      const pSlug = normalize(p.slug);
      return pSlug === `/${nParentSlug}/${nSlug}` || pSlug === `${nParentSlug}/${nSlug}`;
    });
    const hierWithSections = hierarchicalCandidates.find((p) => p.sections && p.sections.length > 0);
    if (hierWithSections) return hierWithSections;
    if (hierarchicalCandidates.length > 0) return hierarchicalCandidates[0];
  }

  // 4. Fallback to candidate matching slug ending
  const fallback = pages.find((p) => {
    const pSlug = normalize(p.slug);
    return pSlug.endsWith(`/${nSlug}`) || pSlug.endsWith(nSlug);
  });
  if (fallback) return fallback;

  return pages[0] || null;
}

export function resolveHref(itemOrHref, label = "") {
  let href = typeof itemOrHref === "string" ? itemOrHref : itemOrHref?.href;
  let text = typeof itemOrHref === "object" ? (itemOrHref?.label || label) : label;

  href = href?.trim() || "";
  text = text?.trim()?.toLowerCase() || "";

  // If already a specific internal route (not just '#' or empty)
  if (href && href !== "#" && href !== "" && !href.startsWith("http")) {
    return href;
  }
  if (href && href.startsWith("http")) {
    return href;
  }

  // Map by label keyword
  if (
    text.includes("google map") ||
    text.includes("campus map") ||
    text === "map" ||
    text.includes("suk google map") ||
    text.includes("university map")
  ) {
    return "/about-suk/university-map";
  }
  if (text === "about university" || text === "about suk") {
    return "/about-suk";
  }
  if (text.includes("about kolhapur") || text === "kolhapur") {
    return "/about-suk/about-kolhapur";
  }
  if (text === "contact information" || text.includes("contact us") || text === "contact") {
    return "/contact";
  }
  if (text === "how to reach suk" || text.includes("how to reach")) {
    return "/about-suk/how-to-reach-suk";
  }
  if (text.includes("facilities")) {
    return "/facilities";
  }
  if (text.includes("academics")) {
    return "/academics";
  }
  if (text.includes("admissions") || text.includes("admission")) {
    return "/admissions";
  }
  if (text.includes("students")) {
    return "/students";
  }
  if (text.includes("research")) {
    return "/research";
  }

  return href || "#";
}

export function getStrapiMediaUrl(media) {
  if (!media) return null;

  // Handle array of media
  if (Array.isArray(media)) {
    if (media.length === 0) return null;
    media = media[0];
  }

  // Handle nested 'data' or 'attributes' (Strapi v4 structures)
  let obj = media;
  if (obj.data) {
    if (Array.isArray(obj.data)) {
      if (obj.data.length === 0) return null;
      obj = obj.data[0];
    } else {
      obj = obj.data;
    }
  }
  if (obj.attributes) {
    obj = obj.attributes;
  }

  if (typeof obj === 'string') {
    if (obj.startsWith("http")) return obj;
    return getStrapiUrl(obj);
  }

  const url = obj.url || obj?.formats?.large?.url || obj?.formats?.medium?.url || obj?.formats?.thumbnail?.url;

  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return getStrapiUrl(url);
}

// Build tree from flat list
export function buildNavTree(items) {
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  items.forEach((item) => {
    if (item.parent && map[item.parent.id]) {
      map[item.parent.id].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
}
