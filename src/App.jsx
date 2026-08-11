import { Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import Home from "./pages/Home.jsx";
import Page from "./pages/Page.jsx";
import SubPage from "./pages/SubPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="/pages/:slug" element={<Page />} />
        <Route path="/:parentSlug/:slug" element={<SubPage />} />
      </Route>
    </Routes>
  );
}
