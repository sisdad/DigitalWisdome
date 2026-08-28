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
import SectionTitle from "../components/SectionTitle";
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
  return (
    location?.image ||
    location?.image_url ||
    location?.imageUrl ||
    networkImages[index % networkImages.length] ||
    networkFallbackImage
  );
}

// ============================================================
// NETWORK PAGE
//
// CMS:
// GET /api/public-cms/pages/network
//
// CMS controls:
// - Hero
// - Locations introduction
// - Benefits introduction
// - Process introduction
// - CTA
//
// Static:
// - Network overview
// - Location cards/images
// - Network benefits
// - Campaign process
// ============================================================

export default function Network() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD NETWORK PAGE FROM PUBLIC CMS
  // ============================================================

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

  // ============================================================
  // CMS SECTION HELPER
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

  const heroEyebrow =
    sections.hero?.eyebrow || "Our Digital Network";

  const heroTitle =
    sections.hero?.title ||
    "Advertising where attention happens.";

  const heroDescription =
    sections.hero?.description ||
    "Our 32-inch 4K digital screens are strategically positioned in selected high-traffic and premium commercial environments.";

  // ============================================================
  // LOCATIONS
  // ============================================================

  const locationsEyebrow =
    sections.locations_intro?.eyebrow ||
    "Network Locations";

  const locationsTitle =
    sections.locations_intro?.title ||
    "Reach people where they are.";

  const locationsDescription =
    sections.locations_intro?.description ||
    "Each location is selected with audience visibility, commercial activity, and advertising opportunity in mind.";

  // ============================================================
  // BENEFITS
  // ============================================================

  const benefitsEyebrow =
    sections.benefits_intro?.eyebrow ||
    "Why Our Network";

  const benefitsTitle =
    sections.benefits_intro?.title ||
    "More than a screen. A point of connection.";

  const benefitsDescription =
    sections.benefits_intro?.description ||
    "Digital Wisdom transforms strategic physical environments into opportunities for brands to communicate, engage, and remain visible.";

  // ============================================================
  // PROCESS
  // ============================================================

  const processEyebrow =
    sections.process_intro?.eyebrow ||
    "How It Works";

  const processTitle =
    sections.process_intro?.title ||
    "Your campaign. Our network.";

  // ============================================================
  // CTA
  // ============================================================

  const ctaEyebrow =
    sections.cta?.eyebrow ||
    "Reach More People";

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

  // ============================================================
  // NETWORK BENEFITS
  // ============================================================

  const benefits = [
    {
      icon: Eye,
      title: "High Visibility",
      text: "Place your brand in environments where people naturally spend time and attention.",
    },
    {
      icon: Users,
      title: "Audience Access",
      text: "Connect with consumers through strategically selected commercial environments.",
    },
    {
      icon: Zap,
      title: "Dynamic Content",
      text: "Deliver engaging video and visual campaigns through modern digital displays.",
    },
    {
      icon: BarChart3,
      title: "Brand Impact",
      text: "Build stronger awareness through repeated and highly visible digital exposure.",
    },
  ];

  // ============================================================
  // CAMPAIGN PROCESS
  // ============================================================

  const processSteps = [
    {
      number: "01",
      title: "Choose Your Audience",
      text: "Identify the audience and environment that best match your campaign.",
    },
    {
      number: "02",
      title: "Select Locations",
      text: "Choose the digital advertising locations that fit your campaign objectives.",
    },
    {
      number: "03",
      title: "Deliver Your Content",
      text: "Provide your approved visual advertising content for digital display.",
    },
    {
      number: "04",
      title: "Build Visibility",
      text: "Your campaign reaches audiences through our strategically positioned network.",
    },
  ];

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] text-white">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-5 pt-32">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#1479e8]" />

            <p className="mt-5 text-sm text-white/40">
              Loading Network...
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

            <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#1479e8]/10 blur-3xl" />

            <div className="absolute right-[-10%] top-[5%] h-[500px] w-[500px] rounded-full bg-[#1479e8]/[0.07] blur-3xl" />

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

            {/* HERO TEXT */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SectionTitle
                eyebrow={heroEyebrow}
                title={
                  heroTitle.includes("attention happens.") ? (
                    <>
                      Advertising where
                      <br />

                      <span className="bg-gradient-to-r from-white to-[#1479e8] bg-clip-text text-transparent">
                        attention happens.
                      </span>
                    </>
                  ) : (
                    heroTitle
                  )
                }
                description={heroDescription}
              />
            </motion.div>

            {/* =================================================
                HERO NETWORK IMAGE
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="relative mt-16 overflow-hidden rounded-[2rem] border border-[#1479e8]/20 bg-black"
            >

              <img
                src={networkHeroImage}
                alt="Digital Wisdom digital advertising network"
                className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
                onError={(event) => {
                  event.currentTarget.src = networkFallbackImage;
                }}
              />

              {/* IMAGE OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/35 to-transparent" />

              <div className="absolute inset-0 bg-gradient-to-r from-[#05070a]/60 via-transparent to-[#05070a]/30" />

              {/* IMAGE CONTENT */}

              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10 lg:p-12">

                <div className="max-w-2xl">

                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#8bc4ff]">

                    <span className="h-2 w-2 rounded-full bg-[#1479e8] shadow-lg shadow-[#1479e8]" />

                    Digital Wisdom Network

                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                    Digital visibility where people connect.
                  </h2>

                  <p className="mt-5 max-w-xl leading-7 text-white/60">
                    Modern digital displays designed to keep brands visible,
                    engaging, and memorable in high-attention environments.
                  </p>

                </div>

              </div>

            </motion.div>

            {/* =================================================
                NETWORK OVERVIEW
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.25,
              }}
              className="mt-5 grid gap-4 sm:grid-cols-3"
            >

              {/* 32" */}

              <div className="rounded-3xl border border-[#1479e8]/20 bg-[#1479e8]/[0.035] p-7">

                <MonitorPlay
                  size={23}
                  className="text-[#5fa8f5]"
                />

                <div className="mt-7 text-3xl font-semibold">
                  32"
                </div>

                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Digital Screens
                </div>

              </div>

              {/* 4K */}

              <div className="rounded-3xl border border-[#1479e8]/20 bg-[#1479e8]/[0.035] p-7">

                <Zap
                  size={23}
                  className="text-[#5fa8f5]"
                />

                <div className="mt-7 text-3xl font-semibold">
                  4K
                </div>

                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Display Quality
                </div>

              </div>

              {/* 24/7 */}

              <div className="rounded-3xl border border-[#1479e8]/20 bg-[#1479e8]/[0.035] p-7">

                <Target
                  size={23}
                  className="text-[#5fa8f5]"
                />

                <div className="mt-7 text-3xl font-semibold">
                  24/7
                </div>

                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Brand Visibility
                </div>

              </div>

            </motion.div>

          </div>
        </section>

        {/* =====================================================
            LOCATIONS
        ===================================================== */}

        <section className="border-y border-white/10 bg-[#090c11] py-28">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>

                <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1479e8]">

                  <MapPin size={15} />

                  {locationsEyebrow}

                </div>

                <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">

                  {locationsTitle.includes("where they are.") ? (
                    <>
                      Reach people
                      <br />

                      <span className="text-white/40">
                        where they are.
                      </span>
                    </>
                  ) : (
                    locationsTitle
                  )}

                </h2>

              </div>

              <p className="max-w-md leading-7 text-white/45">
                {locationsDescription}
              </p>

            </div>

            {/* =================================================
                LOCATION CARDS
            ================================================= */}

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
                      className="group relative min-h-[390px] overflow-hidden rounded-3xl border border-white/10 bg-black transition duration-300 hover:border-[#1479e8]/40"
                    >

                      {/* LOCATION IMAGE */}

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

                      {/* IMAGE OVERLAY */}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/75 to-[#05070a]/15" />

                      {/* BLUE GLOW */}

                      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#1479e8]/20 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />

                      {/* CARD CONTENT */}

                      <div className="relative flex min-h-[390px] flex-col justify-between p-7 sm:p-8">

                        {/* TOP */}

                        <div className="flex items-start justify-between">

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1479e8]/30 bg-[#1479e8]/20 text-[#8bc4ff] backdrop-blur-md transition duration-300 group-hover:bg-[#1479e8] group-hover:text-white">

                            <Icon size={21} />

                          </div>

                          <span className="text-sm font-medium tracking-wider text-[#8bc4ff]/80">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                        </div>

                        {/* BOTTOM */}

                        <div>

                          <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {location.title}
                          </h3>

                          <p className="mt-4 max-w-xl leading-7 text-white/60">
                            {location.description}
                          </p>

                          <div className="mt-7 flex items-center gap-2 text-sm text-white/50 transition group-hover:text-[#8bc4ff]">

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

                <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center">

                  <MapPin
                    size={28}
                    className="mx-auto text-[#5fa8f5]"
                  />

                  <p className="mt-5 text-white/40">
                    Network locations will appear here.
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            NETWORK ADVANTAGES
        ===================================================== */}

        <section className="py-28">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <SectionTitle
              eyebrow={benefitsEyebrow}
              title={
                benefitsTitle.includes(
                  "A point of connection."
                ) ? (
                  <>
                    More than a screen.
                    <br />

                    <span className="text-white/40">
                      A point of connection.
                    </span>
                  </>
                ) : (
                  benefitsTitle
                )
              }
              description={benefitsDescription}
            />

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {benefits.map((benefit, index) => {

                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={benefit.title}
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
                      {benefit.title}
                    </h3>

                    <p className="mt-4 leading-7 text-white/40">
                      {benefit.text}
                    </p>

                  </motion.div>
                );
              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="border-y border-white/10 bg-[#090c11] py-28">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <SectionTitle
              eyebrow={processEyebrow}
              title={
                processTitle.includes("Our network.") ? (
                  <>
                    Your campaign.
                    <br />

                    <span className="text-white/40">
                      Our network.
                    </span>
                  </>
                ) : (
                  processTitle
                )
              }
            />

            <div className="mt-16 grid gap-0 border-l border-white/10 lg:grid-cols-4">

              {processSteps.map((step) => (

                <div
                  key={step.number}
                  className="border-b border-r border-t border-white/10 p-7 last:border-b-0 lg:border-b-0"
                >

                  <div className="text-sm text-[#1479e8]">
                    {step.number}
                  </div>

                  <h3 className="mt-16 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-white/40">
                    {step.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="px-5 py-10 lg:px-8">

          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#1479e8]/20 bg-[#1479e8]/[0.045]">

            {/* CTA BACKGROUND IMAGE */}

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

            <div className="absolute inset-0 bg-[#05070a]/85" />

            <div className="pointer-events-none absolute left-1/2 top-[-100px] h-72 w-72 -translate-x-1/2 rounded-full bg-[#1479e8]/15 blur-3xl" />

            <div className="relative px-7 py-20 text-center sm:px-12 sm:py-24">

              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5fa8f5]">
                {ctaEyebrow}
              </div>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">

                {ctaTitle.includes("on our network.") ? (
                  <>
                    Put your brand
                    <br />

                    <span className="text-white/40">
                      on our network.
                    </span>
                  </>
                ) : (
                  ctaTitle
                )}

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