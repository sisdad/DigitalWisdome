
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Eye,
  MapPin,
  MonitorPlay,
  Target,
  Users,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { locations } from "../data/locations";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

// ============================================================
// NETWORK IMAGES
// ============================================================

const networkHeroImage =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90";

const networkFallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85";

const networkImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=85",
];

// ============================================================
// SAFE IMAGE HELPER
// ============================================================

function getLocationImage(location, index) {
  const image =
    location?.image ||
    location?.image_url ||
    location?.imageUrl;

  if (!image) {
    return (
      networkImages[index % networkImages.length] ||
      networkFallbackImage
    );
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SERVER_BASE_URL}${image}`;
  }

  return `${SERVER_BASE_URL}/${image}`;
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
// NETWORK PAGE
// ============================================================

export default function Network() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD NETWORK PAGE FROM CMS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadNetworkPage() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public-cms/pages/network`
        );

        if (!response.ok) {
          throw new Error(
            `CMS request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        if (mounted && result?.success && result?.data) {
          setCmsPage(result.data);
        }
      } catch (error) {
        console.error("NETWORK CMS LOAD ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadNetworkPage();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // CMS SECTION HELPER
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

  const heroEyebrow =
    sections.hero?.eyebrow ||
    "OUR DIGITAL NETWORK";

  const heroTitle =
    sections.hero?.title ||
    "Advertising where attention happens.";

  const heroDescription =
    sections.hero?.description ||
    "Our 32-inch 4K digital screens are strategically positioned in selected high-traffic and premium commercial environments.";

  // ==========================================================
  // LOCATIONS
  // ==========================================================

  const locationsEyebrow =
    sections.locations_intro?.eyebrow ||
    "NETWORK LOCATIONS";

  const locationsTitle =
    sections.locations_intro?.title ||
    "Reach people where they are.";

  const locationsDescription =
    sections.locations_intro?.description ||
    "Each location is selected with audience visibility, commercial activity, and advertising opportunity in mind.";

  // ==========================================================
  // BENEFITS
  // ==========================================================

  const benefitsEyebrow =
    sections.benefits_intro?.eyebrow ||
    "WHY OUR NETWORK";

  const benefitsTitle =
    sections.benefits_intro?.title ||
    "More than a screen. A point of connection.";

  const benefitsDescription =
    sections.benefits_intro?.description ||
    "Digital Wisdom transforms strategic physical environments into opportunities for brands to communicate, engage, and remain visible.";

  // ==========================================================
  // PROCESS
  // ==========================================================

  const processEyebrow =
    sections.process_intro?.eyebrow ||
    "HOW IT WORKS";

  const processTitle =
    sections.process_intro?.title ||
    "Your campaign. Our network.";

  // ==========================================================
  // CTA
  // ==========================================================

  const ctaEyebrow =
    sections.cta?.eyebrow ||
    "REACH MORE PEOPLE";

  const ctaTitle =
    sections.cta?.title ||
    "Put your brand on our network.";

  const ctaDescription =
    sections.cta?.description ||
    "Talk to Digital Wisdom about advertising opportunities across our digital network.";

  const ctaButtonText =
    sections.cta?.button_text ||
    "Advertise With Us";

  const ctaButtonUrl =
    sections.cta?.button_url ||
    "/contact";

  // ==========================================================
  // NETWORK BENEFITS
  // ==========================================================

  const benefits = [
    {
      icon: Eye,
      title: "High Visibility",
      text:
        "Place your brand in environments where people naturally spend time and attention.",
    },
    {
      icon: Users,
      title: "Audience Access",
      text:
        "Connect with consumers through strategically selected commercial environments.",
    },
    {
      icon: Zap,
      title: "Dynamic Content",
      text:
        "Deliver engaging video and visual campaigns through modern digital displays.",
    },
    {
      icon: BarChart3,
      title: "Brand Impact",
      text:
        "Build stronger awareness through repeated and highly visible digital exposure.",
    },
  ];

  // ==========================================================
  // CAMPAIGN PROCESS
  // ==========================================================

  const processSteps = [
    {
      number: "01",
      title: "Choose Your Audience",
      text:
        "Identify the audience and environment that best match your campaign.",
    },
    {
      number: "02",
      title: "Select Locations",
      text:
        "Choose the digital advertising locations that fit your campaign objectives.",
    },
    {
      number: "03",
      title: "Deliver Your Content",
      text:
        "Provide your approved visual advertising content for digital display.",
    },
    {
      number: "04",
      title: "Build Visibility",
      text:
        "Your campaign reaches audiences through our strategically positioned network.",
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

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#63b1ff]" />

            <p className="mt-6 text-base font-semibold text-white/70">
              Loading Digital Wisdom Network...
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

          {/* Background effects */}

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

                {heroTitle.includes("attention happens.") ? (
                  <>
                    Advertising where
                    <br />

                    <span className="bg-gradient-to-r from-white via-white to-[#63b1ff] bg-clip-text text-transparent">
                      attention happens.
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
                HERO IMAGE
            ================================================= */}

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
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto mt-16 max-w-6xl"
            >

              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#1479e8]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-1 shadow-2xl shadow-black/30">

                <div className="relative overflow-hidden rounded-[1.75rem]">

                  <img
                    src={networkHeroImage}
                    alt="Digital Wisdom digital advertising network"
                    className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[580px]"
                    onError={(event) => {
                      event.currentTarget.src =
                        networkFallbackImage;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061a3a] via-[#061a3a]/35 to-transparent" />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#061a3a]/60 via-transparent to-[#061a3a]/20" />

                  {/* Image information */}

                  <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10 lg:p-12">

                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-[#8bc4ff]">

                      <span className="h-2 w-2 rounded-full bg-[#1479e8] shadow-lg shadow-[#1479e8]" />

                      Digital Wisdom Network

                    </div>

                    <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                      Digital visibility where people connect.
                    </h2>

                    <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/65">
                      Modern digital displays designed to keep brands
                      visible, engaging, and memorable in high-attention
                      environments.
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

            {/* =================================================
                NETWORK STATS
            ================================================= */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 grid gap-4 sm:grid-cols-3"
            >

              <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-7 backdrop-blur-sm">

                <MonitorPlay
                  size={25}
                  className="text-[#63b1ff]"
                />

                <div className="mt-7 text-4xl font-black text-white">
                  32"
                </div>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                  Digital Screens
                </p>

              </div>

              <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-7 backdrop-blur-sm">

                <Zap
                  size={25}
                  className="text-[#63b1ff]"
                />

                <div className="mt-7 text-4xl font-black text-white">
                  4K
                </div>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                  Display Quality
                </p>

              </div>

              <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-7 backdrop-blur-sm">

                <Target
                  size={25}
                  className="text-[#63b1ff]"
                />

                <div className="mt-7 text-4xl font-black text-white">
                  24/7
                </div>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                  Brand Visibility
                </p>

              </div>

            </motion.div>

          </div>

        </section>

        {/* ====================================================
            LOCATIONS
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-150px] top-1/4 h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

            <div className="absolute right-[-150px] bottom-0 h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

              <div>

                <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">

                  <MapPin size={15} />

                  {locationsEyebrow}

                </div>

                <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

                  {locationsTitle.includes("where they are.") ? (
                    <>
                      Reach people
                      <br />

                      <span className="text-white/45">
                        where they are.
                      </span>
                    </>
                  ) : (
                    locationsTitle
                  )}

                </h2>

              </div>

              <p className="max-w-md text-base font-medium leading-7 text-white/65">
                {locationsDescription}
              </p>

            </div>

            {/* Location cards */}

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {locations.length > 0 ? (

                locations.map((location, index) => {

                  const Icon =
                    typeof location.icon === "function"
                      ? location.icon
                      : MapPin;

                  const image = getLocationImage(
                    location,
                    index
                  );

                  return (
                    <motion.div
                      key={
                        location.id ||
                        location.title ||
                        index
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

                      <img
                        src={image}
                        alt={
                          location.title ||
                          "Digital Wisdom network location"
                        }
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-70"
                        onError={(event) => {
                          event.currentTarget.src =
                            networkFallbackImage;
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#061a3a] via-[#061a3a]/70 to-[#061a3a]/10" />

                      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#1479e8]/20 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />

                      <div className="relative flex min-h-[410px] flex-col justify-between p-7 sm:p-8">

                        <div className="flex items-start justify-between">

                          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-[#63b1ff]/30 bg-[#1479e8]/25 text-[#a8d5ff] backdrop-blur-md transition duration-300 group-hover:bg-[#1479e8] group-hover:text-white">

                            <Icon size={21} />

                          </div>

                          <span className="text-sm font-black tracking-wider text-white/35">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                        </div>

                        <div>

                          <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                            {location.title}
                          </h3>

                          <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/65">
                            {location.description}
                          </p>

                          <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-white/50 transition group-hover:text-[#8bc4ff]">

                            <MapPin size={16} />

                            <span>
                              Explore location
                            </span>

                            <ArrowRight
                              size={15}
                              className="transition-transform group-hover:translate-x-1"
                            />

                          </div>

                        </div>

                      </div>

                    </motion.div>
                  );
                })

              ) : (

                <div className="col-span-full rounded-[2rem] border border-white/15 bg-white/[0.07] p-12 text-center">

                  <MapPin
                    size={30}
                    className="mx-auto text-[#63b1ff]"
                  />

                  <p className="mt-5 font-medium text-white/50">
                    Network locations will appear here.
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

        {/* ====================================================
            BENEFITS
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
                  "A point of connection."
                ) ? (
                  <>
                    More than a screen.
                    <br />

                    <span className="text-white/45">
                      A point of connection.
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

              {benefits.map((benefit, index) => {

                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={benefit.title}
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
                        {benefit.text}
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
            HOW IT WORKS
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28 lg:py-32">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[-150px] bottom-0 h-[450px] w-[450px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

            <div className="absolute right-[-150px] top-0 h-[450px] w-[450px] rounded-full bg-[#1479e8]/15 blur-[120px]" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

            <div className="text-center">

              <div className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#63b1ff]">
                {processEyebrow}
              </div>

              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

                {processTitle.includes("Our network.") ? (
                  <>
                    Your campaign.
                    <br />

                    <span className="text-white/45">
                      Our network.
                    </span>
                  </>
                ) : (
                  processTitle
                )}

              </h2>

            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {processSteps.map((step, index) => (

                <motion.div
                  key={step.number}
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
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#061f46]/70 p-7 transition duration-300 hover:border-[#63b1ff]/40 hover:bg-[#1479e8]/15"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-4xl font-black text-[#63b1ff]">
                      {step.number}
                    </span>

                    <ArrowRight
                      size={20}
                      className="text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-[#63b1ff]"
                    />

                  </div>

                  <div className="mt-12 h-px w-10 bg-[#63b1ff]/50 transition-all duration-300 group-hover:w-16" />

                  <h3 className="mt-7 text-xl font-black text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                    {step.text}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </section>

        {/* ====================================================
            CTA
        ==================================================== */}

        <section className="relative overflow-hidden bg-[#061a3a] px-5 py-10 sm:px-8 lg:px-8">

          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#63b1ff]/30 bg-[#1479e8] shadow-2xl shadow-[#1479e8]/20">

            <img
              src={networkHeroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-10"
              onError={(event) => {
                event.currentTarget.src =
                  networkFallbackImage;
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

                {ctaTitle.includes("on our network.") ? (
                  <>
                    Put your brand
                    <br />

                    <span className="text-white/70">
                      on our network.
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

