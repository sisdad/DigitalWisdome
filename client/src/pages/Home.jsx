import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  Hotel,
  MapPin,
  Play,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Users,
  Utensils,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPublicPage, getPublicLocations } from "../api/publicCmsApi";
import { SERVER_BASE_URL } from "../config/api";

const locationIcons = { Building2, Hotel, MapPin, ShoppingBag, Store, Utensils };

function parseJsonContent(value, fallback = null) {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getCmsImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return "";
  const value = imageUrl.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${SERVER_BASE_URL}${value}`;
  return `${SERVER_BASE_URL}/${value}`;
}

function CmsImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  const imageUrl = getCmsImageUrl(src);
  if (!imageUrl || failed) return null;
  return (
    <img
      src={imageUrl}
      alt={alt || "Digital Wisdom"}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

const Reveal = ({ children, className = "", delay = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Eyebrow = ({ children }) => (
  <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#72b8ff] sm:text-[11px]">
    <span className="h-px w-8 bg-[#2f8df5]" />
    {children}
  </div>
);

const LuxuryButton = ({ href, children, secondary = false }) => (
  <a
    href={href}
    className={
      secondary
        ? "group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:border-white/30 hover:bg-white/[0.09]"
        : "group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#061a3a] shadow-[0_15px_50px_rgba(255,255,255,0.10)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e8f3ff]"
    }
  >
    {children}
    <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </a>
);

export default function Home() {
  const [cmsPage, setCmsPage] = useState(null);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsError, setCmsError] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadHomeCms() {
      try {
        setCmsLoading(true);
        setCmsError("");
        const response = await getPublicPage("home");
        const pageData = response?.data || response;
        if (!pageData) throw new Error("Home page CMS data is empty.");
        if (mounted) setCmsPage(pageData);
      } catch (error) {
        console.error("HOME CMS LOAD ERROR:", error);
        if (mounted) setCmsError(error?.message || "Unable to load Home CMS content.");
      } finally {
        if (mounted) setCmsLoading(false);
      }
    }
    loadHomeCms();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadLocations() {
      try {
        setLocationsLoading(true);
        const response = await getPublicLocations();
        const locationData = response?.data || response;
        if (mounted) setLocations(Array.isArray(locationData) ? locationData : []);
      } catch (error) {
        console.error("HOME LOCATIONS LOAD ERROR:", error);
        if (mounted) setLocations([]);
      } finally {
        if (mounted) setLocationsLoading(false);
      }
    }
    loadLocations();
    return () => { mounted = false; };
  }, []);

  const sections = {};
  (Array.isArray(cmsPage?.sections) ? cmsPage.sections : []).forEach((section) => {
    if (section?.section_key) sections[section.section_key] = section;
  });

  const hero = sections.hero || {};
  const heroEyebrow = hero.eyebrow || "Digital Advertising & Promotion";
  const heroTitle = hero.title || "Make your brand impossible to overlook.";
  const heroDescription = hero.description || "Premium indoor digital advertising that places your message in front of audiences where attention naturally happens.";
  const heroButtonText = hero.button_text || "Advertise With Us";
  const heroButtonUrl = hero.button_url || "/contact";
  const heroImage = hero.image_url || "";
  const heroContent = parseJsonContent(hero.content, {});

  const about = sections.about_preview || {};
  const aboutEyebrow = about.eyebrow || "The Digital Wisdom Difference";
  const aboutTitle = about.title || "Advertising designed around attention.";
  const aboutDescription = about.description || "Digital Wisdom Advertising & Promotion connects brands with consumers through strategically positioned digital media environments.";
  const aboutContent = about.content || "We combine premium digital screens, thoughtful placement and strong visual communication to help campaigns become visible, memorable and relevant.";
  const aboutButtonText = about.button_text || "Discover Digital Wisdom";
  const aboutButtonUrl = about.button_url || "/about";
  const aboutImage = about.image_url || "";

  const network = sections.network_intro || {};
  const networkEyebrow = network.eyebrow || "The Network";
  const networkTitle = network.title || "Premium screens. Strategic environments.";
  const networkDescription = network.description || "Reach people in carefully selected indoor environments where brands can own attention without competing with a crowded outdoor landscape.";
  const networkButtonText = network.button_text || "Explore Our Network";
  const networkButtonUrl = network.button_url || "/network";
  const networkImage = network.image_url || "";
  const networkContent = network.content || "";

  const solutions = sections.solutions_intro || {};
  const solutionsEyebrow = solutions.eyebrow || "Campaigns";
  const solutionsTitle = solutions.title || "One screen. Many ways to tell your story.";
  const solutionsDescription = solutions.description || "From product launches to always-on brand visibility, our digital media environment supports campaigns that are clear, flexible and visually powerful.";
  const solutionsButtonText = solutions.button_text || "Explore Advertising Solutions";
  const solutionsButtonUrl = solutions.button_url || "/solutions";
  const solutionsImage = solutions.image_url || "";
  const defaultSolutions = ["Video Advertising", "Image Advertising", "Product Launches", "Brand Campaigns", "Promotional Messages", "Seasonal Campaigns", "Targeted Advertising", "Corporate Communication"];
  const parsedSolutions = parseJsonContent(solutions.content, defaultSolutions);
  const solutionsItems = Array.isArray(parsedSolutions) ? parsedSolutions : defaultSolutions;

  const philosophy = sections.philosophy || {};
  const philosophyEyebrow = philosophy.eyebrow || "Our Philosophy";
  const philosophyTitle = philosophy.title || "Right place. Right audience. Right message.";
  const philosophyDescription = philosophy.description || "Great promotion is not simply about being visible. It is about being visible in an environment where the message has a chance to matter.";
  const philosophyImage = philosophy.image_url || "";
  const defaultPillars = [
    { number: "01", title: "Right Location", text: "Strategic environments with strong consumer footfall." },
    { number: "02", title: "Right Audience", text: "Connect your brand with people in relevant environments." },
    { number: "03", title: "Right Message", text: "Creative visual content designed to capture attention." },
    { number: "04", title: "Right Time", text: "Flexible digital campaigns delivered when they matter." },
  ];
  const parsedPillars = parseJsonContent(philosophy.content, defaultPillars);
  const philosophyPillars = Array.isArray(parsedPillars) ? parsedPillars : defaultPillars;
  const philosophyIcons = [Target, Users, Sparkles, Zap];

  const vision = sections.vision || {};
  const visionEyebrow = vision.eyebrow || "The Vision";
  const visionTitle = vision.title || "From Ethiopia to East Africa.";
  const visionDescription = vision.description || "To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.";
  const visionContent = vision.content || "Building the future of digital advertising";
  const visionImage = vision.image_url || "";

  const cta = sections.cta || {};
  const ctaEyebrow = cta.eyebrow || "Start Something Visible";
  const ctaTitle = cta.title || "Put your brand where attention happens.";
  const ctaDescription = cta.description || "Let's create a digital advertising campaign built around your audience, your message and your goals.";
  const ctaButtonText = cta.button_text || "Start Your Campaign";
  const ctaButtonUrl = cta.button_url || "/contact";
  const ctaImage = cta.image_url || "";

  const displayQuality = heroContent?.display_quality || "4K";
  const screenSize = heroContent?.screen_size || '32"';
  const visibility = heroContent?.visibility || "24/7";
  const screenBadgeTitle = heroContent?.screen_badge_title || "High Engagement";
  const screenBadgeText = heroContent?.screen_badge_text || "Strategic digital placement";
  const screenLabel = heroContent?.screen_label || "Premium digital media";
  const screenTitle = heroContent?.screen_title || "Be seen. Be remembered.";
  const screenCampaignText = heroContent?.screen_campaign_text || "Dynamic digital campaigns";
  const screenStatus = heroContent?.screen_status || "Network Active";
  const secondaryButtonText = heroContent?.secondary_button_text || "Explore Our Network";
  const secondaryButtonUrl = heroContent?.secondary_button_url || "#network";

  if (cmsLoading) {
    return (
      <div className="min-h-screen bg-[#041328] text-white">
        <Navbar />
        <main className="flex min-h-[75vh] items-center justify-center px-6 pt-28">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-white/10 border-t-[#4aa3ff]" />
            <p className="mt-5 text-sm tracking-wide text-white/45">Preparing Digital Wisdom...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cmsPage) {
    return (
      <div className="min-h-screen bg-[#041328] text-white">
        <Navbar />
        <main className="flex min-h-[75vh] items-center justify-center px-6 pt-28">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10">
              <Zap size={22} className="text-red-300" />
            </div>
            <h1 className="mt-6 text-2xl font-bold">Unable to load website content</h1>
            <p className="mt-3 text-sm leading-6 text-white/45">{cmsError || "The Home CMS page could not be loaded."}</p>
            <button onClick={() => window.location.reload()} className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#061a3a] transition hover:bg-[#e8f3ff]">Try Again</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#041328] text-white selection:bg-[#2588e8] selection:text-white">
      <Navbar />

      {/* HERO — cinematic luxury media presentation */}
      <section id="home" className="relative min-h-screen overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-[#041328]" />
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -right-20 top-20 h-[520px] w-[520px] rounded-full bg-[#1479e8]/10 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#0d4c8c]/20 blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#041328_0%,rgba(4,19,40,.92)_42%,rgba(4,19,40,.45)_72%,#041328_100%)]" />
        </div>

        <div className="relative mx-auto grid min-h-screen max-w-[1500px] items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:pt-36">
          <div className="relative z-10 max-w-2xl">
            <Reveal y={18}>
              <Eyebrow>{heroEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05} y={28}>
              <h1 className="max-w-3xl text-[clamp(3.5rem,7vw,7.8rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-white">
                {heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={0.12} y={20}>
              <p className="mt-8 max-w-xl text-base font-normal leading-7 text-white/62 sm:text-lg">
                {heroDescription}
              </p>
            </Reveal>
            <Reveal delay={0.18} y={18}>
              <div className="mt-9 flex flex-wrap gap-3">
                <LuxuryButton href={heroButtonUrl}>{heroButtonText}</LuxuryButton>
                <LuxuryButton href={secondaryButtonUrl} secondary>{secondaryButtonText}</LuxuryButton>
              </div>
            </Reveal>
            <Reveal delay={0.24} y={16}>
              <div className="mt-12 flex max-w-xl border-t border-white/10 pt-6">
                {[
                  [displayQuality, "Display"],
                  [screenSize, "Screen"],
                  [visibility, "Visibility"],
                ].map(([value, label], index) => (
                  <div key={label} className={`pr-7 ${index > 0 ? "ml-7 border-l border-white/10 pl-7" : ""}`}>
                    <div className="text-xl font-semibold tracking-tight text-white">{value}</div>
                    <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">{label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} y={30} className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px]">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#1479e8]/10 blur-[60px]" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.035] p-2 shadow-[0_35px_100px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-3">
                <div className="relative aspect-[1.02/1] overflow-hidden rounded-[1.5rem] bg-[#0a2444]">
                  {heroImage ? (
                    <>
                      <CmsImage src={heroImage} alt={heroTitle} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020a15]/90 via-[#020a15]/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8fcaff]">Digital Wisdom</div>
                        <div className="mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">{screenTitle}</div>
                      </div>
                    </>
                  ) : (
                    <div className="relative flex h-full flex-col justify-between overflow-hidden p-7 sm:p-10">
                      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1479e8]/15 blur-3xl" />
                      <div className="relative flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8fcaff]">Digital Wisdom</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"><Play size={13} fill="currentColor" /></span>
                      </div>
                      <div className="relative">
                        <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">{screenLabel}</div>
                        <div className="max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">{screenTitle}</div>
                        <div className="mt-7 flex items-center gap-3 text-xs text-white/45"><span className="h-1.5 w-1.5 rounded-full bg-[#4aa3ff]" />{screenCampaignText}</div>
                      </div>
                      <div className="relative flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30"><span className="h-1.5 w-1.5 rounded-full bg-[#43b7ff] shadow-[0_0_15px_#43b7ff]" />{screenStatus}</div>
                    </div>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -bottom-5 left-5 rounded-2xl border border-white/10 bg-[#07192e]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:left-[-28px] sm:px-5 sm:py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1479e8] text-white"><BarChart3 size={17} /></div>
                  <div><div className="text-xs font-bold">{screenBadgeTitle}</div><div className="mt-0.5 text-[10px] text-white/40">{screenBadgeText}</div></div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-24">
            <Reveal>
              <Eyebrow>{aboutEyebrow}</Eyebrow>
              <h2 className="max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{aboutTitle}</h2>
              <div className="mt-8 h-px w-20 bg-[#2f8df5]" />
            </Reveal>
            <Reveal delay={0.08}>
              {aboutImage && (
                <div className="group relative mb-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025]">
                  <CmsImage src={aboutImage} alt={aboutTitle} className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-[1.025] sm:h-[390px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041328]/55 to-transparent" />
                </div>
              )}
              <p className="max-w-2xl text-lg leading-8 text-white/70">{aboutDescription}</p>
              {aboutContent && <p className="mt-5 max-w-2xl leading-7 text-white/45">{aboutContent}</p>}
              <a href={aboutButtonUrl} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#6eb5ff]">{aboutButtonText}<ArrowUpRight size={16} /></a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NETWORK */}
      <section id="network" className="relative border-y border-white/[0.06] bg-[#061b36] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <Reveal className="max-w-4xl">
            <Eyebrow>{networkEyebrow}</Eyebrow>
            <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{networkTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/55">{networkDescription}</p>
          </Reveal>

          {networkImage && (
            <Reveal delay={0.08} className="mt-12">
              <div className="group relative overflow-hidden rounded-[2rem] border border-white/10">
                <CmsImage src={networkImage} alt={networkTitle} className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-[500px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020a15]/85 via-transparent to-transparent" />
                {networkContent && <div className="absolute bottom-7 left-7 max-w-2xl text-2xl font-semibold tracking-tight sm:bottom-10 sm:left-10 sm:text-4xl">{networkContent}</div>}
              </div>
            </Reveal>
          )}

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {locationsLoading ? Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-52 animate-pulse bg-[#082443]" />) : locations.length ? locations.map((location, index) => {
              const Icon = locationIcons[location.icon] || MapPin;
              return (
                <Reveal key={location.id || index} delay={index * 0.035} className="h-full">
                  <div className="group h-full bg-[#061b36] p-7 transition duration-300 hover:bg-[#09264a] sm:p-8">
                    <div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#6eb5ff] transition group-hover:border-[#1479e8]/40 group-hover:bg-[#1479e8]/10"><Icon size={18} /></div><span className="text-[9px] font-bold tracking-[0.2em] text-white/20">{String(index + 1).padStart(2, "0")}</span></div>
                    <h3 className="mt-12 text-lg font-semibold">{location.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/45">{location.description}</p>
                  </div>
                </Reveal>
              );
            }) : <div className="col-span-full bg-[#061b36] p-10 text-center text-sm text-white/35"><MapPin size={24} className="mx-auto mb-3 text-[#4aa3ff]" />Our network locations will be available soon.</div>}
          </div>

          <div className="mt-8"><a href={networkButtonUrl} className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white">{networkButtonText}<ArrowUpRight size={16} /></a></div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <Reveal>
              <Eyebrow>{solutionsEyebrow}</Eyebrow>
              <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{solutionsTitle}</h2>
              <p className="mt-7 max-w-md leading-7 text-white/50">{solutionsDescription}</p>
              <a href={solutionsButtonUrl} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#6eb5ff]">{solutionsButtonText}<ArrowUpRight size={16} /></a>
            </Reveal>
            <Reveal delay={0.08}>
              {solutionsImage && <div className="group mb-8 overflow-hidden rounded-[1.75rem] border border-white/10"><CmsImage src={solutionsImage} alt={solutionsTitle} className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-[1.025] sm:h-[330px]" /></div>}
              <div className="divide-y divide-white/10 border-y border-white/10">
                {solutionsItems.map((item, index) => {
                  const title = typeof item === "string" ? item : item?.title || item?.name || "";
                  return <div key={`${title}-${index}`} className="group flex items-center gap-5 py-5 transition hover:px-2"><span className="w-7 text-[10px] font-bold tracking-widest text-white/20">{String(index + 1).padStart(2, "0")}</span><span className="flex-1 text-base font-medium text-white/75 transition group-hover:text-white">{title}</span><Check size={16} className="text-white/15 transition group-hover:text-[#62adff]" /></div>;
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-y border-white/[0.06] bg-[#061b36] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <Reveal className="max-w-3xl">
            <Eyebrow>{philosophyEyebrow}</Eyebrow>
            <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{philosophyTitle}</h2>
            <p className="mt-6 max-w-2xl leading-7 text-white/50">{philosophyDescription}</p>
          </Reveal>
          {philosophyImage && <Reveal delay={0.08} className="mt-12"><div className="overflow-hidden rounded-[2rem] border border-white/10"><CmsImage src={philosophyImage} alt={philosophyTitle} className="h-[300px] w-full object-cover sm:h-[430px]" /></div></Reveal>}
          <div className="mt-12 grid border-l border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {philosophyPillars.map((pillar, index) => {
              const Icon = philosophyIcons[index] || Target;
              return <Reveal key={`${pillar.number || index}-${pillar.title || index}`} delay={index * 0.05} className="h-full"><div className="group h-full border-b border-r border-t border-white/10 p-6 transition hover:bg-white/[0.025] sm:p-7 lg:min-h-[285px] lg:border-b-0"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.2em] text-white/25">{pillar.number || String(index + 1).padStart(2, "0")}</span><Icon size={19} className="text-[#4b9bea]/60 transition group-hover:text-[#72b8ff]" /></div><h3 className="mt-14 text-xl font-semibold">{pillar.title}</h3><p className="mt-4 text-sm leading-6 text-white/45">{pillar.text}</p></div></Reveal>;
            })}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-24">
            <Reveal>
              <Eyebrow>{visionEyebrow}</Eyebrow>
              <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{visionTitle}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              {visionImage && <div className="mb-7 overflow-hidden rounded-[1.75rem] border border-white/10"><CmsImage src={visionImage} alt={visionTitle} className="h-[280px] w-full object-cover sm:h-[350px]" /></div>}
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#2c8de7]/20 bg-gradient-to-br from-[#0b2e58] to-[#061a33] p-8 sm:p-10">
                <Sparkles size={22} className="text-[#71b9ff]" />
                <p className="mt-7 text-xl font-medium leading-8 text-white/80 sm:text-2xl sm:leading-9">{visionDescription}</p>
                {visionContent && <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-[#4aa3ff]" />{visionContent}</div>}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-5 pb-8 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-[1280px]">
          <div className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#09284d]">
            {ctaImage && <><CmsImage src={ctaImage} alt={ctaTitle} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-[1.02]" /><div className="absolute inset-0 bg-[#020b18]/75" /></>}
            {!ctaImage && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(42,144,239,.22),transparent_42%),linear-gradient(135deg,#0a315b,#061a34)]" />}
            <div className="relative z-10 flex min-h-[430px] flex-col items-center justify-center px-6 py-20 text-center sm:px-12">
              <Eyebrow>{ctaEyebrow}</Eyebrow>
              <h2 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{ctaTitle}</h2>
              <p className="mt-6 max-w-xl leading-7 text-white/55">{ctaDescription}</p>
              <div className="mt-9"><LuxuryButton href={ctaButtonUrl}>{ctaButtonText}</LuxuryButton></div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
