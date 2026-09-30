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
  CalendarDays,
  Megaphone,
  Presentation,
  Sparkles,
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

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ============================================================
// ABOUT PAGE
// ============================================================

export default function About() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD ABOUT PAGE FROM PUBLIC CMS
  // ==========================================================

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

  // ==========================================================
  // ORGANIZE CMS SECTIONS
  // ==========================================================

  const sections = useMemo(() => {
    const list = cmsPage?.sections || [];

    return list.reduce((acc, section) => {
      acc[section.section_key] = section;
      return acc;
    }, {});
  }, [cmsPage]);

  // ==========================================================
  // HERO
  // ==========================================================

  const hero = sections.hero || {};

  const heroEyebrow =
    hero.eyebrow || "ABOUT DIGITAL WISDOM";

  const heroTitle =
    hero.title ||
    "Building the future of digital advertising.";

  const heroDescription =
    hero.description ||
    "Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.";

  const heroImage = getImageUrl(hero.image_url);

  // ==========================================================
  // INTRODUCTION
  // ==========================================================

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

  const introductionImage = getImageUrl(
    introduction.image_url
  );

  // ==========================================================
  // VISION
  // ==========================================================

  const vision = sections.vision || {};

  const visionEyebrow =
    vision.eyebrow || "01";

  const visionTitle =
    vision.title || "Our Vision";

  const visionText =
    vision.description ||
    "To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.";

  const visionImage = getImageUrl(
    vision.image_url
  );

  // ==========================================================
  // MISSION
  // ==========================================================

  const mission = sections.mission || {};

  const missionEyebrow =
    mission.eyebrow || "02";

  const missionTitle =
    mission.title || "Our Mission";

  const missionText =
    mission.description ||
    "To provide effective, creative, and technology-driven advertising solutions that help businesses reach their target customers, strengthen brand visibility, and generate meaningful marketing impact.";

  const missionImage = getImageUrl(
    mission.image_url
  );

  // ==========================================================
  // WHY US
  // ==========================================================

  const whyUs = sections.why_us || {};

  const whyEyebrow =
    whyUs.eyebrow || "WHY DIGITAL WISDOM";

  const whyTitle =
    whyUs.title ||
    "Advertising built around attention and impact.";

  const whyDescription =
    whyUs.description ||
    "We believe effective advertising is more than displaying a message. It is about reaching the right people, in the right environment, with the right communication.";

  // ==========================================================
  // CTA
  // ==========================================================

  const cta = sections.cta || {};

  const ctaEyebrow =
    cta.eyebrow || "LET'S WORK TOGETHER";

  const ctaTitle =
    cta.title ||
    "Your brand deserves to be seen.";

  const ctaDescription =
    cta.description ||
    "Connect with Digital Wisdom and discover advertising opportunities designed to put your message in front of the right audience.";

  const ctaButtonText =
    cta.button_text || "Advertise With Us";

  const ctaButtonUrl =
    cta.button_url || "/contact";

  // ==========================================================
  // CORE VALUES
  // ==========================================================

  const values = [
    {
      title: "Wisdom & Creativity",
      text:
        "We combine market knowledge, technology, and creativity to develop impactful advertising solutions.",
      icon: Lightbulb,
    },

    {
      title: "Quality & Excellence",
      text:
        "We are committed to delivering high-quality digital advertising services and maintaining professional standards.",
      icon: ShieldCheck,
    },

    {
      title: "Innovation",
      text:
        "We continuously embrace new technologies, ideas, and advertising approaches to create better opportunities.",
      icon: Zap,
    },

    {
      title: "Integrity & Impact",
      text:
        "We operate with transparency, accountability, and professionalism while focusing on meaningful results.",
      icon: TrendingUp,
    },
  ];

  // ==========================================================
  // STRENGTHS
  // ==========================================================

  const strengths = [
    {
      title: "Strategic Reach",
      text:
        "Positioning advertising where people naturally spend time and attention.",
      icon: Target,
    },

    {
      title: "Audience Connection",
      text:
        "Helping brands communicate directly with relevant audiences through digital media.",
      icon: Users,
    },

    {
      title: "Digital Innovation",
      text:
        "Using modern technology to create flexible and engaging advertising experiences.",
      icon: Zap,
    },

    {
      title: "Brand Visibility",
      text:
        "Giving businesses opportunities to strengthen awareness and remain memorable.",
      icon: Eye,
    },
  ];

  // ==========================================================
  // INTRODUCTION FEATURES
  // ==========================================================

  const introductionFeatures = [
    {
      number: "01",
      title: "Digital First",
      text:
        "Modern advertising powered by digital technology.",
    },

    {
      number: "02",
      title: "Audience Focused",
      text:
        "Advertising designed around real audience attention.",
    },

    {
      number: "03",
      title: "Creative",
      text:
        "Engaging visual communication for modern brands.",
    },

    {
      number: "04",
      title: "Growth Driven",
      text:
        "Solutions designed to support business visibility.",
    },
  ];

  // ==========================================================
  // EVENT ADVERTISING SERVICES
  // ==========================================================

  const eventAdvertisingServices = [
    {
      icon: Presentation,
      title: "Conferences & Summits",
      text:
        "Promote speakers, sponsors, programs, announcements, and partner brands throughout conferences and professional gatherings.",
    },

    {
      icon: Megaphone,
      title: "Exhibitions & Trade Shows",
      text:
        "Give exhibitors, partners, and sponsors a dynamic digital platform to showcase their products, services, and campaigns.",
    },

    {
      icon: CalendarDays,
      title: "Corporate Events",
      text:
        "Support corporate events with professional digital displays for company messages, presentations, announcements, and brand communication.",
    },

    {
      icon: Sparkles,
      title: "Product Launches",
      text:
        "Create a stronger launch environment with engaging digital advertising that introduces products and promotional campaigns to attendees.",
    },

    {
      icon: Users,
      title: "Sponsor & Partner Promotion",
      text:
        "Give event sponsors and strategic partners valuable visibility through professionally managed digital promotional content.",
    },

    {
      icon: Eye,
      title: "Event Announcements",
      text:
        "Display schedules, important notices, speaker information, promotional messages, and other event communication in real time.",
    },
  ];

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061a3a] text-white">
        <Navbar />

        <main className="flex min-h-[75vh] items-center justify-center px-5 pt-28">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white" />

            <p className="mt-6 text-base font-semibold text-white/70">
              Loading About Digital Wisdom...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#061a3a] text-white">
      <Navbar />

      <main>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] pt-28 sm:pt-32 lg:pt-36">

          {/* Background glow */}

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#1479e8]/20 blur-[120px]" />

            <div className="absolute right-[-150px] top-40 h-[600px] w-[600px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

            <div className="absolute bottom-0 left-1/2 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-[#1479e8]/10 blur-[120px]" />

            {/* Digital grid */}

            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-8 lg:pb-32">

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mx-auto max-w-5xl text-center"
            >

              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-[#5fb0ff] shadow-lg shadow-[#1479e8]" />

                <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/90">
                  {heroEyebrow}
                </span>

              </div>

              <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
                {heroTitle}
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-8 text-white/75 sm:text-xl sm:leading-9">
                {heroDescription}
              </p>

            </motion.div>

            {/* Hero image */}

            {heroImage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative mx-auto mt-16 max-w-6xl"
              >

                <div className="absolute -inset-4 rounded-[2.5rem] bg-[#1479e8]/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-1 shadow-2xl shadow-black/30">

                  <div className="relative overflow-hidden rounded-[1.75rem]">

                    <img
                      src={heroImage}
                      alt={heroTitle}
                      className="max-h-[580px] min-h-[280px] w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061a3a]/80 via-transparent to-transparent" />

                  </div>

                </div>

              </motion.div>
            )}

          </div>
        </section>

        {/* ====================================================
            INTRODUCTION
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-150px] top-1/3 h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

            <div className="absolute right-[-200px] bottom-0 h-[500px] w-[500px] rounded-full bg-[#1479e8]/20 blur-[130px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

              {/* Main introduction */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                variants={fadeLeft}
                className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-sm"
              >

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

                    <div className="absolute inset-0 bg-gradient-to-t from-[#082b5f] via-[#082b5f]/20 to-transparent" />

                  </div>
                )}

                <div className="relative p-8 sm:p-10 lg:p-12">

                  <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#1479e8]/25 blur-3xl" />

                  <div className="relative">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/30">
                      <Target size={25} />
                    </div>

                    <h2 className="mt-9 text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {introductionTitle}
                    </h2>

                    <p className="mt-6 text-lg font-semibold leading-8 text-white/85 sm:text-xl">
                      {introductionDescription}
                    </p>

                    <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/65">
                      {introductionContent}
                    </p>

                  </div>
                </div>

              </motion.div>

              {/* Features */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                variants={fadeRight}
                className="grid grid-cols-2 gap-4"
              >

                {introductionFeatures.map(
                  (item, index) => (
                    <motion.div
                      key={item.number}
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
                        delay: index * 0.08,
                      }}
                      whileHover={{
                        y: -6,
                      }}
                      className="group rounded-[1.5rem] border border-white/15 bg-[#061f46]/70 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:border-[#5fb0ff]/50 hover:bg-[#1479e8]/20"
                    >

                      <div className="text-4xl font-black text-[#63b1ff]">
                        {item.number}
                      </div>

                      <div className="mt-8 h-px w-10 bg-[#5fb0ff]/60 transition-all duration-300 group-hover:w-16" />

                      <h3 className="mt-6 text-lg font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm font-medium leading-6 text-white/60">
                        {item.text}
                      </p>

                    </motion.div>
                  )
                )}

              </motion.div>

            </div>
          </div>
        </section>

        {/* ====================================================
            VISION & MISSION
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />

            <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#1479e8]/10 blur-[120px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <div className="mb-16 text-center">

              <div className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                OUR DIRECTION
              </div>

              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Where we are going.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-7 text-white/60 sm:text-lg">
                Our vision and mission guide the way we build,
                innovate, and create value for brands and
                audiences.
              </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* Vision */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                variants={fadeLeft}
                className="group relative overflow-hidden rounded-[2rem] border border-[#4da7ff]/30 bg-[#0a2a58] shadow-2xl shadow-black/20"
              >

                <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#1479e8]/20 blur-[90px]" />

                <div className="relative p-8 sm:p-10">

                  <div className="flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/30">
                      {(() => {
                        const Icon = getIcon(
                          vision.icon,
                          Eye
                        );

                        return <Icon size={25} />;
                      })()}
                    </div>

                    <span className="text-5xl font-black text-white/10">
                      {visionEyebrow}
                    </span>

                  </div>

                  <div className="mt-9">

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                      {visionEyebrow}
                    </p>

                    <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                      {visionTitle}
                    </h3>

                  </div>

                  {visionImage && (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">

                      <img
                        src={visionImage}
                        alt={visionTitle}
                        className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>
                  )}

                  <p className="mt-8 text-lg font-medium leading-8 text-white/70">
                    {visionText}
                  </p>

                  <div className="mt-8 h-1 w-16 rounded-full bg-[#1479e8] transition-all duration-300 group-hover:w-24" />

                </div>

              </motion.div>

              {/* Mission */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                variants={fadeRight}
                className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] shadow-2xl shadow-black/20"
              >

                <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#1479e8]/15 blur-[90px]" />

                <div className="relative p-8 sm:p-10">

                  <div className="flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#63b1ff]">
                      {(() => {
                        const Icon = getIcon(
                          mission.icon,
                          Target
                        );

                        return <Icon size={25} />;
                      })()}
                    </div>

                    <span className="text-5xl font-black text-white/10">
                      {missionEyebrow}
                    </span>

                  </div>

                  <div className="mt-9">

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                      {missionEyebrow}
                    </p>

                    <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                      {missionTitle}
                    </h3>

                  </div>

                  {missionImage && (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">

                      <img
                        src={missionImage}
                        alt={missionTitle}
                        className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>
                  )}

                  <p className="mt-8 text-lg font-medium leading-8 text-white/65">
                    {missionText}
                  </p>

                  <div className="mt-8 h-1 w-16 rounded-full bg-white/40 transition-all duration-300 group-hover:w-24" />

                </div>

              </motion.div>

            </div>
          </div>
        </section>

        {/* ====================================================
            WHY DIGITAL WISDOM
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-100px] top-[-100px] h-[450px] w-[450px] rounded-full bg-[#1479e8]/20 blur-[110px]" />

            <div className="absolute bottom-[-150px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

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
                {whyEyebrow}
              </div>

              <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {whyTitle}
              </h2>

              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/70">
                {whyDescription}
              </p>

            </motion.div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {strengths.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
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
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#061f46]/75 p-7 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:border-[#63b1ff]/50 hover:bg-[#1479e8]/20"
                  >

                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#1479e8]/10 blur-3xl transition group-hover:bg-[#1479e8]/25" />

                    <div className="relative">

                      <div className="flex items-center justify-between">

                        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/25">
                          <Icon size={22} />
                        </div>

                        <span className="text-4xl font-black text-white/10">
                          0{index + 1}
                        </span>

                      </div>

                      <h3 className="mt-9 text-xl font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                        {item.text}
                      </p>

                      <div className="mt-8 h-px w-10 bg-[#63b1ff]/60 transition-all duration-300 group-hover:w-full" />

                    </div>
                  </motion.div>
                );
              })}

            </div>
          </div>
        </section>

        {/* ====================================================
            EVENT ORGANIZATION ADVERTISING
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] py-24 sm:py-28 lg:py-32">

          {/* Background effects */}

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

            <div className="absolute right-[-180px] bottom-0 h-[550px] w-[550px] rounded-full bg-[#1479e8]/20 blur-[140px]" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "75px 75px",
              }}
            />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            {/* Section heading */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={fadeUp}
              className="mx-auto max-w-4xl text-center"
            >

              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#63b1ff]/30 bg-[#1479e8]/10 px-5 py-2.5">

                <CalendarDays
                  size={16}
                  className="text-[#63b1ff]"
                />

                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                  EVENT ADVERTISING
                </span>

              </div>

              <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

                Make your event

                <br />

                <span className="text-[#63b1ff]">
                  impossible to overlook.
                </span>

              </h2>

              <p className="mx-auto mt-7 max-w-3xl text-lg font-medium leading-8 text-white/65 sm:text-xl">
                Digital Wisdom Advertising & Promotion provides
                digital advertising and promotional solutions for
                event organizations, helping organizers, sponsors,
                partners, and brands communicate with audiences
                through professional digital displays.
              </p>

            </motion.div>

            {/* Main feature panel */}

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
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
                duration: 0.7,
              }}
              className="relative mt-16 overflow-hidden rounded-[2.5rem] border border-[#63b1ff]/25 bg-[#082b5f]/80 shadow-2xl shadow-black/30"
            >

              {/* Decorative glow */}

              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-96 w-96 rounded-full bg-[#1479e8]/20 blur-[100px]" />

              <div className="pointer-events-none absolute bottom-[-150px] left-[-100px] h-96 w-96 rounded-full bg-[#1479e8]/15 blur-[100px]" />

              <div className="relative grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">

                {/* Left content */}

                <div className="relative border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-xl shadow-[#1479e8]/30">

                    <Megaphone size={28} />

                  </div>

                  <div className="mt-8">

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                      BE SEEN. BE REMEMBERED.
                    </p>

                    <h3 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                      Digital promotion built for event environments.
                    </h3>

                    <p className="mt-6 text-base font-medium leading-8 text-white/65">
                      From event announcements and sponsor
                      visibility to brand campaigns and product
                      promotion, our digital advertising solutions
                      help create a connected and professional
                      communication environment.
                    </p>

                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">

                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                      Digital Displays
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                      Brand Promotion
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                      Sponsor Visibility
                    </span>

                  </div>

                  <a
                    href="/contact"
                    className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#0757b7] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/95"
                  >
                    Plan Your Event Advertising

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>

                </div>

                {/* Right services */}

                <div className="p-8 sm:p-10 lg:p-12">

                  <div className="mb-8">

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                      OUR EVENT SOLUTIONS
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                      Advertising opportunities for every event.
                    </h3>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {eventAdvertisingServices.map(
                      (service, index) => {
                        const Icon = service.icon;

                        return (
                          <motion.div
                            key={service.title}
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
                              amount: 0.1,
                            }}
                            transition={{
                              duration: 0.45,
                              delay: index * 0.06,
                            }}
                            whileHover={{
                              y: -5,
                            }}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#061f46]/70 p-5 transition-all duration-300 hover:border-[#63b1ff]/40 hover:bg-[#1479e8]/15"
                          >

                            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#1479e8]/10 blur-2xl transition group-hover:bg-[#1479e8]/25" />

                            <div className="relative">

                              <div className="flex items-start justify-between gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1479e8]/20 text-[#63b1ff] transition group-hover:bg-[#1479e8] group-hover:text-white">

                                  <Icon size={20} />

                                </div>

                                <span className="text-2xl font-black text-white/10">
                                  {String(index + 1).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>

                              </div>

                              <h4 className="mt-6 text-base font-black text-white">
                                {service.title}
                              </h4>

                              <p className="mt-3 text-sm font-medium leading-6 text-white/55">
                                {service.text}
                              </p>

                            </div>

                          </motion.div>
                        );
                      }
                    )}

                  </div>

                </div>

              </div>

            </motion.div>

            {/* Event categories */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={fadeUp}
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >

              {[
                "Corporate Events",
                "Conferences & Summits",
                "Exhibitions & Trade Shows",
                "Concerts & Entertainment",
              ].map((event, index) => (
                <div
                  key={event}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 transition-all duration-300 hover:border-[#63b1ff]/35 hover:bg-[#1479e8]/10"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1479e8]/15 text-[#63b1ff]">

                    <CheckCircle2 size={18} />

                  </div>

                  <div>

                    <p className="text-sm font-black text-white">
                      {event}
                    </p>

                    <p className="mt-1 text-xs font-medium text-white/40">
                      Digital advertising support
                    </p>

                  </div>

                </div>
              ))}

            </motion.div>

          </div>
        </section>

        {/* ====================================================
            CORE VALUES
        ==================================================== */}

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

            <div className="absolute left-1/2 top-1/4 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#1479e8]/10 blur-[140px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <div className="text-center">

              <div className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                OUR CORE VALUES
              </div>

              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

                What drives

                <br />

                <span className="text-white/45">
                  everything we do.
                </span>

              </h2>

            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2">

              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.title}
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
                      duration: 0.6,
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#0a2853]/80 p-8 shadow-2xl shadow-black/20 transition-all duration-300 hover:border-[#63b1ff]/40 hover:bg-[#0c3269]"
                  >

                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#1479e8]/10 blur-[80px] transition group-hover:bg-[#1479e8]/20" />

                    <div className="relative">

                      <div className="flex items-center justify-between">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/30">

                          <Icon size={23} />

                        </div>

                        <span className="text-5xl font-black text-white/10">

                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}

                        </span>

                      </div>

                      <h3 className="mt-10 text-2xl font-black text-white">
                        {value.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-base font-medium leading-7 text-white/60">
                        {value.text}
                      </p>

                      <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/35 transition group-hover:text-[#63b1ff]">

                        <CheckCircle2 size={15} />

                        Digital Wisdom

                      </div>

                    </div>
                  </motion.div>
                );
              })}

            </div>

          </div>
        </section>

        {/* ====================================================
            CTA
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] px-5 py-10 sm:px-8 lg:px-8">

          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#63b1ff]/30 bg-[#1479e8] shadow-2xl shadow-[#1479e8]/20">

            {/* Decorative circles */}

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
                {ctaTitle}
              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-base font-medium leading-8 text-white/80 sm:text-lg">
                {ctaDescription}
              </p>

              <a
                href={ctaButtonUrl}
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-black text-[#0757b7] shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/95 hover:shadow-white/20"
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