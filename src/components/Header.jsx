import { useEffect, useState } from "react";
import { getHeader, getNavItems, getStrapiMediaUrl } from "../lib/strapi";
import HeaderClient from "./HeaderClient.jsx";

export default function Header() {
  const [header, setHeader] = useState(null);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getHeader().catch(() => null),
      getNavItems().catch(() => []),
    ]).then(([h, n]) => {
      if (!mounted) return;
      setHeader(h);
      setNavItems(n);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const logoUrl = getStrapiMediaUrl(header?.logo);
  const rightLogoUrl = getStrapiMediaUrl(header?.rightLogo);

  return <HeaderClient header={header} logoUrl={logoUrl} rightLogoUrl={rightLogoUrl} navItems={navItems} />;
}
