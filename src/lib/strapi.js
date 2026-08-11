const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export function getStrapiUrl(path = "") {
  return `${STRAPI_URL}${path}`;
}

export async function fetchApi(path) {
  const url = getStrapiUrl(`/api${path}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(url, { 
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Strapi ${res.status}`);
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
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
    "populate[sections][on][sections.important-links-stats][populate][importantLinks]=true",
    "populate[sections][on][sections.important-links-stats][populate][stats]=true",
    "populate[sections][on][sections.documentary-videos][populate][videos]=true",
    "populate[sections][on][sections.partner-logos][populate][partners][populate][image]=true",
  ].join("&");

  const data = await fetchApi(
    `/pages?${onQueries}`
  );
  const pages = data.data || [];
  
  const normalize = (str) => str ? str.toLowerCase().replace(/_/g, '-') : '';

  const bySlug = pages.find((p) => {
    const pSlug = normalize(p.slug);
    const nSlug = normalize(slug);
    const nParentSlug = normalize(parentSlug);

    if (pSlug === nSlug || pSlug === `/${nSlug}`) return true;
    if (nParentSlug && (pSlug === `/${nParentSlug}/${nSlug}` || pSlug === `${nParentSlug}/${nSlug}`)) return true;
    if (nSlug === "home" && (pSlug === "/" || pSlug === "")) return true;
    return false;
  });

  if (bySlug && bySlug.sections && bySlug.sections.length > 0) return bySlug;
  const withSections = pages.find((p) => p.sections && p.sections.length > 0);
  if (withSections) return withSections;
  return bySlug || pages[0] || null;
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
