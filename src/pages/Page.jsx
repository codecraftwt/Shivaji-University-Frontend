import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPage } from "../lib/strapi";
import Loader from "../components/Loader";

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

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold text-[#212E62] mb-6">{page.title}</h1>
      {page.content && <p className="text-gray-700 leading-relaxed">{page.content}</p>}
    </div>
  );
}
