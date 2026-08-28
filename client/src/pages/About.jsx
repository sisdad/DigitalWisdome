
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTitle from "../components/SectionTitle";
import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";


// ============================================================
// CMS IMAGE URL HELPER
// ============================================================

function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${SERVER_BASE_URL}${imageUrl}`;
  }

  return `${SERVER_BASE_URL}/${imageUrl}`;
}

// ============================================================
// ICON MAP
// ============================================================

const iconMap = {
  Eye,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap,
};

function getIcon(iconName, fallback = Target) {
  if (!iconName) {
    return fallback;
  }

  return iconMap[iconName] || fallback;
}

// ============================================================
// ABOUT PAGE
// ============================================================

export default function About() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD ABOUT PAGE FROM PUBLIC CMS
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function loadAboutPage() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public-cms/pages/about`
        );

        if (!response.ok) {
          throw new Error(
            `CMS request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        if (mounted && result?.success) {
          setCmsPage(result.data);
        }
      } catch (error) {
        console.error("ABOUT CMS LOAD ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAboutPage();

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
  // HERO
  // ============================================================

  const hero = sections.hero || {};

  const heroEyebrow =
    hero.eyebrow || "About Digital Wisdom";

  const heroTitle =
    hero.title ||
    "Building the future of digital advertising.";

  const heroDescription =
    hero.description ||
    "Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.";

  const heroImage = getImageUrl(hero.image_url);

  // ============================================================
  // INTRODUCTION
  // ============================================================

  const introduction = sections.introduction || {};

  const introductionTitle =
    introduction.title ||
    "Connecting brands with people.";

  const introductionDescription =
    introduction.description ||
    "We create opportunities for businesses to communicate their message through strategically positioned digital advertising environments.";

  const introductionContent =
    introduction.content ||
    "Our approach combines strategic placement, creative communication, technology, and professional service to help brands gain visibility and connect with their audiences.";

  const introductionImage =
    getImageUrl(introduction.image_url);

  // ============================================================
  // VISION
  // ============================================================

  const vision = sections.vision || {};

  const visionEyebrow =
    vision.eyebrow || "01";

  const visionTitle =
    vision.title || "Our Vision";

  const visionText =
    vision.description ||
    "To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.";

  const visionImage =
    getImageUrl(vision.image_url);

  // ============================================================
  // MISSION
  // ============================================================

  const mission = sections.mission || {};

  const missionEyebrow =
    mission.eyebrow || "02";

  const missionTitle =
    mission.title || "Our Mission";

  const missionText =
    mission.description ||
    "To provide effective, creative, and technology-driven advertising solutions that help businesses reach their target customers, strengthen brand visibility, and generate meaningful marketing impact.";

  const missionImage =
    getImageUrl(mission.image_url);

  // ============================================================
  // WHY US
  // ============================================================

  const whyUs = sections.why_us || {};

  const whyEyebrow =
    whyUs.eyebrow || "Why Digital Wisdom";

  const whyTitle =
    whyUs.title ||
    "Advertising built around attention and impact.";

  const whyDescription =
    whyUs.description ||
    "We believe effective advertising is more than displaying a message. It is about reaching the right people, in the right environment, with the right communication.";

  // ============================================================
  // CTA
  // ============================================================

  const cta = sections.cta || {};

  const ctaEyebrow =
    cta.eyebrow || "Let's work together";

  const ctaTitle =
    cta.title || "Your brand deserves to be seen.";

  const ctaDescription =
    cta.description ||
    "Connect with Digital Wisdom and discover advertising opportunities designed to put your message in front of the right audience.";

  const ctaButtonText =
    cta.button_text || "Advertise With Us";

  const ctaButtonUrl =
    cta.button_url || "/contact";

  // ============================================================
  // CORE VALUES
  // ============================================================

  const values = [
    {
      title: "Wisdom & Creativity",
      text: "We combine market knowledge, technology, and creativity to develop impactful advertising solutions.",
      icon: Lightbulb,
    },
    {
      title: "Quality & Excellence",
      text: "We are committed to delivering high-quality digital advertising services and maintaining professional standards.",
      icon: ShieldCheck,
    },
    {
      title: "Innovation",
      text: "We continuously embrace new technologies, ideas, and advertising approaches to create better opportunities.",
      icon: Zap,
    },
    {
      title: "Integrity & Impact",
      text: "We operate with transparency, accountability, and professionalism while focusing on meaningful results.",
      icon: TrendingUp,
    },
  ];

  // ============================================================
  // STRENGTHS
  // ============================================================

  const strengths = [
    {
      title: "Strategic Reach",
      text: "Positioning advertising where people naturally spend time and attention.",
      icon: Target,
    },
    {
      title: "Audience Connection",
      text: "Helping brands communicate directly with relevant audiences through digital media.",
      icon: Users,
    },
    {
      title: "Digital Innovation",
      text: "Using modern technology to create flexible and engaging advertising experiences.",
      icon: Zap,
    },
    {
      title: "Brand Visibility",
      text: "Giving businesses opportunities to strengthen awareness and remain memorable.",
      icon: Eye,
    },
  ];

  // ============================================================
  // INTRODUCTION FEATURE CARDS
  // ============================================================

  const introductionFeatures = [
    {
      number: "01",
      title: "Digital First",
      text: "Modern advertising powered by digital technology.",
    },
    {
      number: "02",
      title: "Audience Focused",
      text: "Advertising designed around real audience attention.",
    },
    {
      number: "03",
      title: "Creative",
      text: "Engaging visual communication for modern brands.",
    },
    {
      number: "04",
      title: "Growth Driven",
      text: "Solutions designed to support business visibility.",
    },
  ];

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] text-white">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-5 pt-32">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#1479e8]" />

            <p className="mt-5 text-sm text-white/40">
              Loading About Digital Wisdom...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      <Navbar />

      <main className="pt-32">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#1479e8]/10 blur-3xl" />

            <div className="absolute right-[-5%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#1479e8]/[0.07] blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">

            {/* HERO TITLE */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SectionTitle
                eyebrow={heroEyebrow}
                title={heroTitle}
                description={heroDescription}
              />
            </motion.div>

            {/* HERO IMAGE */}

            {heroImage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                }}
                className="mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]"
              >
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="max-h-[520px] w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </motion.div>
            )}

            {/* =================================================
                COMPANY INTRODUCTION
            ================================================= */}

            <div className="mt-20 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

              {/* INTRODUCTION CARD */}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                }}
                className="relative overflow-hidden rounded-[2rem] border border-[#1479e8]/20 bg-[#1479e8]/[0.035]"
              >

                {/* INTRODUCTION IMAGE */}

                {introductionImage && (
                  <div className="relative h-64 overflow-hidden sm:h-80">
                    <img
                      src={introductionImage}
                      alt={introductionTitle}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/20 to-transparent" />
                  </div>
                )}

                <div className="relative p-8 sm:p-10">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#1479e8]/10 blur-3xl" />

                  <div className="relative">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1479e8]/10 text-[#5fa8f5]">
                      <Target size={22} />
                    </div>

                    <h2 className="mt-10 text-3xl font-semibold">
                      {introductionTitle}
                    </h2>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-white/50">
                      {introductionDescription}
                    </p>

                    <p className="mt-5 max-w-2xl leading-8 text-white/40">
                      {introductionContent}
                    </p>

                  </div>
                </div>
              </motion.div>

              {/* FEATURE CARDS */}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.25,
                }}
                className="grid grid-cols-2 gap-4"
              >
                {introductionFeatures.map((item) => (
                  <div
                    key={item.number}
                    className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                  >
                    <div className="text-3xl font-semibold text-[#1479e8]">
                      {item.number}
                    </div>

                    <h3 className="mt-8 font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/40">
                      {item.text}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* =====================================================
            VISION & MISSION
        ===================================================== */}

        <section className="border-y border-white/10 bg-[#090c11] py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid gap-6 lg:grid-cols-2">

              {/* =================================================
                  VISION
              ================================================= */}

              <motion.div
                initial={{ opacity: 0, y: 25 }}
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
                className="rounded-[2rem] border border-[#1479e8]/20 bg-[#1479e8]/[0.035] p-8 sm:p-10"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1479e8]/10 text-[#5fa8f5]">
                    {(() => {
                      const Icon = getIcon(
                        vision.icon,
                        Eye
                      );

                      return <Icon size={22} />;
                    })()}
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-[#5fa8f5]">
                      {visionEyebrow}
                    </div>

                    <h3 className="mt-1 text-2xl font-semibold">
                      {visionTitle}
                    </h3>
                  </div>

                </div>

                {/* VISION IMAGE */}

                {visionImage && (
                  <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={visionImage}
                      alt={visionTitle}
                      className="h-56 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}

                <p className="mt-10 text-xl leading-9 text-white/60">
                  {visionText}
                </p>

              </motion.div>

              {/* =================================================
                  MISSION
              ================================================= */}

              <motion.div
                initial={{ opacity: 0, y: 25 }}
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
                  delay: 0.1,
                }}
                className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-8 sm:p-10"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60">
                    {(() => {
                      const Icon = getIcon(
                        mission.icon,
                        Target
                      );

                      return <Icon size={22} />;
                    })()}
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-white/30">
                      {missionEyebrow}
                    </div>

                    <h3 className="mt-1 text-2xl font-semibold">
                      {missionTitle}
                    </h3>
                  </div>

                </div>

                {/* MISSION IMAGE */}

                {missionImage && (
                  <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={missionImage}
                      alt={missionTitle}
                      className="h-56 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}

                <p className="mt-10 text-xl leading-9 text-white/50">
                  {missionText}
                </p>

              </motion.div>

            </div>
          </div>
        </section>

        {/* =====================================================
            WHAT MAKES US DIFFERENT
        ===================================================== */}

        <section className="py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <SectionTitle
              eyebrow={whyEyebrow}
              title={whyTitle}
              description={whyDescription}
            />

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {strengths.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
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
                      delay: index * 0.07,
                    }}
                    className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:border-[#1479e8]/30 hover:bg-[#1479e8]/[0.035]"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1479e8]/20 bg-[#1479e8]/10 text-[#5fa8f5] transition group-hover:bg-[#1479e8] group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-10 text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-white/40">
                      {item.text}
                    </p>

                  </motion.div>
                );
              })}

            </div>
          </div>
        </section>

        {/* =====================================================
            CORE VALUES
        ===================================================== */}

        <section className="border-y border-white/10 bg-[#090c11] py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <SectionTitle
              eyebrow="Our Core Values"
              title={
                <>
                  What drives
                  <br />
                  <span className="text-white/40">
                    everything we do.
                  </span>
                </>
              }
            />

            <div className="mt-16 grid gap-4 md:grid-cols-2">

              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.title}
                    initial={{
                      opacity: 0,
                      y: 20,
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
                    className="group rounded-3xl border border-white/10 bg-white/[0.025] p-8 transition duration-300 hover:border-[#1479e8]/30 hover:bg-[#1479e8]/[0.035]"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1479e8]/10 text-[#5fa8f5]">
                        <Icon size={20} />
                      </div>

                      <span className="text-sm text-[#1479e8]/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    <h3 className="mt-10 text-2xl font-semibold">
                      {value.title}
                    </h3>

                    <p className="mt-4 leading-7 text-white/45">
                      {value.text}
                    </p>

                    <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/20 transition group-hover:text-[#5fa8f5]">
                      <CheckCircle2 size={14} />
                      Digital Wisdom
                    </div>

                  </motion.div>
                );
              })}

            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="px-5 py-10 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#1479e8]/20 bg-[#1479e8]/[0.045]">

            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1479e8]/15 blur-3xl" />

            <div className="relative px-7 py-20 text-center sm:px-12 sm:py-24">

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
        </section>

      </main>

      <Footer />
    </div>
  );
}

