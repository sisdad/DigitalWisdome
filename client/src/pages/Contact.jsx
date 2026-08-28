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
    return `${API_SERVER_URL}${image}`;
  }

  return `${API_SERVER_URL}/${image}`;
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
    contactIntro.title || "Start a conversation.";

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
    inquiryForm.eyebrow || "Advertising Inquiry";

  const inquiryTitle =
    inquiryForm.title ||
    "Tell us what you want to promote.";

  const submitText =
    inquiryContent.submit_text ||
    inquiryForm.button_text ||
    "Send Advertising Request";

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
    "A simple path from inquiry to campaign.";

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
      <div className="min-h-screen bg-[#05070a] text-white">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-5 pt-32">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#1479e8]" />

            <p className="mt-5 text-sm text-white/40">
              Loading Contact Digital Wisdom...
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
            <div className="absolute left-[5%] top-[10%] h-[450px] w-[450px] rounded-full bg-[#1479e8]/10 blur-3xl" />

            <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#1479e8]/[0.07] blur-3xl" />

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
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">

              {/* =================================================
                  HERO TEXT
              ================================================= */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <SectionTitle
                  eyebrow={heroEyebrow}
                  title={heroTitle}
                  description={heroDescription}
                />
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
                  <div className="absolute -inset-5 rounded-[2.5rem] bg-[#1479e8]/10 blur-3xl" />

                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-2 shadow-2xl shadow-black/40">
                    <img
                      src={heroImage}
                      alt={heroTitle}
                      className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[400px] lg:h-[450px]"
                      onError={(event) => {
                        console.error(
                          "CONTACT HERO IMAGE LOAD ERROR:",
                          heroImage
                        );

                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <div className="pointer-events-none absolute inset-2 rounded-[1.5rem] bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT + FORM
        ===================================================== */}
        <section className="border-y border-white/10 bg-[#090c11] py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
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
                <div className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#5fa8f5]">
                  {contactIntroEyebrow}
                </div>

                <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                  {contactIntroTitle}
                </h2>

                <p className="mt-6 max-w-md leading-7 text-white/45">
                  {contactIntroDescription}
                </p>

                <div className="mt-10 space-y-4">
                  {contactItems.map((item) => {
                    const Icon = item.icon;

                    const cardContent = (
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1479e8]/10 text-[#5fa8f5]">
                          <Icon size={20} />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-white/70">
                            {item.value}
                          </p>

                          <p className="mt-1 text-sm text-white/35">
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
                          className="block rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#1479e8]/30 hover:bg-[#1479e8]/[0.035]"
                        >
                          {cardContent}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#1479e8]/30 hover:bg-[#1479e8]/[0.035]"
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
                className="rounded-[2rem] border border-[#1479e8]/20 bg-white/[0.025] p-7 sm:p-9"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1479e8]/10 text-[#5fa8f5]">
                    <MessageSquare size={21} />
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5fa8f5]">
                      {inquiryEyebrow}
                    </div>

                    <h2 className="mt-1 text-xl font-semibold">
                      {inquiryTitle}
                    </h2>
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
                        className="mb-2 block text-sm text-white/50"
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
                        className={`w-full rounded-xl border ${
                          errors.name
                            ? "border-red-500/60"
                            : "border-white/10"
                        } bg-black/20 px-5 py-4 text-white outline-none placeholder:text-white/25 transition focus:border-[#1479e8]/60 focus:ring-2 focus:ring-[#1479e8]/10`}
                      />

                      {errors.name && (
                        <p className="mt-2 text-xs text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm text-white/50"
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
                        className={`w-full rounded-xl border ${
                          errors.email
                            ? "border-red-500/60"
                            : "border-white/10"
                        } bg-black/20 px-5 py-4 text-white outline-none placeholder:text-white/25 transition focus:border-[#1479e8]/60 focus:ring-2 focus:ring-[#1479e8]/10`}
                      />

                      {errors.email && (
                        <p className="mt-2 text-xs text-red-400">
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
                      className="mb-2 block text-sm text-white/50"
                    >
                      Company / Organization
                    </label>

                    <div className="relative">
                      <Building2
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                      />

                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company name"
                        className={`w-full rounded-xl border ${
                          errors.company
                            ? "border-red-500/60"
                            : "border-white/10"
                        } bg-black/20 py-4 pl-12 pr-5 text-white outline-none placeholder:text-white/25 transition focus:border-[#1479e8]/60 focus:ring-2 focus:ring-[#1479e8]/10`}
                      />
                    </div>

                    {errors.company && (
                      <p className="mt-2 text-xs text-red-400">
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
                      className="mb-2 block text-sm text-white/50"
                    >
                      Campaign Type
                    </label>

                    <select
                      id="campaignType"
                      name="campaignType"
                      value={form.campaignType}
                      onChange={handleChange}
                      className={`w-full appearance-none rounded-xl border ${
                        errors.campaignType
                          ? "border-red-500/60"
                          : "border-white/10"
                      } bg-[#080b10] px-5 py-4 text-white outline-none transition focus:border-[#1479e8]/60 focus:ring-2 focus:ring-[#1479e8]/10`}
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#080b10]"
                      >
                        Select campaign type
                      </option>

                      {defaultCampaignTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-[#080b10]"
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                    {errors.campaignType && (
                      <p className="mt-2 text-xs text-red-400">
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
                      className="mb-2 block text-sm text-white/50"
                    >
                      Campaign Details
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your product, service, campaign goals, preferred locations, or anything else we should know..."
                      className={`w-full resize-none rounded-xl border ${
                        errors.message
                          ? "border-red-500/60"
                          : "border-white/10"
                      } bg-black/20 px-5 py-4 text-white outline-none placeholder:text-white/25 transition focus:border-[#1479e8]/60 focus:ring-2 focus:ring-[#1479e8]/10`}
                    />

                    {errors.message && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      STATUS
                  ================================================= */}
                  {status.message && (
                    <div
                      className={`mt-5 rounded-2xl border px-5 py-4 text-sm ${
                        status.type === "success"
                          ? "border-[#1479e8]/30 bg-[#1479e8]/10 text-[#8ac5ff]"
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
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#1479e8] px-6 py-4 font-semibold text-white shadow-xl shadow-[#1479e8]/20 transition duration-300 hover:scale-[1.01] hover:bg-[#0f6ed5] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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

                  <p className="mt-4 text-center text-xs leading-5 text-white/25">
                    {securityMessage}
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHAT HAPPENS NEXT
        ===================================================== */}
        <section className="py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionTitle
              eyebrow={nextStepsEyebrow}
              title={
                <>
                  A simple path from
                  <br />
                  <span className="text-white/40">
                    inquiry to campaign.
                  </span>
                </>
              }
              description={nextStepsTitle}
            />

            <div className="mt-16 grid border-l border-white/10 lg:grid-cols-3">
              {defaultNextSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="border-b border-r border-t border-white/10 p-7 last:border-b-0 lg:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1479e8]">
                        {step.number}
                      </span>

                      <Icon
                        size={19}
                        className="text-[#1479e8]/60"
                      />
                    </div>

                    <h3 className="mt-14 text-xl font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-4 leading-7 text-white/40">
                      {step.text}
                    </p>
                  </div>
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