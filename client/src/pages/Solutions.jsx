import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Megaphone,
  MonitorPlay,
  Package,
  Play,
  Rocket,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ============================================================
// API
// ============================================================

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

// ============================================================
// DEFAULT / FALLBACK IMAGES
// ============================================================

const campaignHeroImage =
  "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1800&q=90";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85";

// ============================================================
// STATIC FALLBACK SOLUTION IMAGES
// Used only when CMS image_url is empty.
// ============================================================

const solutionImages = {
  "Video Advertising":
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=85",

  "Image Advertising":
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85",

  "Product Launches":
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",

  "Brand Campaigns":
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",

  "Promotional Messages":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",

  "Seasonal Campaigns":
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85",

  "Targeted Advertising":
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",

  "Corporate Communication":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
};

// ============================================================
// IMAGE URL HELPER
// ============================================================

function getImageUrl(imageUrl, fallback = fallbackImage) {
  if (!imageUrl) {
    return fallback;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `http://localhost:5000${imageUrl}`;
  }

  return `http://localhost:5000/${imageUrl}`;
}

// ============================================================
// SOLUTION IMAGE
// ============================================================

function getSolutionImage(solution) {
  if (solution?.image_url) {
    return getImageUrl(solution.image_url);
  }

  return solutionImages[solution?.title] || fallbackImage;
}

// ============================================================
// ICON MAP
// Supports all icons currently stored in the database.
// ============================================================

const iconMap = {
  BarChart3,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  Image: ImageIcon,
  Megaphone,
  MonitorPlay,
  Package,
  Rocket,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
};

// ============================================================
// ICON HELPER
// ============================================================

function getIcon(iconName, fallback = MonitorPlay) {
  if (!iconName) {
    return fallback;
  }

  return iconMap[iconName] || fallback;
}

// ============================================================
// DEFAULT FALLBACK SOLUTIONS
// ============================================================

const defaultSolutions = [
  {
    id: "fallback-1",
    title: "Video Advertising",
    description:
      "Dynamic video campaigns designed to capture attention and communicate your message effectively.",
    icon: "MonitorPlay",
    display_order: 1,
  },
  {
    id: "fallback-2",
    title: "Image Advertising",
    description:
      "High-impact visual advertising for brands, products, promotions, and announcements.",
    icon: "Image",
    display_order: 2,
  },
  {
    id: "fallback-3",
    title: "Product Launches",
    description:
      "Introduce new products and services to audiences through strategic digital screen placement.",
    icon: "Rocket",
    display_order: 3,
  },
  {
    id: "fallback-4",
    title: "Brand Campaigns",
    description:
      "Build brand awareness and maintain visibility through consistent digital campaigns.",
    icon: "BadgeCheck",
    display_order: 4,
  },
  {
    id: "fallback-5",
    title: "Promotional Messages",
    description:
      "Communicate offers, discounts, announcements, and promotional messages directly to consumers.",
    icon: "Megaphone",
    display_order: 5,
  },
  {
    id: "fallback-6",
    title: "Seasonal Campaigns",
    description:
      "Deliver timely campaigns around holidays, seasons, events, and special occasions.",
    icon: "CalendarDays",
    display_order: 6,
  },
  {
    id: "fallback-7",
    title: "Targeted Advertising",
    description:
      "Place your message in environments where your desired audience is most likely to see it.",
    icon: "Target",
    display_order: 7,
  },
  {
    id: "fallback-8",
    title: "Corporate Communication",
    description:
      "Use digital screens to communicate corporate messages, announcements, and information.",
    icon: "Building2",
    display_order: 8,
  },
];

// ============================================================
// DEFAULT FALLBACK BENEFITS
// ============================================================

const defaultBenefits = [
  {
    id: "fallback-1",
    title: "Capture Attention",
    description:
      "Use dynamic digital displays to attract attention in high-engagement environments.",
    icon: "Eye",
    display_order: 1,
  },
  {
    id: "fallback-2",
    title: "Reach Audiences",
    description:
      "Connect your brand with consumers in strategically selected locations.",
    icon: "Users",
    display_order: 2,
  },
  {
    id: "fallback-3",
    title: "Build Awareness",
    description:
      "Maintain consistent brand visibility and strengthen audience recognition.",
    icon: "TrendingUp",
    display_order: 3,
  },
  {
    id: "fallback-4",
    title: "Drive Impact",
    description:
      "Deliver timely and relevant messages that help turn visibility into action.",
    icon: "Zap",
    display_order: 4,
  },
];

// ============================================================
// DEFAULT FALLBACK PROCESS
// ============================================================

const defaultProcessSteps = [
  {
    id: "fallback-1",
    step_number: 1,
    title: "Tell Us Your Goal",
    description:
      "Share your advertising objective, target audience, campaign message, and desired outcome.",
    display_order: 1,
    icon: "Target",
  },
  {
    id: "fallback-2",
    step_number: 2,
    title: "Plan Your Campaign",
    description:
      "We identify suitable advertising environments and develop a campaign approach around your objectives.",
    display_order: 2,
    icon: "Sparkles",
  },
  {
    id: "fallback-3",
    step_number: 3,
    title: "Prepare Your Content",
    description:
      "Your visual content is prepared for digital display and optimized for the selected screens.",
    display_order: 3,
    icon: "Send",
  },
  {
    id: "fallback-4",
    step_number: 4,
    title: "Reach Your Audience",
    description:
      "Your campaign goes live across selected digital advertising locations.",
    display_order: 4,
    icon: "MonitorPlay",
  },
];

// ============================================================
// DEFAULT CMS SECTION CONTENT
// ============================================================

const defaultSections = {
  hero: {
    eyebrow: "Advertising Solutions",
    title: "Turn attention into brand impact.",
    description:
      "Dynamic digital advertising solutions designed to help businesses communicate with consumers in high-engagement environments.",
  },

  campaign_preview: {
    eyebrow: "Digital Campaigns",
    title: "Your message deserves more than ordinary advertising.",
    description:
      "From a single promotional message to a complete brand campaign, Digital Wisdom provides flexible digital advertising opportunities designed around your goals.",
    content: "Dynamic Digital Campaign",
    button_text: "Start Your Campaign",
    button_url: "/contact",
  },

  solutions_intro: {
    eyebrow: "What We Offer",
    title: "Solutions for every advertising objective.",
    description:
      "Choose the advertising format and campaign approach that best supports your business objectives.",
  },

  benefits_intro: {
    eyebrow: "Why Digital Advertising",
    title: "Visibility that works for your brand.",
    description:
      "Digital advertising gives businesses the flexibility to communicate visually, repeatedly, and strategically.",
  },

  process_intro: {
    eyebrow: "Campaign Process",
    title: "From idea to digital visibility.",
  },

  cta: {
    eyebrow: "Ready to Advertise?",
    title: "Let's put your brand in front of people.",
    description:
      "Talk to Digital Wisdom about your campaign and discover the right advertising opportunity for your business.",
    button_text: "Advertise With Us",
    button_url: "/contact",
  },
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ============================================================
// SOLUTIONS PAGE
// ============================================================

export default function Solutions() {
  const [cmsPage, setCmsPage] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD ALL SOLUTIONS CMS DATA
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function loadSolutionsCMS() {
      try {
        const [
          pageResponse,
          solutionsResponse,
          benefitsResponse,
          processResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/public-cms/pages/solutions`),
          fetch(`${API_BASE_URL}/public-cms/solutions`),
          fetch(`${API_BASE_URL}/public-cms/benefits`),
          fetch(`${API_BASE_URL}/public-cms/campaign-process`),
        ]);

        const [
          pageResult,
          solutionsResult,
          benefitsResult,
          processResult,
        ] = await Promise.all([
          pageResponse.json(),
          solutionsResponse.json(),
          benefitsResponse.json(),
          processResponse.json(),
        ]);

        if (!mounted) {
          return;
        }

        if (pageResult?.success && pageResult?.data) {
          setCmsPage(pageResult.data);
        }

        if (
          solutionsResult?.success &&
          Array.isArray(solutionsResult?.data)
        ) {
          setSolutions(solutionsResult.data);
        }

        if (
          benefitsResult?.success &&
          Array.isArray(benefitsResult?.data)
        ) {
          setBenefits(benefitsResult.data);
        }

        if (
          processResult?.success &&
          Array.isArray(processResult?.data)
        ) {
          setProcessSteps(processResult.data);
        }
      } catch (error) {
        console.error(
          "SOLUTIONS CMS LOAD ERROR:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSolutionsCMS();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // CMS SECTIONS
  // ============================================================

  const sections = useMemo(() => {
    const list = cmsPage?.sections || [];

    const result = {};

    for (const section of list) {
      result[section.section_key] = section;
    }

    return {
      ...defaultSections,
      ...result,
    };
  }, [cmsPage]);

  // ============================================================
  // HERO
  // ============================================================

  const hero =
    sections.hero || defaultSections.hero;

  const heroEyebrow =
    hero.eyebrow ||
    defaultSections.hero.eyebrow;

  const heroTitle =
    hero.title ||
    defaultSections.hero.title;

  const heroDescription =
    hero.description ||
    defaultSections.hero.description;

  const heroImage = getImageUrl(
    hero.image_url,
    campaignHeroImage
  );

  // ============================================================
  // CAMPAIGN PREVIEW
  // ============================================================

  const campaign =
    sections.campaign_preview ||
    defaultSections.campaign_preview;

  const campaignEyebrow =
    campaign.eyebrow ||
    defaultSections.campaign_preview.eyebrow;

  const campaignTitle =
    campaign.title ||
    defaultSections.campaign_preview.title;

  const campaignDescription =
    campaign.description ||
    defaultSections.campaign_preview.description;

  const campaignContent =
    campaign.content ||
    defaultSections.campaign_preview.content;

  const campaignButtonText =
    campaign.button_text ||
    defaultSections.campaign_preview.button_text;

  const campaignButtonUrl =
    campaign.button_url ||
    defaultSections.campaign_preview.button_url;

  const campaignImage = getImageUrl(
    campaign.image_url,
    heroImage || campaignHeroImage
  );

  // ============================================================
  // SOLUTIONS INTRO
  // ============================================================

  const solutionsIntro =
    sections.solutions_intro ||
    defaultSections.solutions_intro;

  const solutionsEyebrow =
    solutionsIntro.eyebrow ||
    defaultSections.solutions_intro.eyebrow;

  const solutionsTitle =
    solutionsIntro.title ||
    defaultSections.solutions_intro.title;

  const solutionsDescription =
    solutionsIntro.description ||
    defaultSections.solutions_intro.description;

  // ============================================================
  // BENEFITS INTRO
  // ============================================================

  const benefitsIntro =
    sections.benefits_intro ||
    defaultSections.benefits_intro;

  const benefitsEyebrow =
    benefitsIntro.eyebrow ||
    defaultSections.benefits_intro.eyebrow;

  const benefitsTitle =
    benefitsIntro.title ||
    defaultSections.benefits_intro.title;

  const benefitsDescription =
    benefitsIntro.description ||
    defaultSections.benefits_intro.description;

  // ============================================================
  // PROCESS INTRO
  // ============================================================

  const processIntro =
    sections.process_intro ||
    defaultSections.process_intro;

  const processEyebrow =
    processIntro.eyebrow ||
    defaultSections.process_intro.eyebrow;

  const processTitle =
    processIntro.title ||
    defaultSections.process_intro.title;

  // ============================================================
  // CTA
  // ============================================================

  const cta =
    sections.cta ||
    defaultSections.cta;

  const ctaEyebrow =
    cta.eyebrow ||
    defaultSections.cta.eyebrow;

  const ctaTitle =
    cta.title ||
    defaultSections.cta.title;

  const ctaDescription =
    cta.description ||
    defaultSections.cta.description;

  const ctaButtonText =
    cta.button_text ||
    defaultSections.cta.button_text;

  const ctaButtonUrl =
    cta.button_url ||
    defaultSections.cta.button_url;

  const ctaImage = getImageUrl(
    cta.image_url,
    campaignImage
  );

  // ============================================================
  // FINAL DATA WITH SAFE FALLBACKS
  // ============================================================

  const displayedSolutions =
    solutions.length > 0
      ? solutions
      : defaultSolutions;

  const displayedBenefits =
    benefits.length > 0
      ? benefits
      : defaultBenefits;

  const displayedProcessSteps =
    processSteps.length > 0
      ? processSteps
      : defaultProcessSteps;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061a3a] text-white">
        <Navbar />

        <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-5 pt-28">

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1479e8]/15 blur-[120px]" />
          </div>

          <div className="relative text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#63b1ff]" />

            <p className="mt-6 text-base font-bold text-white/70">
              Loading Solutions...
            </p>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen overflow-hidden bg-[#061a3a] text-white">

      <Navbar />

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] pt-28 sm:pt-32 lg:pt-36">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[#1479e8]/20 blur-[120px]" />

            <div className="absolute right-[-150px] top-20 h-[600px] w-[600px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

            <div className="absolute bottom-0 left-1/2 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-[#1479e8]/10 blur-[120px]" />

            <div
              className="absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-8 lg:pb-32">

            {/* HERO TEXT */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mx-auto max-w-5xl text-center"
            >

              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-[#63b1ff] shadow-lg shadow-[#1479e8]" />

                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/90">
                  {heroEyebrow}
                </span>

              </div>

              <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">

                {heroTitle.includes(
                  "brand impact."
                ) ? (
                  <>
                    Turn attention into
                    <br />

                    <span className="bg-gradient-to-r from-white via-white to-[#63b1ff] bg-clip-text text-transparent">
                      brand impact.
                    </span>
                  </>
                ) : (
                  heroTitle
                )}

              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-8 text-white/75 sm:text-xl sm:leading-9">
                {heroDescription}
              </p>

            </motion.div>

            {/* =================================================
                CAMPAIGN PREVIEW
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto mt-16 max-w-6xl"
            >

              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#1479e8]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-1 shadow-2xl shadow-black/30">

                <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#1479e8]/15 blur-[110px]" />

                <div className="relative grid gap-8 rounded-[1.75rem] bg-[#061f46]/60 p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-10">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">

                      <span className="h-2 w-2 rounded-full bg-[#1479e8] shadow-lg shadow-[#1479e8]" />

                      {campaignEyebrow}

                    </div>

                    <h2 className="mt-7 max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">

                      {campaignTitle.includes(
                        "more than ordinary advertising."
                      ) ? (
                        <>
                          Your message deserves
                          <br />

                          <span className="text-white/45">
                            more than ordinary advertising.
                          </span>
                        </>
                      ) : (
                        campaignTitle
                      )}

                    </h2>

                    <p className="mt-6 max-w-xl text-base font-medium leading-8 text-white/65">
                      {campaignDescription}
                    </p>

                    <a
                      href={campaignButtonUrl}
                      className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#1479e8] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#1479e8]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0f6ed5]"
                    >
                      {campaignButtonText}

                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </a>

                  </div>

                  {/* RIGHT VISUAL */}

                  <div className="relative">

                    <div className="absolute -inset-3 rounded-[2rem] bg-[#1479e8]/10 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#061a3a] p-2 shadow-2xl">

                      <div className="relative aspect-video overflow-hidden rounded-[1.1rem]">

                        <img
                          src={campaignImage}
                          alt="Digital advertising campaign"
                          className="h-full w-full object-cover transition duration-700 hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src =
                              campaignHeroImage;
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#061a3a] via-black/20 to-transparent" />

                        <div className="absolute inset-0 bg-gradient-to-r from-[#061a3a]/45 via-transparent to-transparent" />

                        {/* PLAY BUTTON */}

                        <div className="absolute inset-0 flex items-center justify-center">

                          <div className="flex h-17 w-17 items-center justify-center rounded-2xl border border-white/20 bg-[#1479e8]/85 text-white shadow-2xl shadow-[#1479e8]/30 backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-[#1479e8]">

                            <Play
                              size={28}
                              fill="currentColor"
                            />

                          </div>

                        </div>

                        {/* LABEL */}

                        <div className="absolute bottom-5 left-5 right-5">

                          <div className="text-sm font-black text-white">
                            {campaignContent}
                          </div>

                          <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                            Digital Wisdom Network
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

        {/* =====================================================
            SOLUTIONS
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-150px] top-1/4 h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

            <div className="absolute right-[-150px] bottom-0 h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "75px 75px",
              }}
            />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={fadeUp}
            >

              <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">

                <span className="h-2 w-2 rounded-full bg-[#1479e8] shadow-lg shadow-[#1479e8]" />

                {solutionsEyebrow}

              </div>

              <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

                {solutionsTitle.includes(
                  "advertising objective."
                ) ? (
                  <>
                    Solutions for every
                    <br />

                    <span className="text-white/45">
                      advertising objective.
                    </span>
                  </>
                ) : (
                  solutionsTitle
                )}

              </h2>

              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/65">
                {solutionsDescription}
              </p>

            </motion.div>

            {/* SOLUTION CARDS */}

            <div className="mt-16 grid gap-5 md:grid-cols-2">

              {displayedSolutions.map(
                (solution, index) => {

                  const Icon = getIcon(
                    solution.icon,
                    MonitorPlay
                  );

                  const solutionImage =
                    getSolutionImage(solution);

                  return (
                    <motion.div
                      key={
                        solution.id ||
                        `${solution.title}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        y: 35,
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
                        duration: 0.55,
                        delay: index * 0.07,
                      }}
                      whileHover={{
                        y: -8,
                      }}
                      className="group relative min-h-[410px] overflow-hidden rounded-[2rem] border border-white/15 bg-[#061f46] shadow-2xl shadow-black/20 transition duration-300 hover:border-[#63b1ff]/50"
                    >

                      {/* IMAGE */}

                      <img
                        src={solutionImage}
                        alt={solution.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-70"
                        onError={(event) => {
                          event.currentTarget.src =
                            fallbackImage;
                        }}
                      />

                      {/* OVERLAY */}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#061a3a] via-[#061a3a]/75 to-[#061a3a]/10" />

                      <div className="absolute inset-0 bg-gradient-to-r from-[#061a3a]/40 via-transparent to-transparent" />

                      {/* BLUE GLOW */}

                      <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-56 w-56 rounded-full bg-[#1479e8]/25 opacity-0 blur-[80px] transition duration-500 group-hover:opacity-100" />

                      {/* CONTENT */}

                      <div className="relative flex min-h-[410px] flex-col justify-between p-7 sm:p-8">

                        {/* TOP */}

                        <div className="flex items-start justify-between">

                          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-[#63b1ff]/30 bg-[#1479e8]/25 text-[#a8d5ff] shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 group-hover:bg-[#1479e8] group-hover:text-white">

                            <Icon size={21} />

                          </div>

                          <span className="text-sm font-black tracking-wider text-white/40">
                            {String(
                              solution.display_order ||
                                index + 1
                            ).padStart(2, "0")}
                          </span>

                        </div>

                        {/* BOTTOM */}

                        <div>

                          <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                            {solution.title}
                          </h3>

                          <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/65">
                            {solution.description}
                          </p>

                          <div className="mt-7 flex items-center gap-2 text-sm font-bold text-white/50 transition group-hover:text-[#8bc4ff]">

                            <CheckCircle2 size={16} />

                            Digital Wisdom Advertising

                          </div>

                          <div className="mt-6 h-px w-10 bg-[#63b1ff]/60 transition-all duration-300 group-hover:w-full" />

                        </div>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            BENEFITS
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "75px 75px",
              }}
            />

            <div className="absolute left-1/2 top-0 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-[#1479e8]/10 blur-[130px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={fadeUp}
            >

              <div className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                {benefitsEyebrow}
              </div>

              <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

                {benefitsTitle.includes(
                  "for your brand."
                ) ? (
                  <>
                    Visibility that works
                    <br />

                    <span className="text-white/45">
                      for your brand.
                    </span>
                  </>
                ) : (
                  benefitsTitle
                )}

              </h2>

              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/65">
                {benefitsDescription}
              </p>

            </motion.div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {displayedBenefits.map(
                (benefit, index) => {

                  const Icon = getIcon(
                    benefit.icon,
                    Zap
                  );

                  return (
                    <motion.div
                      key={
                        benefit.id ||
                        `${benefit.title}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        y: 30,
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
                        duration: 0.55,
                        delay: index * 0.07,
                      }}
                      whileHover={{
                        y: -7,
                      }}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-7 shadow-xl shadow-black/20 transition duration-300 hover:border-[#63b1ff]/40 hover:bg-[#1479e8]/15"
                    >

                      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#1479e8]/10 blur-3xl transition group-hover:bg-[#1479e8]/25" />

                      <div className="relative">

                        <div className="flex items-center justify-between">

                          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/30">

                            <Icon size={22} />

                          </div>

                          <span className="text-4xl font-black text-white/10">
                            0{index + 1}
                          </span>

                        </div>

                        <h3 className="mt-9 text-xl font-black text-white">
                          {benefit.title}
                        </h3>

                        <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                          {benefit.description}
                        </p>

                        <div className="mt-8 h-px w-10 bg-[#63b1ff]/60 transition-all duration-300 group-hover:w-full" />

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            CAMPAIGN PROCESS
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-150px] bottom-0 h-[450px] w-[450px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

            <div className="absolute right-[-150px] top-0 h-[450px] w-[450px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={fadeUp}
              className="text-center"
            >

              <div className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                {processEyebrow}
              </div>

              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

                {processTitle.includes(
                  "digital visibility."
                ) ? (
                  <>
                    From idea to
                    <br />

                    <span className="text-white/45">
                      digital visibility.
                    </span>
                  </>
                ) : (
                  processTitle
                )}

              </h2>

            </motion.div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {displayedProcessSteps.map(
                (step, index) => {

                  const Icon = getIcon(
                    step.icon,
                    [
                      Target,
                      Sparkles,
                      Send,
                      MonitorPlay,
                    ][index] ||
                      MonitorPlay
                  );

                  const stepNumber =
                    step.step_number ||
                    index + 1;

                  return (
                    <motion.div
                      key={
                        step.id ||
                        `${step.title}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        y: 30,
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
                        duration: 0.55,
                        delay: index * 0.08,
                      }}
                      whileHover={{
                        y: -7,
                      }}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#061f46]/70 p-7 shadow-xl shadow-black/20 transition duration-300 hover:border-[#63b1ff]/40 hover:bg-[#1479e8]/15"
                    >

                      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#1479e8]/10 blur-3xl transition duration-500 group-hover:bg-[#1479e8]/25" />

                      <div className="relative">

                        <div className="flex items-center justify-between">

                          <span className="text-4xl font-black text-[#63b1ff]">
                            {String(
                              stepNumber
                            ).padStart(2, "0")}
                          </span>

                          <Icon
                            size={20}
                            className="text-[#63b1ff]/60 transition duration-300 group-hover:text-[#63b1ff]"
                          />

                        </div>

                        <div className="mt-12 h-px w-10 bg-[#63b1ff]/50 transition-all duration-300 group-hover:w-16" />

                        <h3 className="mt-7 text-xl font-black text-white">
                          {step.title}
                        </h3>

                        <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                          {step.description}
                        </p>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] px-5 py-10 sm:px-8 lg:px-8">

          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#63b1ff]/30 bg-[#1479e8] shadow-2xl shadow-[#1479e8]/20">

            <img
              src={ctaImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-10"
              onError={(event) => {
                event.currentTarget.src =
                  campaignHeroImage;
              }}
            />

            <div className="absolute inset-0 bg-[#1479e8]/80" />

            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#061a3a]/25 blur-3xl" />

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.25,
              }}
              variants={fadeUp}
              className="relative px-7 py-20 text-center sm:px-12 sm:py-24 lg:px-20"
            >

              <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 backdrop-blur-sm">

                <span className="h-2 w-2 rounded-full bg-white" />

                <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
                  {ctaEyebrow}
                </span>

              </div>

              <h2 className="mx-auto mt-7 max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">

                {ctaTitle.includes(
                  "brand in front of people."
                ) ? (
                  <>
                    Let's put your
                    <br />

                    <span className="text-white/70">
                      brand in front of people.
                    </span>
                  </>
                ) : (
                  ctaTitle
                )}

              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-base font-medium leading-8 text-white/80 sm:text-lg">
                {ctaDescription}
              </p>

              <a
                href={ctaButtonUrl}
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-black text-[#0757b7] shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/95"
              >

                {ctaButtonText}

                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </a>

            </motion.div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}