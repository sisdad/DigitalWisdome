
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

// ============================================================
// API CONFIGURATION
// ============================================================


import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";


// ============================================================
// FALLBACK DATA
// Used when CMS/server is unavailable.
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
  { name: "Contact", path: "/contact" },
];

const FALLBACK_CTA = {
  text: "Advertise With Us",
  url: "/contact",
};

// ============================================================
// SAFE JSON PARSER
// ============================================================

function parseJsonContent(value, fallback = {}) {
  if (!value) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(
      "NAVBAR JSON PARSE ERROR:",
      error
    );

    return fallback;
  }
}

// ============================================================
// IMAGE URL HANDLER
// ============================================================

function getImageUrl(imageUrl) {
  if (
    !imageUrl ||
    typeof imageUrl !== "string"
  ) {
    return "";
  }

  const value = imageUrl.trim();

  if (!value) {
    return "";
  }

  // Absolute URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // Vite source/public image
  if (
    value.startsWith("/src/") ||
    value.startsWith("/assets/")
  ) {
    return value;
  }

  // Server uploaded image
  if (value.startsWith("/")) {
    return `${SERVER_BASE_URL}${value}`;
  }

  // Relative image
  return `${SERVER_BASE_URL}/${value}`;
}

// ============================================================
// NORMALIZE PATH
// ============================================================

function normalizePath(path) {
  if (!path) {
    return "/";
  }

  const cleanPath = path
    .split("?")[0]
    .split("#")[0]
    .replace(/\/+$/, "");

  return cleanPath || "/";
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

        if (
          !result?.success ||
          !result?.data
        ) {
          throw new Error(
            "Invalid navbar CMS response."
          );
        }

        const sections =
          Array.isArray(
            result.data.sections
          )
            ? result.data.sections
            : [];

        // ======================================================
        // SECTION MAP
        // ======================================================

        const sectionMap =
          sections.reduce(
            (acc, section) => {
              if (
                section?.section_key
              ) {
                acc[
                  section.section_key
                ] = section;
              }

              return acc;
            },
            {}
          );

        // ======================================================
        // LOGO
        // ======================================================

        const logoSection =
          sectionMap.logo || {};

        const logoContent =
          parseJsonContent(
            logoSection.content,
            {}
          );

        /*
          IMPORTANT:
          image_url from the CMS database takes priority.
          This allows the Admin CMS uploaded logo to appear
          on the public website.
        */

        const cmsLogo =
          logoSection.image_url ||
          logoContent?.image_url ||
          "";

        const finalLogoUrl =
          getImageUrl(cmsLogo);

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
        // NAVIGATION LINKS
        // ======================================================

        const navigationSection =
          sectionMap.navigation || {};

        const navigationContent =
          parseJsonContent(
            navigationSection.content,
            {}
          );

        const links =
          Array.isArray(
            navigationContent?.links
          ) &&
          navigationContent.links.length > 0
            ? navigationContent.links
            : FALLBACK_LINKS;

        // ======================================================
        // CTA
        // ======================================================

        const ctaSection =
          sectionMap.cta || {};

        const ctaContent =
          parseJsonContent(
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

        // ======================================================
        // UPDATE NAVBAR
        // ======================================================

        if (mounted) {
          setLogoFailed(false);

          setNavbar({
            logo,
            links,
            cta,
          });
        }
      } catch (error) {
        console.error(
          "NAVBAR CMS LOAD ERROR:",
          error
        );

        // ======================================================
        // FALLBACK
        // ======================================================

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
    const currentPath = normalizePath(
      location.pathname
    );

    const linkPath = normalizePath(
      path
    );

    return currentPath === linkPath;
  }

  // ==========================================================
  // LOGO SOURCE
  // ==========================================================

  const logoSource = logoFailed
    ? FALLBACK_LOGO.image_url
    : navbar.logo.image_url;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <header className="fixed left-0 right-0 top-0 z-50">

      {/* ======================================================
          NAVBAR CONTAINER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-5">

        <nav
          className="
            flex items-center justify-between
            rounded-2xl
            border border-white/10
            bg-[#070a0f]/90
            px-4 py-2.5
            shadow-2xl shadow-black/20
            backdrop-blur-xl
            sm:px-5
          "
        >

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to={
              navbar.logo.home_url || "/"
            }
            onClick={closeMenu}
            className="
              flex
              shrink-0
              items-center
              rounded-xl
              outline-none
              transition
              focus-visible:ring-2
              focus-visible:ring-[#1479e8]
            "
          >
            <img
              key={logoSource}
              src={logoSource}
              alt={
                navbar.logo.alt ||
                FALLBACK_LOGO.alt
              }
              className="
                h-11
                w-auto
                max-w-[190px]
                object-contain
                sm:h-12
                sm:max-w-[220px]
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

          <div className="hidden items-center lg:flex">

            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">

              {navbar.links.map(
                (link, index) => {
                  const active =
                    isActive(link.path);

                  return (
                    <Link
                      key={`${link.name}-${link.path}-${index}`}
                      to={link.path || "/"}
                      className={`
                        relative
                        rounded-full
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                            : "text-white/65 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  );
                }
              )}

            </div>

          </div>

          {/* ==================================================
              DESKTOP CTA
          ================================================== */}

          <Link
            to={
              navbar.cta.url ||
              "/contact"
            }
            className="
              hidden
              rounded-full
              bg-[#1479e8]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition-all
              duration-200
              hover:bg-[#0f6ed5]
              hover:shadow-blue-500/30
              lg:block
            "
          >
            {navbar.cta.text}
          </Link>

          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setOpen(
                (previous) =>
                  !previous
              )
            }
            className="
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              p-2.5
              text-white
              transition
              hover:bg-white/10
              lg:hidden
            "
            aria-label={
              open
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={open}
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

        </nav>

        {/* ====================================================
            MOBILE MENU
        ==================================================== */}

        {open && (
          <div
            className="
              mt-2
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#080b10]/98
              p-3
              shadow-2xl
              backdrop-blur-xl
              lg:hidden
            "
          >

            {navbar.links.map(
              (link, index) => {
                const active =
                  isActive(link.path);

                return (
                  <Link
                    key={`${link.name}-${link.path}-${index}`}
                    to={link.path || "/"}
                    onClick={closeMenu}
                    className={`
                      mb-1
                      flex
                      items-center
                      rounded-xl
                      px-4
                      py-3.5
                      text-sm
                      font-medium
                      transition
                      ${
                        active
                          ? "bg-white text-slate-950"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                );
              }
            )}

            {/* ==================================================
                MOBILE CTA
            ================================================== */}

            <Link
              to={
                navbar.cta.url ||
                "/contact"
              }
              onClick={closeMenu}
              className="
                mt-2
                block
                rounded-full
                bg-[#1479e8]
                px-5
                py-3.5
                text-center
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition
                hover:bg-[#0f6ed5]
              "
            >
              {navbar.cta.text}
            </Link>

          </div>
        )}

      </div>
    </header>
  );
}

