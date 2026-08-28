
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCmsPage,
  getCmsSections,
  updateCmsSection,
} from "./services/adminApi";


import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";


const STATUS_OPTIONS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

// ============================================================
// NETWORK SECTION GROUPS
// ============================================================

const NETWORK_GROUPS = [
  {
    key: "hero",
    title: "Hero",
    description:
      "Main introduction and visual identity of the Digital Wisdom network.",
    sectionKeys: ["hero"],
  },

  {
    key: "stats",
    title: "Network Statistics",
    description:
      "Key network statistics displayed to visitors.",
    sectionKeys: [
      "network_stats",
      "network_stats_4k",
      "network_stats_247",
    ],
  },

  {
    key: "locations",
    title: "Network Locations",
    description:
      "Introduction to the locations where the Digital Wisdom network operates.",
    sectionKeys: ["locations_intro"],
  },

  {
    key: "benefits",
    title: "Network Benefits",
    description:
      "Explain why brands should advertise through the Digital Wisdom network.",
    sectionKeys: [
      "benefits_intro",
      "benefit_01",
      "benefit_02",
      "benefit_03",
      "benefit_04",
    ],
  },

  {
    key: "process",
    title: "Campaign Process",
    description:
      "Explain how advertisers can launch campaigns on the network.",
    sectionKeys: [
      "process_intro",
      "process_01",
      "process_02",
      "process_03",
      "process_04",
    ],
  },

  {
    key: "cta",
    title: "Call To Action",
    description:
      "Final advertising call-to-action section.",
    sectionKeys: ["cta"],
  },
];

const SECTION_LABELS = {
  hero: "Hero",

  network_stats: '32" Digital Screens',
  network_stats_4k: "4K Display Quality",
  network_stats_247: "24/7 Brand Visibility",

  locations_intro: "Locations Introduction",

  benefits_intro: "Benefits Introduction",
  benefit_01: "High Visibility",
  benefit_02: "Audience Access",
  benefit_03: "Dynamic Content",
  benefit_04: "Brand Impact",

  process_intro: "Process Introduction",
  process_01: "Choose Your Audience",
  process_02: "Select Locations",
  process_03: "Deliver Your Content",
  process_04: "Build Visibility",

  cta: "Advertising CTA",
};

// ============================================================
// EMPTY EDIT FORM
// ============================================================

const EMPTY_FORM = {
  section_key: "",
  eyebrow: "",
  title: "",
  subtitle: "",
  description: "",
  content: "",
  image_url: "",
  button_text: "",
  button_url: "",
  display_order: 1,
  status: "PUBLISHED",
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function AdminCmsNetwork() {
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingSection, setEditingSection] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  // ============================================================
  // IMAGE URL
  // ============================================================

  function getImageUrl(imageUrl) {
    if (!imageUrl) {
      return "";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    if (imageUrl.startsWith("/")) {
      return `${API_BASE_URL}${imageUrl}`;
    }

    return `${API_BASE_URL}/${imageUrl}`;
  }

  // ============================================================
  // LOAD NETWORK PAGE
  // ============================================================

  async function loadNetwork(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [pageData, sectionsData] =
        await Promise.all([
          getCmsPageByKey(),
          getCmsSectionsByPage(),
        ]);

      const loadedPage =
        pageData?.page ||
        pageData?.data ||
        null;

      const loadedSections =
        sectionsData?.sections ||
        sectionsData?.data?.sections ||
        sectionsData?.data ||
        [];

      setPage(loadedPage);
      setSections(
        Array.isArray(loadedSections)
          ? loadedSections
          : []
      );
    } catch (loadError) {
      console.error(
        "NETWORK CMS LOAD ERROR:",
        loadError
      );

      if (loadError?.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError(
        loadError?.message ||
          "Unable to load Network CMS."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ============================================================
  // FIND NETWORK PAGE
  // ============================================================

  async function getCmsPageByKey() {
    /*
     * The existing CMS API does not expose a dedicated
     * getCmsPageByKey() function in the current architecture.
     *
     * Therefore we first load the CMS page list and find
     * page_key === "network".
     */

    const { getCmsPages } = await import(
      "./services/adminApi"
    );

    const data = await getCmsPages();

    const pages =
      data?.pages ||
      data?.data?.pages ||
      data?.data ||
      [];

    const networkPage = pages.find(
      (item) =>
        String(item?.page_key || "")
          .toLowerCase() === "network"
    );

    if (!networkPage) {
      throw new Error(
        'The CMS page "network" was not found.'
      );
    }

    return {
      page: networkPage,
    };
  }

  // ============================================================
  // LOAD SECTIONS BY NETWORK PAGE ID
  // ============================================================

  async function getCmsSectionsByPage() {
    /*
     * If the Network page has already been loaded, use its ID.
     * Otherwise find the page first.
     */

    let networkPageId = page?.id;

    if (!networkPageId) {
      const pageResult =
        await getCmsPageByKey();

      networkPageId =
        pageResult?.page?.id;
    }

    if (!networkPageId) {
      throw new Error(
        "Network page ID could not be determined."
      );
    }

    return getCmsSections(networkPageId);
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadNetwork();
  }, []);

  // ============================================================
  // ORGANIZED SECTIONS
  // ============================================================

  const groupedSections = useMemo(() => {
    return NETWORK_GROUPS.map((group) => {
      const groupSections =
        group.sectionKeys
          .map((key) =>
            sections.find(
              (section) =>
                section.section_key === key
            )
          )
          .filter(Boolean)
          .sort(
            (a, b) =>
              Number(a.display_order || 0) -
              Number(b.display_order || 0)
          );

      return {
        ...group,
        sections: groupSections,
      };
    });
  }, [sections]);

  // ============================================================
  // NETWORK STATUS
  // ============================================================

  const publishedCount = sections.filter(
    (section) =>
      section.status === "PUBLISHED"
  ).length;

  const draftCount = sections.filter(
    (section) =>
      section.status === "DRAFT"
  ).length;

  const archivedCount = sections.filter(
    (section) =>
      section.status === "ARCHIVED"
  ).length;

  // ============================================================
  // OPEN EDITOR
  // ============================================================

  function openEditForm(section) {
    setEditingSection(section);

    setForm({
      section_key:
        section?.section_key || "",
      eyebrow:
        section?.eyebrow || "",
      title:
        section?.title || "",
      subtitle:
        section?.subtitle || "",
      description:
        section?.description || "",
      content:
        section?.content || "",
      image_url:
        section?.image_url || "",
      button_text:
        section?.button_text || "",
      button_url:
        section?.button_url || "",
      display_order:
        section?.display_order ?? 1,
      status:
        section?.status || "PUBLISHED",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ============================================================
  // CLOSE EDITOR
  // ============================================================

  function closeEditForm() {
    if (saving) {
      return;
    }

    setEditingSection(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
  }

  // ============================================================
  // FORM CHANGE
  // ============================================================

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "display_order"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  }

  // ============================================================
  // SAVE SECTION
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!editingSection) {
      return;
    }

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Section title is required."
      );
      return;
    }

    if (
      form.display_order === "" ||
      Number(form.display_order) < 1
    ) {
      setError(
        "Display order must be a positive number."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        section_key:
          editingSection.section_key,

        eyebrow:
          form.eyebrow.trim() || null,

        title:
          form.title.trim(),

        subtitle:
          form.subtitle.trim() || null,

        description:
          form.description.trim() || null,

        content:
          form.content.trim() || null,

        image_url:
          form.image_url.trim() || null,

        button_text:
          form.button_text.trim() || null,

        button_url:
          form.button_url.trim() || null,

        display_order:
          Number(form.display_order),

        status:
          form.status,
      };

      const data =
        await updateCmsSection(
          editingSection.id,
          payload
        );

      setSuccess(
        data?.message ||
          "Network section updated successfully."
      );

      setEditingSection(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadNetwork(true);
    } catch (saveError) {
      console.error(
        "NETWORK CMS SAVE ERROR:",
        saveError
      );

      if (saveError?.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError(
        saveError?.message ||
          "Unable to update Network section."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // PUBLIC NETWORK PAGE
  // ============================================================

  function openPublicNetwork() {
    window.open(
      "/network",
      "_blank",
      "noopener,noreferrer"
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/90">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/cms")
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Back to CMS"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
              <FileText
                size={23}
                className="text-slate-900"
              />
            </div>

            <div className="min-w-0">

              <h1 className="truncate font-semibold">
                Network CMS
              </h1>

              <p className="truncate text-xs text-slate-500">
                Manage the Digital Wisdom advertising network page
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              openPublicNetwork
            }
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <ExternalLink size={16} />

            <span className="hidden sm:inline">
              View Network
            </span>
          </button>

        </div>

      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================================== */}
        {/* PAGE HEADER */}
        {/* ==================================================== */}

        <div className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Digital Wisdom
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Advertising Network
              </h2>

              <p className="mt-2 max-w-2xl text-slate-400">
                Manage the content displayed on the
                public Network page, including the hero,
                statistics, benefits, campaign process,
                and advertising call-to-action.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadNetwork(true)
              }
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-900 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

        </div>

        {/* ==================================================== */}
        {/* ERROR */}
        {/* ==================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ==================================================== */}
        {/* SUCCESS */}
        {/* ==================================================== */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-900/60 bg-green-950/30 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE INFORMATION */}
        {/* ==================================================== */}

        {page && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-lg font-semibold">
                    {page.title ||
                      "Network"}
                  </h3>

                  <StatusBadge
                    status={
                      page.status
                    }
                  />

                </div>

                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">

                  <span>
                    Page Key:{" "}
                    <span className="text-slate-400">
                      {page.page_key}
                    </span>
                  </span>

                  <span>
                    Slug:{" "}
                    <span className="text-slate-400">
                      {page.slug}
                    </span>
                  </span>

                  <span>
                    Sections:{" "}
                    <span className="text-slate-400">
                      {sections.length}
                    </span>
                  </span>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">

                <StatCard
                  label="Published"
                  value={
                    publishedCount
                  }
                />

                <StatCard
                  label="Draft"
                  value={draftCount}
                />

                <StatCard
                  label="Archived"
                  value={
                    archivedCount
                  }
                />

              </div>

            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* EDITOR */}
        {/* ==================================================== */}

        {editingSection && (
          <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Editing
                </p>

                <h3 className="mt-1 font-semibold">
                  {SECTION_LABELS[
                    editingSection
                      .section_key
                  ] ||
                    editingSection.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Key:{" "}
                  {editingSection.section_key}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeEditForm
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                title="Close editor"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* EYEBROW */}

                <FormField
                  label="Eyebrow"
                  name="eyebrow"
                  value={form.eyebrow}
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Our Digital Network"
                />

                {/* TITLE */}

                <FormField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  placeholder="Section title"
                  required
                />

                {/* SUBTITLE */}

                <FormField
                  label="Subtitle"
                  name="subtitle"
                  value={form.subtitle}
                  onChange={
                    handleChange
                  }
                  placeholder="Optional subtitle"
                />

                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500"
                  >
                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <TextAreaField
                    label="Description"
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Section description"
                    rows={4}
                  />

                </div>

                {/* CONTENT */}

                <div className="md:col-span-2">

                  <TextAreaField
                    label="Additional Content"
                    name="content"
                    value={
                      form.content
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Optional additional content"
                    rows={5}
                  />

                </div>

                {/* IMAGE URL */}

                <div className="md:col-span-2">

                  <FormField
                    label="Image URL"
                    name="image_url"
                    value={
                      form.image_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="/uploads/cms/example.jpg"
                  />

                  {form.image_url && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">

                      <img
                        src={getImageUrl(
                          form.image_url
                        )}
                        alt={
                          form.title ||
                          "Network section"
                        }
                        className="max-h-64 w-full object-cover"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* BUTTON TEXT */}

                <FormField
                  label="Button Text"
                  name="button_text"
                  value={
                    form.button_text
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Advertise With Us"
                />

                {/* BUTTON URL */}

                <FormField
                  label="Button URL"
                  name="button_url"
                  value={
                    form.button_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="/contact"
                />

                {/* DISPLAY ORDER */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="display_order"
                    value={
                      form.display_order
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500"
                  />

                </div>

                {/* SECTION KEY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Section Key
                  </label>

                  <input
                    type="text"
                    value={
                      form.section_key
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-500"
                  />

                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeEditForm
                  }
                  disabled={saving}
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />

                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================== */}
        {/* LOADING */}
        {/* ==================================================== */}

        {loading ? (

          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center gap-3 text-slate-400">

              <Loader2
                size={21}
                className="animate-spin"
              />

              Loading Network CMS...

            </div>

          </div>

        ) : (

          <div className="space-y-6">

            {groupedSections.map(
              (group) => (

                <section
                  key={group.key}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >

                  {/* GROUP HEADER */}

                  <div className="border-b border-slate-800 px-5 py-5">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <h3 className="text-lg font-semibold">
                          {group.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            group.description
                          }
                        </p>

                      </div>

                      <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
                        {
                          group.sections
                            .length
                        }{" "}
                        section
                        {group.sections
                          .length ===
                        1
                          ? ""
                          : "s"}
                      </span>

                    </div>

                  </div>

                  {/* GROUP CONTENT */}

                  {group.sections.length ===
                  0 ? (

                    <div className="px-5 py-8 text-center text-sm text-slate-600">
                      No sections found
                      for this group.
                    </div>

                  ) : (

                    <div className="divide-y divide-slate-800">

                      {group.sections.map(
                        (section) => (

                          <NetworkSectionCard
                            key={
                              section.id
                            }
                            section={
                              section
                            }
                            onEdit={
                              openEditForm
                            }
                            getImageUrl={
                              getImageUrl
                            }
                          />

                        )
                      )}

                    </div>

                  )}

                </section>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

// ============================================================
// NETWORK SECTION CARD
// ============================================================

function NetworkSectionCard({
  section,
  onEdit,
  getImageUrl,
}) {
  return (
    <div className="px-5 py-5 transition hover:bg-slate-950/40">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* INFORMATION */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-800 px-2 text-xs font-bold text-slate-300">
              {section.display_order}
            </span>

            <h4 className="font-semibold text-white">
              {SECTION_LABELS[
                section.section_key
              ] ||
                section.title}
            </h4>

            <StatusBadge
              status={
                section.status
              }
            />

          </div>

          <div className="mt-2 text-xs text-slate-500">

            Key:{" "}

            <span className="text-slate-400">
              {section.section_key}
            </span>

          </div>

          {section.eyebrow && (
            <div className="mt-3 text-xs text-slate-500">

              Eyebrow:{" "}

              <span className="text-slate-400">
                {section.eyebrow}
              </span>

            </div>
          )}

          <h5 className="mt-2 text-base font-medium text-slate-200">
            {section.title}
          </h5>

          {section.subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {section.subtitle}
            </p>
          )}

          {section.description && (
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
              {section.description}
            </p>
          )}

          {section.image_url && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">

              <img
                src={getImageUrl(
                  section.image_url
                )}
                alt={
                  section.title ||
                  "Network section"
                }
                className="h-20 w-32 rounded-xl border border-slate-800 object-cover"
              />

              <div className="min-w-0">

                <p className="text-xs font-medium text-slate-300">
                  Section image
                </p>

                <p className="mt-1 max-w-xl truncate text-xs text-slate-600">
                  {section.image_url}
                </p>

              </div>

            </div>
          )}

          {(section.button_text ||
            section.button_url) && (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs">

              <span className="text-slate-600">
                Button:
              </span>{" "}

              <span className="text-slate-400">
                {section.button_text ||
                  "—"}
              </span>

              {" → "}

              <span className="text-slate-400">
                {section.button_url ||
                  "—"}
              </span>

            </div>
          )}

        </div>

        {/* ACTION */}

        <div className="shrink-0">

          <button
            type="button"
            onClick={() =>
              onEdit(section)
            }
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Edit3 size={14} />

            Edit Section
          </button>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}

      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
      />

    </div>
  );
}

// ============================================================
// TEXT AREA
// ============================================================

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-500"
      />

    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
  const styles = {
    DRAFT:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",

    PUBLISHED:
      "bg-green-500/10 text-green-300 border-green-500/20",

    ARCHIVED:
      "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ||
        "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
}) {
  return (
    <div className="min-w-20 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-center">

      <div className="text-lg font-bold text-white">
        {value}
      </div>

      <div className="text-[10px] uppercase tracking-wide text-slate-600">
        {label}
      </div>

    </div>
  );
}

export default AdminCmsNetwork;

