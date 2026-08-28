
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  MonitorPlay,
  MoveRight,
  Play,
  Sparkles,
  Target,
  Users,
  Zap,
  Building2,
  Hotel,
  MapPin,
  ShoppingBag,
  Store,
  Utensils,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getPublicPage,
  getPublicLocations,
} from "../api/publicCmsApi";

// ============================================================
// SERVER CONFIGURATION
// ============================================================

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

// ============================================================
// LOCATION ICON MAPPING
// ============================================================

const locationIcons = {
  Building2,
  Hotel,
  MapPin,
  ShoppingBag,
  Store,
  Utensils,
};

// ============================================================
// SAFE JSON PARSER
// ============================================================

function parseJsonContent(value, fallback = null) {
  if (!value) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("HOME CMS JSON PARSE WARNING:", error);
    return fallback;
  }
}

// ============================================================
// CMS IMAGE URL
// ============================================================

function getCmsImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "";
  }

  const value = imageUrl.trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${SERVER_BASE_URL}${value}`;
  }

  return `${SERVER_BASE_URL}/${value}`;
}

// ============================================================
// CMS IMAGE COMPONENT
// ============================================================

function CmsImage({
  src,
  alt,
  className = "",
  ...props
}) {
  const [failed, setFailed] = useState(false);

  const imageUrl = getCmsImageUrl(src);

  if (!imageUrl || failed) {
    return null;
  }

  return (
    <img
      src={imageUrl}
      alt={alt || "Digital Wisdom"}
      className={className}
      onError={() => {
        console.error(
          "HOME CMS IMAGE LOAD ERROR:",
          imageUrl
        );

        setFailed(true);
      }}
      {...props}
    />
  );
}

// ============================================================
// HOME PAGE
// ============================================================

export default function Home() {
  // ==========================================================
  // CMS PAGE
  // ==========================================================

  const [cmsPage, setCmsPage] = useState(null);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsError, setCmsError] = useState("");

  // ==========================================================
  // LOCATIONS
  // ==========================================================

  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  // ==========================================================
  // LOAD HOME CMS DATA
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadHomeCms() {
      try {
        setCmsLoading(true);
        setCmsError("");

        const response = await getPublicPage("home");

        /*
         * API helper normally returns:
         *
         * {
         *   success: true,
         *   data: {...}
         * }
         *
         * But this also safely supports:
         *
         * {...page data...}
         */

        const pageData =
          response?.data ||
          response;

        if (!pageData) {
          throw new Error(
            "Home page CMS data is empty."
          );
        }

        if (mounted) {
          setCmsPage(pageData);
        }
      } catch (error) {
        console.error(
          "HOME CMS LOAD ERROR:",
          error
        );

        if (mounted) {
          setCmsError(
            error?.message ||
              "Unable to load Home CMS content."
          );
        }
      } finally {
        if (mounted) {
          setCmsLoading(false);
        }
      }
    }

    loadHomeCms();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // LOAD LOCATIONS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadLocations() {
      try {
        setLocationsLoading(true);

        const response =
          await getPublicLocations();

        const locationData =
          response?.data ||
          response;

        if (mounted) {
          setLocations(
            Array.isArray(locationData)
              ? locationData
              : []
          );
        }
      } catch (error) {
        console.error(
          "HOME LOCATIONS LOAD ERROR:",
          error
        );

        if (mounted) {
          setLocations([]);
        }
      } finally {
        if (mounted) {
          setLocationsLoading(false);
        }
      }
    }

    loadLocations();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // CMS SECTIONS
  // ==========================================================

  const sections = {};

  const cmsSections =
    Array.isArray(cmsPage?.sections)
      ? cmsPage.sections
      : [];

  cmsSections.forEach((section) => {
    if (section?.section_key) {
      sections[section.section_key] =
        section;
    }
  });

  // ==========================================================
  // HERO
  // ==========================================================

  const hero =
    sections.hero || {};

  const heroEyebrow =
    hero.eyebrow ||
    "Digital Advertising & Promotion";

  const heroTitle =
    hero.title ||
    "Make your brand visible.";

  const heroDescription =
    hero.description ||
    "Digital Wisdom helps businesses connect with audiences through strategically positioned digital advertising screens and innovative promotional solutions.";

  const heroButtonText =
    hero.button_text ||
    "Advertise With Us";

  const heroButtonUrl =
    hero.button_url ||
    "/contact";

  const heroImage =
    hero.image_url || "";

  const heroContent =
    parseJsonContent(
      hero.content,
      {}
    );

  const secondaryButtonText =
    heroContent?.secondary_button_text ||
    "Explore Our Network";

  const secondaryButtonUrl =
    heroContent?.secondary_button_url ||
    "#network";

  const displayQuality =
    heroContent?.display_quality ||
    "4K";

  const screenSize =
    heroContent?.screen_size ||
    '32"';

  const visibility =
    heroContent?.visibility ||
    "24/7";

  const screenBadgeTitle =
    heroContent?.screen_badge_title ||
    "High Engagement";

  const screenBadgeText =
    heroContent?.screen_badge_text ||
    "Strategic digital placement";

  const screenLabel =
    heroContent?.screen_label ||
    "Advertising that gets noticed";

  const screenTitle =
    heroContent?.screen_title ||
    "Be seen. Be remembered.";

  const screenCampaignText =
    heroContent?.screen_campaign_text ||
    "Dynamic digital campaigns";

  const screenStatus =
    heroContent?.screen_status ||
    "Digital Network Active";

  // ==========================================================
  // ABOUT
  // ==========================================================

  const about =
    sections.about_preview || {};

  const aboutEyebrow =
    about.eyebrow ||
    "About Digital Wisdom";

  const aboutTitle =
    about.title ||
    "Connecting brands with people.";

  const aboutDescription =
    about.description ||
    "Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.";

  const aboutContent =
    about.content ||
    "We connect brands with consumers through strategically positioned digital advertising environments, helping businesses communicate their message at the right place and the right time.";

  const aboutButtonText =
    about.button_text ||
    "Discover Digital Wisdom";

  const aboutButtonUrl =
    about.button_url ||
    "/about";

  const aboutImage =
    about.image_url || "";

  // ==========================================================
  // NETWORK
  // ==========================================================

  const networkIntro =
    sections.network_intro || {};

  const networkEyebrow =
    networkIntro.eyebrow ||
    "Our Digital Network";

  const networkTitle =
    networkIntro.title ||
    "Your message, where attention happens.";

  const networkDescription =
    networkIntro.description ||
    "Strategically positioned digital screens designed to place your brand in high-engagement environments.";

  const networkButtonText =
    networkIntro.button_text ||
    "View Our Full Network";

  const networkButtonUrl =
    networkIntro.button_url ||
    "/network";

  const networkImage =
    networkIntro.image_url || "";

  const networkContent =
    networkIntro.content || "";

  // ==========================================================
  // SOLUTIONS
  // ==========================================================

  const solutionsIntro =
    sections.solutions_intro || {};

  const solutionsEyebrow =
    solutionsIntro.eyebrow ||
    "Advertising Solutions";

  const solutionsTitle =
    solutionsIntro.title ||
    "Make your brand impossible to ignore.";

  const solutionsDescription =
    solutionsIntro.description ||
    "Deliver dynamic visual campaigns directly to consumers through premium digital advertising environments.";

  const solutionsButtonText =
    solutionsIntro.button_text ||
    "Explore advertising solutions";

  const solutionsButtonUrl =
    solutionsIntro.button_url ||
    "/solutions";

  const solutionsImage =
    solutionsIntro.image_url || "";

  const defaultSolutions = [
    "Video Advertising",
    "Image Advertising",
    "Product Launches",
    "Brand Campaigns",
    "Promotional Messages",
    "Seasonal Campaigns",
    "Targeted Advertising",
    "Corporate Communication",
  ];

  const parsedSolutions =
    parseJsonContent(
      solutionsIntro.content,
      defaultSolutions
    );

  const solutionsItems =
    Array.isArray(parsedSolutions)
      ? parsedSolutions
      : defaultSolutions;

  // ==========================================================
  // PHILOSOPHY
  // ==========================================================

  const philosophy =
    sections.philosophy || {};

  const philosophyEyebrow =
    philosophy.eyebrow ||
    "Our Advertising Philosophy";

  const philosophyTitle =
    philosophy.title ||
    "Right place. Right message.";

  const philosophyDescription =
    philosophy.description ||
    "Effective advertising connects the right location, audience, message, and timing.";

  const philosophyImage =
    philosophy.image_url || "";

  const defaultPillars = [
    {
      number: "01",
      title: "Right Location",
      text: "Strategic environments with strong consumer footfall.",
    },
    {
      number: "02",
      title: "Right Audience",
      text: "Connect your brand with people in relevant environments.",
    },
    {
      number: "03",
      title: "Right Message",
      text: "Creative visual content designed to capture attention.",
    },
    {
      number: "04",
      title: "Right Time",
      text: "Flexible digital campaigns delivered when they matter.",
    },
  ];

  const parsedPillars =
    parseJsonContent(
      philosophy.content,
      defaultPillars
    );

  const philosophyPillars =
    Array.isArray(parsedPillars)
      ? parsedPillars
      : defaultPillars;

  const philosophyIcons = [
    Target,
    Users,
    Sparkles,
    Zap,
  ];

  // ==========================================================
  // VISION
  // ==========================================================

  const vision =
    sections.vision || {};

  const visionEyebrow =
    vision.eyebrow ||
    "Our Vision";

  const visionTitle =
    vision.title ||
    "From Ethiopia to East Africa.";

  const visionDescription =
    vision.description ||
    "To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.";

  const visionContent =
    vision.content ||
    "Building the future of digital advertising";

  const visionImage =
    vision.image_url || "";

  // ==========================================================
  // CTA
  // ==========================================================

  /*
   * Your current Home CMS API response does NOT contain a
   * "cta" section yet.
   *
   * Therefore these remain safe fallbacks until a CTA section
   * is added through the CMS.
   */

  const cta =
    sections.cta || {};

  const ctaEyebrow =
    cta.eyebrow ||
    "Ready to be seen?";

  const ctaTitle =
    cta.title ||
    "Put your brand where attention happens.";

  const ctaDescription =
    cta.description ||
    "Let's create a digital advertising campaign that puts your message in front of the right audience.";

  const ctaButtonText =
    cta.button_text ||
    "Start Your Campaign";

  const ctaButtonUrl =
    cta.button_url ||
    "/contact";

  const ctaImage =
    cta.image_url || "";

  // ==========================================================
  // LOADING
  // ==========================================================

  if (cmsLoading) {
    return (
      <div className="min-h-screen bg-[#05070a] text-white">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-5 pt-32">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#1479e8]" />

            <p className="mt-5 text-sm text-white/40">
              Loading Digital Wisdom...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================================
  // CMS ERROR
  // ==========================================================

  if (!cmsPage) {
    return (
      <div className="min-h-screen bg-[#05070a] text-white">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-5 pt-32">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <Zap
                size={24}
                className="text-red-400"
              />
            </div>

            <h1 className="mt-6 text-2xl font-semibold">
              Unable to load website content
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/40">
              {cmsError ||
                "The Home CMS page could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-7 rounded-full bg-[#1479e8] px-6 py-3 text-sm font-semibold transition hover:bg-[#0f6ed5]"
            >
              Try Again
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(20,121,232,0.20),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(20,121,232,0.08),transparent_28%),linear-gradient(90deg,#05070a_5%,rgba(5,7,10,0.82)_48%,rgba(5,7,10,0.38))]" />

          <div className="absolute right-[-10%] top-[10%] h-[550px] w-[550px] rounded-full bg-[#1479e8]/[0.07] blur-3xl" />

          <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#1479e8]/[0.045] blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-5 pb-20 pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          {/* HERO CONTENT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="flex flex-col justify-center"
          >
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">
              <span className="h-px w-10 bg-[#1479e8]" />

              {heroEyebrow}
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
              {heroTitle}
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
              {heroDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={heroButtonUrl}
                className="group flex items-center justify-center gap-3 rounded-full bg-[#1479e8] px-7 py-4 font-semibold text-white shadow-xl shadow-[#1479e8]/20 transition duration-300 hover:scale-[1.02] hover:bg-[#0f6ed5]"
              >
                {heroButtonText}

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href={secondaryButtonUrl}
                className="flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-4 font-semibold backdrop-blur transition duration-300 hover:border-[#1479e8]/40 hover:bg-[#1479e8]/10"
              >
                {secondaryButtonText}

                <ChevronRight size={18} />
              </a>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-7">
              <div>
                <div className="text-2xl font-semibold text-[#1479e8]">
                  {displayQuality}
                </div>

                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">
                  Display Quality
                </div>
              </div>

              <div>
                <div className="text-2xl font-semibold text-[#1479e8]">
                  {screenSize}
                </div>

                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">
                  Digital Screens
                </div>
              </div>

              <div>
                <div className="text-2xl font-semibold text-[#1479e8]">
                  {visibility}
                </div>

                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">
                  Brand Visibility
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              x: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[560px]">
              <div className="absolute -inset-12 rounded-full bg-[#1479e8]/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-[#1479e8]/20 bg-white/[0.035] p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#0d223b] via-[#07111f] to-black">
                  {heroImage ? (
                    <>
                      <CmsImage
                        src={heroImage}
                        alt={heroTitle}
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" />

                      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
                        <div className="text-xs uppercase tracking-[0.3em] text-[#b9d9ff]">
                          Digital Wisdom
                        </div>

                        <div className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                          {screenTitle}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col justify-between p-7 sm:p-10">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-[#1479e8]/30 bg-[#1479e8]/10 px-3 py-1 text-[10px] uppercase tracking-widest text-[#5fa8f5]">
                          Digital Wisdom
                        </span>

                        <MonitorPlay
                          size={20}
                          className="text-[#5fa8f5]"
                        />
                      </div>

                      <div>
                        <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[#5fa8f5]/70">
                          {screenLabel}
                        </div>

                        <div className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                          {screenTitle}
                        </div>

                        <div className="mt-7 flex items-center gap-3 text-sm text-white/50">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1479e8]/15">
                            <Play
                              size={13}
                              fill="currentColor"
                              className="text-[#5fa8f5]"
                            />
                          </span>

                          {screenCampaignText}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#1479e8] shadow-lg shadow-[#1479e8]" />

                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                          {screenStatus}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.6,
                }}
                className="absolute -bottom-6 -left-5 rounded-2xl border border-[#1479e8]/20 bg-black/80 px-5 py-4 shadow-xl backdrop-blur-xl sm:-left-12"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/20">
                    <BarChart3 size={19} />
                  </div>

                  <div>
                    <div className="text-sm font-semibold">
                      {screenBadgeTitle}
                    </div>

                    <div className="text-xs text-white/40">
                      {screenBadgeText}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          ABOUT
      ====================================================== */}

      <section
        id="about"
        className="border-t border-white/10 py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">
                {aboutEyebrow}
              </div>

              <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                {aboutTitle}
              </h2>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              {aboutImage && (
                <div className="mb-8 overflow-hidden rounded-3xl border border-white/10">
                  <CmsImage
                    src={aboutImage}
                    alt={aboutTitle}
                    className="h-[320px] w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
              )}

              <div className="text-lg leading-8 text-white/60">
                <p>{aboutDescription}</p>

                {aboutContent && (
                  <p className="mt-6">
                    {aboutContent}
                  </p>
                )}

                <a
                  href={aboutButtonUrl}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-white transition hover:text-[#1479e8]"
                >
                  {aboutButtonText}

                  <MoveRight size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
          NETWORK
      ====================================================== */}

      <section
        id="network"
        className="bg-[#090c11] py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">
                {networkEyebrow}
              </div>

              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
                {networkTitle}
              </h2>
            </div>

            <p className="max-w-md leading-7 text-white/50">
              {networkDescription}
            </p>
          </div>

          {networkImage && (
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
              className="mt-12 overflow-hidden rounded-[2rem] border border-white/10"
            >
              <div className="relative h-[320px] sm:h-[420px]">
                <CmsImage
                  src={networkImage}
                  alt={networkTitle}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {networkContent && (
                  <div className="absolute bottom-7 left-7 text-xl font-semibold sm:bottom-10 sm:left-10 sm:text-3xl">
                    {networkContent}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* LOCATIONS */}

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locationsLoading ? (
              Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]"
                />
              ))
            ) : locations.length > 0 ? (
              locations.map(
                (location, index) => {
                  const Icon =
                    locationIcons[
                      location.icon
                    ] || MapPin;

                  return (
                    <motion.div
                      key={location.id || index}
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06,
                      }}
                      className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:border-[#1479e8]/40 hover:bg-[#1479e8]/[0.045]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1479e8]/20 bg-[#1479e8]/10 text-[#5fa8f5] transition group-hover:bg-[#1479e8] group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-12 text-xl font-semibold">
                        {location.title}
                      </h3>

                      <p className="mt-3 leading-7 text-white/45">
                        {location.description}
                      </p>

                      <a
                        href="/network"
                        className="mt-8 flex items-center gap-2 text-sm text-white/50 transition group-hover:text-[#5fa8f5]"
                      >
                        Explore location

                        <ArrowRight size={15} />
                      </a>
                    </motion.div>
                  );
                }
              )
            ) : (
              <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center">
                <MapPin
                  size={28}
                  className="mx-auto text-[#1479e8]/60"
                />

                <p className="mt-4 text-white/40">
                  Our network locations will be available soon.
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <a
              href={networkButtonUrl}
              className="inline-flex items-center gap-2 rounded-full border border-[#1479e8]/30 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-[#1479e8]/10 hover:text-white"
            >
              {networkButtonText}

              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================
          SOLUTIONS
      ====================================================== */}

      <section
        id="solutions"
        className="py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">
                {solutionsEyebrow}
              </div>

              <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                {solutionsTitle}
              </h2>

              <p className="mt-7 max-w-md leading-7 text-white/50">
                {solutionsDescription}
              </p>

              <a
                href={solutionsButtonUrl}
                className="mt-8 inline-flex items-center gap-2 font-semibold transition hover:text-[#5fa8f5]"
              >
                {solutionsButtonText}

                <MoveRight size={18} />
              </a>
            </div>

            <div>
              {solutionsImage && (
                <div className="mb-8 overflow-hidden rounded-3xl border border-white/10">
                  <CmsImage
                    src={solutionsImage}
                    alt={solutionsTitle}
                    className="h-[280px] w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {solutionsItems.map(
                  (item, index) => (
                    <motion.div
                      key={`${item}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.04,
                      }}
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#1479e8]/30 hover:bg-[#1479e8]/[0.045]"
                    >
                      <span className="text-sm text-[#1479e8]/60">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <span className="font-medium">
                        {typeof item === "string"
                          ? item
                          : item?.title ||
                            item?.name ||
                            ""}
                      </span>

                      <CheckCircle2
                        size={17}
                        className="ml-auto text-white/20 transition group-hover:text-[#1479e8]"
                      />
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FOUR PILLARS
      ====================================================== */}

      <section className="border-y border-white/10 bg-[#090c11] py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-16">
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">
              {philosophyEyebrow}
            </div>

            <h2 className="text-4xl font-semibold sm:text-6xl">
              {philosophyTitle}
            </h2>

            <p className="mt-6 max-w-2xl leading-7 text-white/45">
              {philosophyDescription}
            </p>
          </div>

          {philosophyImage && (
            <div className="mb-14 overflow-hidden rounded-[2rem] border border-white/10">
              <CmsImage
                src={philosophyImage}
                alt={philosophyTitle}
                className="h-[300px] w-full object-cover sm:h-[400px]"
              />
            </div>
          )}

          <div className="grid border-l border-white/10 lg:grid-cols-4">
            {philosophyPillars.map(
              (pillar, index) => {
                const Icon =
                  philosophyIcons[index] ||
                  Target;

                return (
                  <div
                    key={`${pillar.number || index}-${pillar.title || index}`}
                    className="group border-b border-r border-t border-white/10 p-7 last:border-b-0 lg:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/30">
                        {pillar.number ||
                          String(
                            index + 1
                          ).padStart(2, "0")}
                      </div>

                      <Icon
                        size={20}
                        className="text-[#1479e8]/50 transition group-hover:text-[#1479e8]"
                      />
                    </div>

                    <h3 className="mt-16 text-2xl font-semibold">
                      {pillar.title}
                    </h3>

                    <p className="mt-4 leading-7 text-white/45">
                      {pillar.text}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          VISION
      ====================================================== */}

      <section className="py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">
                {visionEyebrow}
              </div>

              <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                {visionTitle}
              </h2>
            </div>

            <div>
              {visionImage && (
                <div className="mb-8 overflow-hidden rounded-3xl border border-white/10">
                  <CmsImage
                    src={visionImage}
                    alt={visionTitle}
                    className="h-[300px] w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
              )}

              <div className="relative overflow-hidden rounded-3xl border border-[#1479e8]/20 bg-[#1479e8]/[0.035] p-8 sm:p-10">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#1479e8]/10 blur-3xl" />

                <Sparkles
                  size={24}
                  className="relative text-[#5fa8f5]"
                />

                <p className="relative mt-7 text-xl leading-9 text-white/65">
                  {visionDescription}
                </p>

                {visionContent && (
                  <>
                    <div className="relative mt-8 h-px bg-white/10" />

                    <div className="relative mt-6 flex items-center gap-3 text-sm text-white/40">
                      <span className="h-2 w-2 rounded-full bg-[#1479e8] shadow-lg shadow-[#1479e8]" />

                      {visionContent}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

      <section
        id="contact"
        className="px-5 pb-10 lg:px-8"
      >
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#1479e8]/20 bg-[#1479e8]/[0.045]">
          <div className="relative min-h-[430px] overflow-hidden px-7 py-20 text-center sm:px-12 sm:py-28">
            {ctaImage && (
              <>
                <CmsImage
                  src={ctaImage}
                  alt={ctaTitle}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/65" />
              </>
            )}

            {!ctaImage && (
              <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-[#1479e8]/20 blur-3xl" />
            )}

            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5fa8f5]">
                {ctaEyebrow}
              </div>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
                {ctaTitle}
              </h2>

              <p className="mx-auto mt-6 max-w-xl leading-7 text-white/50">
                {ctaDescription}
              </p>

              <a
                href={ctaButtonUrl}
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#1479e8] px-8 py-4 font-semibold text-white shadow-xl shadow-[#1479e8]/20 transition duration-300 hover:scale-[1.02] hover:bg-[#0f6ed5]"
              >
                {ctaButtonText}

                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

