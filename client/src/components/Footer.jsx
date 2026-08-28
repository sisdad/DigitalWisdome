
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import logo from "../assets/digital-wisdom-logo.png";


import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";


function parseContent(content) {
  if (!content) {
    return {};
  }

  if (typeof content === "object") {
    return content;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("FOOTER CMS CONTENT PARSE ERROR:", error);
    return {};
  }
}

export default function Footer() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD FOOTER FROM PUBLIC CMS
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function loadFooterPage() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public-cms/pages/footer`
        );

        if (!response.ok) {
          throw new Error(
            `Footer CMS request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        if (mounted && result?.success) {
          setCmsPage(result.data);
        }
      } catch (error) {
        console.error("FOOTER CMS LOAD ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFooterPage();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // ORGANIZE CMS SECTIONS
  // ============================================================

  const sections = useMemo(() => {
    const list = cmsPage?.sections || [];

    return list.reduce((acc, section) => {
      acc[section.section_key] = section;
      return acc;
    }, {});
  }, [cmsPage]);

  // ============================================================
  // BRAND SECTION
  // ============================================================

  const brand = sections.brand || {};

  const brandContent = useMemo(
    () => parseContent(brand.content),
    [brand.content]
  );

  const brandTitle =
    brand.title || "Digital Wisdom";

  const brandDescription =
    brand.description || "";

  const logoUrl =
    brandContent.logo_url ||
    brand.image_url ||
    logo;

  const logoAlt =
    brandContent.logo_alt ||
    brand.title ||
    "Digital Wisdom";

  const homeUrl =
    brandContent.home_url ||
    brand.button_url ||
    "/";

  // ============================================================
  // CONTACT SECTION
  //
  // IMPORTANT:
  // Phone, email and location come ONLY from CMS.
  // No hard-coded contact information.
  // ============================================================

  const contact = sections.contact || {};

  const contactContent = useMemo(
    () => parseContent(contact.content),
    [contact.content]
  );

  const contactTitle =
    contact.title || "";

  const phone =
    contactContent.phone || "";

  const email =
    contactContent.email || "";

  const location =
    contactContent.location || "";

  // ============================================================
  // NAVIGATION SECTION
  // ============================================================

  const navigation = sections.navigation || {};

  const navigationContent = useMemo(
    () => parseContent(navigation.content),
    [navigation.content]
  );

  const navigationEyebrow =
    navigation.eyebrow || "Navigation";

  const navigationTitle =
    navigation.title || "";

  const links = Array.isArray(navigationContent.links)
    ? navigationContent.links
    : [];

  // ============================================================
  // CTA SECTION
  // ============================================================

  const cta = sections.cta || {};

  const ctaContent = useMemo(
    () => parseContent(cta.content),
    [cta.content]
  );

  const ctaText =
    ctaContent.text ||
    cta.button_text ||
    "";

  const ctaUrl =
    ctaContent.url ||
    cta.button_url ||
    "/contact";

  // ============================================================
  // COPYRIGHT SECTION
  // ============================================================

  const copyright = sections.copyright || {};

  const copyrightContent = useMemo(
    () => parseContent(copyright.content),
    [copyright.content]
  );

  const copyrightText =
    copyrightContent.text ||
    copyright.description ||
    "";

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <footer className="border-t border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
        </div>
      </footer>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <footer className="border-t border-white/10 bg-[#05070a]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">

          {/* ====================================================
              BRAND
          ==================================================== */}

          <div>
            <Link
              to={homeUrl}
              className="inline-flex items-center"
            >
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
              {brandDescription}
            </p>

            {ctaText && (
              <Link
                to={ctaUrl}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1479e8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1479e8]/20 transition hover:bg-[#0f6ed5]"
              >
                {ctaText}
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>

          {/* ====================================================
              NAVIGATION
          ==================================================== */}

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5fa8f5]">
              {navigationEyebrow}
            </div>

            {navigationTitle && (
              <div className="mt-2 text-sm text-white/30">
                {navigationTitle}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={`${link.name}-${link.path}`}
                  to={link.path}
                  className="text-sm text-white/45 transition hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ====================================================
              CONTACT
          ==================================================== */}

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5fa8f5]">
              {contact.eyebrow || "Contact"}
            </div>

            {contactTitle && (
              <div className="mt-2 text-sm text-white/30">
                {contactTitle}
              </div>
            )}

            <div className="mt-6 space-y-4 text-sm text-white/40">

              {/* PHONE — CMS ONLY */}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="block transition hover:text-white"
                >
                  {phone}
                </a>
              )}

              {/* EMAIL — CMS ONLY */}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block transition hover:text-white"
                >
                  {email}
                </a>
              )}

              {/* LOCATION — CMS ONLY */}
              {location && (
                <p>
                  {location}
                </p>
              )}

            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM
        ====================================================== */}

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/25">
            {copyrightText}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1479e8]" />

            {cta.description ||
              brandTitle}
          </div>
        </div>

      </div>
    </footer>
  );
}

