
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Target,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTitle from "../components/SectionTitle";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

const initialForm = {
  name: "",
  email: "",
  company: "",
  campaignType: "",
  message: "",
};

const defaultCampaignTypes = [
  "Video Advertising",
  "Image Advertising",
  "Product Launch",
  "Brand Campaign",
  "Promotional Campaign",
  "Other",
];

const defaultNextSteps = [
  {
    number: "01",
    title: "Tell Us About Your Campaign",
    text:
      "Share your business, advertising objective, and the type of campaign you want to run.",
    icon: Target,
  },
  {
    number: "02",
    title: "Discuss the Opportunity",
    text:
      "Our team can discuss suitable advertising options, locations, and campaign requirements.",
    icon: MessageSquare,
  },
  {
    number: "03",
    title: "Launch Your Campaign",
    text:
      "Once everything is agreed, your approved creative can be prepared for digital display.",
    icon: CheckCircle2,
  },
];

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
    console.error("CONTACT CMS CONTENT PARSE ERROR:", error);
    return {};
  }
}

// ============================================================
// BUILD CMS IMAGE URL
// ============================================================
function getCmsImageUrl(image) {
  if (!image) {
    return "";
  }

  if (typeof image === "object") {
    image =
      image.url ||
      image.path ||
      image.image_url ||
      image.src ||
      "";
  }

  if (!image || typeof image !== "string") {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SERVER_BASE_URL}${image}`;
  }

  return `${SERVER_BASE_URL}/${image}`;
}

export default function Contact() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // LOAD CONTACT PAGE FROM PUBLIC CMS
  // ============================================================
  useEffect(() => {
    let mounted = true;

    async function loadContactPage() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public-cms/pages/contact`
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
        console.error("CONTACT CMS LOAD ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadContactPage();

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

  const heroContent = parseContent(hero.content);

  const heroEyebrow =
    hero.eyebrow || "Contact Digital Wisdom";

  const heroTitle =
    hero.title ||
    "Let's put your brand in front of the right audience.";

  const heroDescription =
    hero.description ||
    "Interested in advertising with Digital Wisdom? Tell us about your business and campaign, and our team can help you explore the right advertising opportunity.";

  // ============================================================
  // HERO IMAGE FROM CMS
  // ============================================================
  const heroImage =
    getCmsImageUrl(
      hero.image_url ||
        hero.image ||
        hero.image_path ||
        heroContent.image_url ||
        heroContent.image ||
        heroContent.image_path ||
        "/uploads/cms/img7-1787706920588.jpeg"
    );

  // ============================================================
  // CONTACT INTRO
  // ============================================================
  const contactIntro = sections.contact_intro || {};

  const contactIntroEyebrow =
    contactIntro.eyebrow || "Talk To Us";

  const contactIntroTitle =
    contactIntro.title || "Let’s make your brand impossible to ignore.";

  const contactIntroDescription =
    contactIntro.description ||
    "Whether you are launching a product, building brand awareness, or promoting a special offer, we're ready to discuss your advertising goals.";

  // ============================================================
  // CONTACT DETAILS
  // ============================================================
  const contactDetails = sections.contact_details || {};

  const contactDetailsContent = parseContent(
    contactDetails.content
  );

  const phoneNumber =
    contactDetailsContent.phone ||
    "+251 911 651 099";

  const emailAddress =
    contactDetailsContent.email ||
    "sisdad37@gmail.com";

  const location =
    contactDetailsContent.location ||
    "Ethiopia";

  const phoneDescription =
    contactDetailsContent.phone_description ||
    "Speak directly with our team.";

  const emailDescription =
    contactDetailsContent.email_description ||
    "Send us your advertising inquiry.";

  const locationDescription =
    contactDetailsContent.location_description ||
    "Digital Wisdom Promotion & Advertising.";

  const contactItems = [
    {
      icon: Phone,
      title: "Phone",
      value: phoneNumber,
      description: phoneDescription,
      href: `tel:${phoneNumber.replace(/\s+/g, "")}`,
    },
    {
      icon: Mail,
      title: "Email",
      value: emailAddress,
      description: emailDescription,
      href: `mailto:${emailAddress}`,
    },
    {
      icon: MapPin,
      title: "Location",
      value: location,
      description: locationDescription,
      href: null,
    },
  ];

  // ============================================================
  // INQUIRY FORM CMS CONTENT
  // ============================================================
  const inquiryForm = sections.inquiry_form || {};

  const inquiryContent = parseContent(
    inquiryForm.content
  );

  const inquiryEyebrow =
    inquiryForm.eyebrow || "START YOUR ADVERTISING INQUIRY";

  const inquiryTitle =
    inquiryForm.title ||
    "Tell Us About Your Campaign";

  const submitText =
    inquiryContent.submit_text ||
    inquiryForm.button_text ||
    "Start My Advertising Inquiry";

  const submittingText =
    inquiryContent.submitting_text ||
    "Sending Request...";

  const successMessage =
    inquiryContent.success_message ||
    "Thank you. Your advertising request has been received. Our team will contact you soon.";

  const securityMessage =
    inquiryContent.security_message ||
    "Your inquiry will be securely submitted to Digital Wisdom.";

  // ============================================================
  // NEXT STEPS CMS CONTENT
  // ============================================================
  const nextSteps = sections.next_steps || {};

  const nextStepsEyebrow =
    nextSteps.eyebrow || "What Happens Next";

  const nextStepsTitle =
    nextSteps.title ||
    "Turn your advertising idea into a campaign.";

  // ============================================================
  // FORM CHANGE
  // ============================================================
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  }

  // ============================================================
  // FORM SUBMIT
  // ============================================================
  async function handleSubmit(event) {
    event.preventDefault();

    setErrors({});

    setStatus({
      type: "",
      message: "",
    });

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/inquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }

        throw new Error(
          data.message ||
            "Unable to submit your request."
        );
      }

      setStatus({
        type: "success",
        message: successMessage,
      });

      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#061a3a] text-white">
        <Navbar />

        <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#1479e8]/20 blur-[120px]" />

            <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#63b1ff]" />

            <p className="mt-6 text-sm font-semibold tracking-wide text-white/60">
              Loading Contact Digital Wisdom...
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

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#061a3a] pt-28 sm:pt-32 lg:pt-36">
          <div className="pointer-events-none absolute inset-0">

            {/* Network-style blue atmosphere */}
            <div className="absolute left-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#1479e8]/20 blur-[120px]" />

            <div className="absolute right-[-10%] top-[12%] h-[520px] w-[520px] rounded-full bg-[#1479e8]/15 blur-[130px]" />

            <div className="absolute bottom-[-10%] left-[35%] h-[420px] w-[520px] rounded-full bg-[#1479e8]/10 blur-[120px]" />

            {/* Network grid */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32">
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">

              {/* =================================================
                  HERO TEXT
              ================================================= */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                {/* Eyebrow */}
                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#63b1ff] shadow-[0_0_15px_rgba(99,177,255,0.8)]" />

                  <span className="text-xs font-black uppercase tracking-[0.22em] text-white">
                    {heroEyebrow}
                  </span>
                </div>

                <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[76px]">
                  {heroTitle.includes(
                    "brand in front of the right audience."
                  ) ? (
                    <>
                      Let&apos;s put your
                      <br />
                      <span className="bg-gradient-to-r from-[#63b1ff] via-[#8bc4ff] to-white bg-clip-text text-transparent">
                        brand in front of the right audience.
                      </span>
                    </>
                  ) : (
                    heroTitle
                  )}
                </h1>

                <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/75 sm:text-xl sm:leading-9">
                  {heroDescription}
                </p>

                {/* Small decorative line */}
                <div className="mt-9 flex items-center gap-3">
                  <div className="h-px w-14 bg-[#63b1ff]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#63b1ff]" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                    Digital Wisdom
                  </span>
                </div>
              </motion.div>

              {/* =================================================
                  HERO CMS IMAGE
              ================================================= */}
              {heroImage && (
                <motion.div
                  initial={{ opacity: 0, x: 30, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15,
                  }}
                  className="relative"
                >
                  <div className="absolute -inset-7 rounded-[2.5rem] bg-[#1479e8]/15 blur-[70px]" />

                  <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.07] p-2 shadow-2xl shadow-black/40 backdrop-blur-sm">
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                      <img
                        src={heroImage}
                        alt={heroTitle}
                        className="h-[340px] w-full object-cover sm:h-[430px] lg:h-[500px]"
                        onError={(event) => {
                          console.error(
                            "CONTACT HERO IMAGE LOAD ERROR:",
                            heroImage
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      {/* Image overlays */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061a3a] via-[#061a3a]/15 to-transparent" />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#061a3a]/40 via-transparent to-transparent" />

                      {/* Image badge */}
                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#061a3a]/75 p-5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1479e8] text-white">
                            <MessageSquare size={18} />
                          </div>

                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#63b1ff]">
                              Advertising Inquiry
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                              Let&apos;s start a conversation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT + FORM
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#082b5f] py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-10%] top-[20%] h-[450px] w-[450px] rounded-full bg-[#1479e8]/10 blur-[120px]" />

            <div className="absolute right-[-10%] bottom-[0%] h-[500px] w-[500px] rounded-full bg-[#1479e8]/10 blur-[130px]" />

            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">

              {/* =================================================
                  CONTACT INFORMATION
              ================================================= */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
              >
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-[#63b1ff]" />

                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#63b1ff]">
                    {contactIntroEyebrow}
                  </span>
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
                  {contactIntroTitle}
                </h2>

                <p className="mt-6 max-w-md text-base font-medium leading-7 text-white">
                  {contactIntroDescription}
                </p>

                <div className="mt-10 space-y-4">
                  {contactItems.map((item) => {
                    const Icon = item.icon;

                    const cardContent = (
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1479e8] text-white shadow-lg shadow-[#1479e8]/20">
                          <Icon size={20} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-black text-white">
                            {item.title}
                          </h3>

                          <p className="mt-1 break-words font-semibold text-white/80">
                            {item.value}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/45">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <a
                          key={item.title}
                          href={item.href}
                          className="group block rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#63b1ff]/50 hover:bg-[#1479e8]/15"
                        >
                          {cardContent}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={item.title}
                        className="group rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#63b1ff]/50 hover:bg-[#1479e8]/15"
                      >
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* =================================================
                  FORM
              ================================================= */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-[2.5rem] bg-[#1479e8]/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2.25rem] border border-[#63b1ff]/30 bg-[#041a3c]/95 p-7 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-9 lg:p-10">

                  {/* Premium inquiry glow */}
                  <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#1479e8]/25 blur-[90px]" />
                  <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-[#1479e8]/10 blur-[80px]" />

                  {/* Form header */}
                  <div className="relative">
                    <div className="inline-flex items-center gap-3 rounded-full border border-[#1479e8]/50 bg-[#1479e8]/20 px-4 py-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#63b1ff] shadow-[0_0_14px_rgba(99,177,255,0.9)]" />
                      <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#63b1ff]">
                        {inquiryEyebrow}
                      </span>
                    </div>

                    <h2 className="mt-6 max-w-2xl text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl lg:text-[44px]">
                      {inquiryTitle}
                    </h2>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {["Reach More Customers", "Premium Digital Screens", "Targeted Visibility"].map((benefit) => (
                        <span
                          key={benefit}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/65"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-8"
                  >
                    {/* =================================================
                        NAME + EMAIL
                    ================================================= */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-black text-white"
                        >
                          Your Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Full name"
                          className={`w-full rounded-2xl border ${
                            errors.name
                              ? "border-red-500/60"
                              : "border-white/15"
                          } bg-[#061a3a]/70 px-5 py-4 font-semibold text-white outline-none placeholder:text-white/30 transition duration-300 focus:border-[#63b1ff]/70 focus:bg-[#061a3a] focus:ring-2 focus:ring-[#1479e8]/20`}
                        />

                        {errors.name && (
                          <p className="mt-2 text-xs font-medium text-red-400">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-black text-white"
                        >
                          Email Address
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full rounded-2xl border ${
                            errors.email
                              ? "border-red-500/60"
                              : "border-white/15"
                          } bg-[#061a3a]/70 px-5 py-4 font-semibold text-white outline-none placeholder:text-white/30 transition duration-300 focus:border-[#63b1ff]/70 focus:bg-[#061a3a] focus:ring-2 focus:ring-[#1479e8]/20`}
                        />

                        {errors.email && (
                          <p className="mt-2 text-xs font-medium text-red-400">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        COMPANY
                    ================================================= */}
                    <div className="mt-5">
                      <label
                        htmlFor="company"
                        className="mb-2 block text-sm font-black text-white"
                      >
                        Company / Organization
                      </label>

                      <div className="relative">
                        <Building2
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#63b1ff]/60"
                        />

                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Company name"
                          className={`w-full rounded-2xl border ${
                            errors.company
                              ? "border-red-500/60"
                              : "border-white/15"
                          } bg-[#061a3a]/70 py-4 pl-12 pr-5 font-semibold text-white outline-none placeholder:text-white/30 transition duration-300 focus:border-[#63b1ff]/70 focus:bg-[#061a3a] focus:ring-2 focus:ring-[#1479e8]/20`}
                        />
                      </div>

                      {errors.company && (
                        <p className="mt-2 text-xs font-medium text-red-400">
                          {errors.company}
                        </p>
                      )}
                    </div>

                    {/* =================================================
                        CAMPAIGN TYPE
                    ================================================= */}
                    <div className="mt-5">
                      <label
                        htmlFor="campaignType"
                        className="mb-2 block text-sm font-black text-white"
                      >
                        Campaign Type
                      </label>

                      <select
                        id="campaignType"
                        name="campaignType"
                        value={form.campaignType}
                        onChange={handleChange}
                        className={`w-full appearance-none rounded-2xl border ${
                          errors.campaignType
                            ? "border-red-500/60"
                            : "border-white/15"
                        } bg-[#061a3a] px-5 py-4 font-semibold text-white outline-none transition duration-300 focus:border-[#63b1ff]/70 focus:ring-2 focus:ring-[#1479e8]/20`}
                      >
                        <option
                          value=""
                          disabled
                          className="bg-[#061a3a]"
                        >
                          Select campaign type
                        </option>

                        {defaultCampaignTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-[#061a3a]"
                          >
                            {type}
                          </option>
                        ))}
                      </select>

                      {errors.campaignType && (
                        <p className="mt-2 text-xs font-medium text-red-400">
                          {errors.campaignType}
                        </p>
                      )}
                    </div>

                    {/* =================================================
                        MESSAGE
                    ================================================= */}
                    <div className="mt-5">
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-black text-white"
                      >
                        Campaign Details
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what you want to promote, your campaign goal, preferred locations, target audience, timing, or any details that will help us understand your advertising needs..."
                        className={`w-full resize-none rounded-2xl border ${
                          errors.message
                            ? "border-red-500/60"
                            : "border-white/15"
                        } bg-[#061a3a]/70 px-5 py-4 font-semibold leading-7 text-white outline-none placeholder:text-white/30 transition duration-300 focus:border-[#63b1ff]/70 focus:bg-[#061a3a] focus:ring-2 focus:ring-[#1479e8]/20`}
                      />

                      {errors.message && (
                        <p className="mt-2 text-xs font-medium text-red-400">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* =================================================
                        STATUS
                    ================================================= */}
                    {status.message && (
                      <div
                        className={`mt-5 rounded-2xl border px-5 py-4 text-sm font-medium leading-6 ${
                          status.type === "success"
                            ? "border-[#1479e8]/50 bg-[#1479e8]/20 text-[#a8d5ff]"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {status.message}
                      </div>
                    )}

                    {/* =================================================
                        SUBMIT
                    ================================================= */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#8bc4ff]/40 bg-[#1479e8] px-6 py-5 text-base font-black text-white shadow-[0_15px_45px_rgba(20,121,232,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(20,121,232,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          {submittingText}
                        </>
                      ) : (
                        <>
                          <Send size={17} />

                          {submitText}

                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-center text-xs font-medium leading-5 text-white">
                      {securityMessage}
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHAT HAPPENS NEXT
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#061a3a] py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[5%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#1479e8]/10 blur-[120px]" />

            <div className="absolute right-[-5%] bottom-[10%] h-[450px] w-[450px] rounded-full bg-[#1479e8]/10 blur-[120px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">

            {/* Section heading */}
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#63b1ff]" />

                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#63b1ff]">
                  {nextStepsEyebrow}
                </span>
              </div>

              <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                A simple path from
                <br />
                <span className="text-white">
                  inquiry to campaign.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/65">
                {nextStepsTitle}
              </p>
            </div>

            {/* Steps */}
            <div className="relative mt-16 grid gap-5 md:grid-cols-3">
              {defaultNextSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
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
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#63b1ff]/40 hover:bg-[#1479e8]/15"
                  >
                    {/* Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-[0.15em] text-[#63b1ff]">
                        {step.number}
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1479e8]/20 text-[#63b1ff] transition duration-300 group-hover:bg-[#1479e8] group-hover:text-white">
                        <Icon size={19} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="mt-14 text-xl font-black leading-tight text-white">
                      {step.title}
                    </h3>

                    <p className="mt-4 leading-7 text-white/55">
                      {step.text}
                    </p>

                    {/* Bottom accent */}
                    <div className="mt-8 h-px w-full bg-white/10" />

                    <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#63b1ff]/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#63b1ff]" />
                      Digital Wisdom
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

