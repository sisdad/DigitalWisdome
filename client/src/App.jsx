import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Network from "./pages/Network";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";

import AdminLogin from "./admin/AdminLogin";
import AdminInquiries from "./admin/AdminInquiries";
import AdminDashboard from "./admin/AdminDashboard";
import AdminCms from "./admin/AdminCms";
import AdminCmsPages from "./admin/AdminCmsPages";
import AdminCmsSections from "./admin/AdminCmsSections";
import AdminCmsLocations from "./admin/AdminCmsLocations";
import AdminCmsCampaignProcess from "./admin/AdminCmsCampaignProcess";
import AdminCmsBenefits from "./admin/AdminCmsBenefits";
import AdminCmsSolutions from "./admin/AdminCmsSolutions";
import AdminCmsSettings from "./admin/AdminCmsSettings";

import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>

          {/* ================================================== */}
          {/* PUBLIC WEBSITE */}
          {/* ================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/network"
            element={<Network />}
          />

          <Route
            path="/solutions"
            element={<Solutions />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ================================================== */}
          {/* ADMIN LOGIN */}
          {/* ================================================== */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* ================================================== */}
          {/* PROTECTED ADMIN AREA */}
          {/* ================================================== */}

          <Route element={<ProtectedAdminRoute />}>

            {/* ================================================== */}
            {/* ADMIN DASHBOARD */}
            {/* ================================================== */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* ================================================== */}
            {/* INQUIRIES */}
            {/* ================================================== */}

            <Route
              path="/admin/inquiries"
              element={<AdminInquiries />}
            />

            {/* ================================================== */}
            {/* CMS HOME */}
            {/* ================================================== */}

            <Route
              path="/admin/cms"
              element={<AdminCms />}
            />

            {/* ================================================== */}
            {/* CMS PAGES */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/pages"
              element={<AdminCmsPages />}
            />

            {/* ================================================== */}
            {/* CMS PAGE SECTIONS */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/pages/:pageId/sections"
              element={<AdminCmsSections />}
            />

            {/* ================================================== */}
            {/* CMS LOCATIONS */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/locations"
              element={<AdminCmsLocations />}
            />

            {/* ================================================== */}
            {/* CMS CAMPAIGN PROCESS */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/campaign-process"
              element={<AdminCmsCampaignProcess />}
            />

            {/* ================================================== */}
            {/* CMS BENEFITS */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/benefits"
              element={<AdminCmsBenefits />}
            />

            {/* ================================================== */}
            {/* CMS SOLUTIONS */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/solutions"
              element={<AdminCmsSolutions />}
            />

            {/* ================================================== */}
            {/* CMS SITE SETTINGS */}
            {/* ================================================== */}

            <Route
              path="/admin/cms/settings"
              element={<AdminCmsSettings />}
            />

          </Route>

        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;