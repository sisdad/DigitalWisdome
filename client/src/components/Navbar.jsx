import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

// ============================================================
// FALLBACK DATA
// ============================================================

const FALLBACK_LOGO = {
  image_url: "/src/assets/digital-wisdom-logo.png",
  alt: "Digital Wisdom Advertising & Promotion",
  home_url: "/",
};

const FALLBACK_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Our Network", path: "/network" },
  { name: "Solutions", path: "/solutions" },
];

const FALLBACK_CTA = {
  text: "Advertise With Us",
  url: "/contact",
};

// ============================================================
// HELPERS
// ============================================================

function parseJsonContent(value, fallback = {}) {
  if (!value) return fallback;

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("NAVBAR JSON PARSE ERROR:", error);
    return fallback;
  }
}

function getImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "";
  }

  const value = imageUrl.trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (
    value.startsWith("/src/") ||
    value.startsWith("/assets/")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${SERVER_BASE_URL}${value}`;
  }

  return `${SERVER_BASE_URL}/${value}`;
}

function normalizePath(path) {
  if (!path) return "/";

  const cleanPath = path
    .split("?")[0]
    .split("#")[0]
    .replace(/\/+$/, "");

  return cleanPath || "/";
}

function removeContactLink(links) {
  if (!Array.isArray(links)) {
    return FALLBACK_LINKS;
  }

  return links.filter((link) => {
    const name = String(link?.name || "").trim().toLowerCase();
    const path = normalizePath(link?.path || "");

    return name !== "contact" && path !== "/contact";
  });
}

// ============================================================
// NAVBAR
// ============================================================

export default function Navbar() {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const [navbar, setNavbar] = useState({
    logo: FALLBACK_LOGO,
    links: FALLBACK_LINKS,
    cta: FALLBACK_CTA,
  });

  const [logoFailed, setLogoFailed] = useState(false);

  // ==========================================================
  // LOAD CMS NAVBAR
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadNavbar() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public-cms/pages/navbar`,
          {
            cache: "no-store",
          }
        );

        let result = null;

        try {
          result = await response.json();
        } catch {
          result = null;
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Navbar request failed: ${response.status}`
          );
        }

        if (!result?.success || !result?.data) {
          throw new Error("Invalid navbar CMS response.");
        }

        const sections = Array.isArray(result.data.sections)
          ? result.data.sections
          : [];

        const sectionMap = sections.reduce((acc, section) => {
          if (section?.section_key) {
            acc[section.section_key] = section;
          }

          return acc;
        }, {});

        // ======================================================
        // LOGO
        // ======================================================

        const logoSection = sectionMap.logo || {};

        const logoContent = parseJsonContent(
          logoSection.content,
          {}
        );

        const cmsLogo =
          logoSection.image_url ||
          logoContent?.image_url ||
          "";

        const finalLogoUrl = getImageUrl(cmsLogo);

        const logo = {
          image_url:
            finalLogoUrl ||
            FALLBACK_LOGO.image_url,

          alt:
            logoContent?.alt ||
            logoSection.title ||
            FALLBACK_LOGO.alt,

          home_url:
            logoContent?.home_url ||
            logoSection.button_url ||
            FALLBACK_LOGO.home_url,
        };

        // ======================================================
        // NAVIGATION
        // Contact is deliberately removed.
        // ======================================================

        const navigationSection =
          sectionMap.navigation || {};

        const navigationContent = parseJsonContent(
          navigationSection.content,
          {}
        );

        const cmsLinks =
          Array.isArray(navigationContent?.links) &&
          navigationContent.links.length > 0
            ? navigationContent.links
            : FALLBACK_LINKS;

        const links = removeContactLink(cmsLinks);

        // ======================================================
        // CTA
        // ======================================================

        const ctaSection = sectionMap.cta || {};

        const ctaContent = parseJsonContent(
          ctaSection.content,
          {}
        );

        const cta = {
          text:
            ctaContent?.text ||
            ctaSection.button_text ||
            FALLBACK_CTA.text,

          url:
            ctaContent?.url ||
            ctaSection.button_url ||
            FALLBACK_CTA.url,
        };

        if (mounted) {
          setLogoFailed(false);

          setNavbar({
            logo,
            links,
            cta,
          });
        }
      } catch (error) {
        console.error("NAVBAR CMS LOAD ERROR:", error);

        if (mounted) {
          setNavbar({
            logo: FALLBACK_LOGO,
            links: FALLBACK_LINKS,
            cta: FALLBACK_CTA,
          });
        }
      }
    }

    loadNavbar();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // CLOSE MOBILE MENU
  // ==========================================================

  function closeMenu() {
    setOpen(false);
  }

  // ==========================================================
  // ACTIVE LINK
  // ==========================================================

  function isActive(path) {
    const currentPath = normalizePath(location.pathname);
    const linkPath = normalizePath(path);

    return currentPath === linkPath;
  }

  // ==========================================================
  // LOGO
  // ==========================================================

  const logoSource = logoFailed
    ? FALLBACK_LOGO.image_url
    : navbar.logo.image_url;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Very subtle premium glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 rounded-full bg-[#1479e8]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1500px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-5">

        {/* Main navigation */}
        <nav
          className="
            relative
            flex
            min-h-[76px]
            items-center
            justify-between
            rounded-[22px]
            border
            border-white/[0.12]
            bg-black/80
            px-4
            py-2
            shadow-2xl
            shadow-black/40
            backdrop-blur-2xl
            sm:px-5
            lg:min-h-[82px]
            lg:px-7
          "
        >
          {/* Soft inner highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/[0.045] to-transparent" />

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to={navbar.logo.home_url || "/"}
            onClick={closeMenu}
            className="
              group
              relative
              z-10
              flex
              shrink-0
              items-center
              outline-none
              transition-transform
              duration-300
              focus-visible:ring-2
              focus-visible:ring-[#63b1ff]
            "
          >
            <div className="pointer-events-none absolute -inset-5 rounded-3xl bg-[#1479e8]/10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

            <img
              key={logoSource}
              src={logoSource}
              alt={
                navbar.logo.alt ||
                FALLBACK_LOGO.alt
              }
              className="
                relative
                h-[58px]
                w-auto
                max-w-[230px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-[1.025]
                sm:h-[64px]
                sm:max-w-[260px]
                lg:h-[72px]
                lg:max-w-[300px]
              "
              onError={(event) => {
                console.error(
                  "NAVBAR LOGO LOAD ERROR:",
                  event.currentTarget.src
                );

                setLogoFailed(true);
              }}
            />
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden lg:flex lg:items-center">
            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                border
                border-white/[0.09]
                bg-white/[0.035]
                p-1
              "
            >
              {navbar.links.map((link, index) => {
                const active = isActive(link.path);

                return (
                  <Link
                    key={`${link.name}-${link.path}-${index}`}
                    to={link.path || "/"}
                    className={`
                      relative
                      rounded-full
                      px-5
                      py-3
                      text-[13px]
                      font-bold
                      tracking-[0.01em]
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-white text-black shadow-lg shadow-black/20"
                          : "text-white/55 hover:bg-white/[0.08] hover:text-white"
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#1479e8]" />
                    )}

                    <span className="relative">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              ADVERTISE WITH US
          ================================================== */}

          <Link
            to={navbar.cta.url || "/contact"}
            className="
              group
              relative
              hidden
              items-center
              gap-3
              overflow-hidden
              rounded-full
              bg-[#1479e8]
              px-5
              py-3.5
              text-sm
              font-black
              text-white
              shadow-xl
              shadow-[#1479e8]/20
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#2184ee]
              hover:shadow-[#1479e8]/35
              lg:flex
            "
          >
            <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

            <span className="relative">
              {navbar.cta.text || "Advertise With Us"}
            </span>

            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>

          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            className="
              relative
              z-10
              rounded-xl
              border
              border-white/10
              bg-white/[0.05]
              p-3
              text-white
              transition-all
              duration-300
              hover:border-[#1479e8]/40
              hover:bg-[#1479e8]/10
              lg:hidden
            "
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* ====================================================
            MOBILE MENU
        ==================================================== */}

        {open && (
          <div
            className="
              relative
              mt-3
              overflow-hidden
              rounded-[22px]
              border
              border-white/10
              bg-black/95
              p-3
              shadow-2xl
              shadow-black/50
              backdrop-blur-2xl
              lg:hidden
            "
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#1479e8]/10 blur-3xl" />

            <div className="relative space-y-1">
              {navbar.links.map((link, index) => {
                const active = isActive(link.path);

                return (
                  <Link
                    key={`${link.name}-${link.path}-${index}`}
                    to={link.path || "/"}
                    onClick={closeMenu}
                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3.5
                      text-sm
                      font-bold
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-white text-black"
                          : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                      }
                    `}
                  >
                    <span>{link.name}</span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1479e8]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA only */}
            <Link
              to={navbar.cta.url || "/contact"}
              onClick={closeMenu}
              className="
                group
                relative
                mt-3
                flex
                items-center
                justify-center
                gap-3
                overflow-hidden
                rounded-full
                bg-[#1479e8]
                px-5
                py-3.5
                text-center
                text-sm
                font-black
                text-white
                shadow-xl
                shadow-[#1479e8]/20
                transition-all
                duration-300
                hover:bg-[#2184ee]
              "
            >
              <span className="relative">
                {navbar.cta.text || "Advertise With Us"}
              </span>

              <ArrowRight
                size={17}
                className="relative transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
