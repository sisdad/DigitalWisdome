
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCmsPage,
  getCmsSections,
  createCmsSection,
  updateCmsSection,
  deleteCmsSection,
  uploadCmsImage,
  updateCmsSectionImage,
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

function AdminCmsSections() {
  const navigate = useNavigate();
  const { pageId } = useParams();

  const fileInputRef = useRef(null);

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
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
  // LOAD PAGE + SECTIONS
  // ============================================================

  async function loadData(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [pageData, sectionsData] = await Promise.all([
        getCmsPage(pageId),
        getCmsSections(pageId),
      ]);

      setPage(
        pageData?.page ||
          pageData?.data ||
          null
      );

      const loadedSections =
        sectionsData?.sections ||
        sectionsData?.data?.sections ||
        sectionsData?.data ||
        [];

      setSections(
        Array.isArray(loadedSections)
          ? [...loadedSections].sort(
              (a, b) =>
                Number(a.display_order || 0) -
                Number(b.display_order || 0)
            )
          : []
      );
    } catch (loadError) {
      console.error(
        "CMS SECTIONS LOAD ERROR:",
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
          "Unable to load CMS sections."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (pageId) {
      loadData();
    }
  }, [pageId]);

  // ============================================================
  // CREATE FORM
  // ============================================================

  function openCreateForm() {
    setEditingSection(null);

    setForm({
      ...EMPTY_FORM,
      display_order: sections.length + 1,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // EDIT FORM
  // ============================================================

  function openEditForm(section) {
    setEditingSection(section);

    setForm({
      section_key: section?.section_key || "",
      eyebrow: section?.eyebrow || "",
      title: section?.title || "",
      subtitle: section?.subtitle || "",
      description: section?.description || "",
      content: section?.content || "",
      image_url: section?.image_url || "",
      button_text: section?.button_text || "",
      button_url: section?.button_url || "",
      display_order:
        section?.display_order ?? 1,
      status:
        section?.status || "PUBLISHED",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  function closeForm() {
    if (saving || uploadingImage) {
      return;
    }

    setShowForm(false);
    setEditingSection(null);

    setForm({
      ...EMPTY_FORM,
    });
  }

  // ============================================================
  // FORM CHANGE
  // ============================================================

  function handleChange(event) {
    const { name, value } = event.target;

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
  // IMAGE SELECT
  // ============================================================

  async function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid image type. Please select JPG, PNG, WEBP, or GIF."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image is too large. Maximum allowed size is 10 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const data = await uploadCmsImage(file);

      const imageUrl =
        data?.image_url ||
        data?.data?.image_url ||
        data?.image?.image_url ||
        data?.data?.image?.image_url ||
        data?.url ||
        data?.data?.url;

      if (!imageUrl) {
        console.error(
          "IMAGE UPLOAD RESPONSE:",
          data
        );

        throw new Error(
          "Image uploaded, but the server did not return an image URL."
        );
      }

      setForm((current) => ({
        ...current,
        image_url: imageUrl,
      }));

      setSuccess(
        "Image uploaded successfully. Save the section to apply it."
      );
    } catch (uploadError) {
      console.error(
        "CMS IMAGE UPLOAD ERROR:",
        uploadError
      );

      if (uploadError?.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError(
        uploadError?.message ||
          "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  async function handleRemoveImage() {
    if (!form.image_url) {
      return;
    }

    if (!editingSection) {
      setForm((current) => ({
        ...current,
        image_url: "",
      }));

      return;
    }

    const confirmed = window.confirm(
      "Remove this image from the section?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setSaving(true);

      await updateCmsSectionImage(
        editingSection.id,
        null
      );

      setForm((current) => ({
        ...current,
        image_url: "",
      }));

      setEditingSection((current) =>
        current
          ? {
              ...current,
              image_url: null,
            }
          : current
      );

      setSuccess(
        "Section image removed successfully."
      );

      await loadData(true);
    } catch (removeError) {
      console.error(
        "CMS IMAGE REMOVE ERROR:",
        removeError
      );

      if (removeError?.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError(
        removeError?.message ||
          "Unable to remove section image."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // SAVE SECTION
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.section_key.trim()) {
      setError("Section key is required.");
      return;
    }

    if (!form.title.trim()) {
      setError("Section title is required.");
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
          form.section_key.trim(),

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
          form.status || "PUBLISHED",
      };

      let data;

      if (editingSection) {
        data = await updateCmsSection(
          editingSection.id,
          payload
        );
      } else {
        data = await createCmsSection(
          pageId,
          payload
        );
      }

      setSuccess(
        data?.message ||
          (
            editingSection
              ? "Section updated successfully."
              : "Section created successfully."
          )
      );

      setShowForm(false);
      setEditingSection(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadData(true);
    } catch (saveError) {
      console.error(
        "CMS SECTION SAVE ERROR:",
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
          "Unable to save CMS section."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE SECTION
  // ============================================================

  async function handleDelete(section) {
    const confirmed = window.confirm(
      `Delete the "${section.title}" section?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCmsSection(section.id);

      setSuccess(
        "Section deleted successfully."
      );

      await loadData(true);
    } catch (deleteError) {
      console.error(
        "CMS SECTION DELETE ERROR:",
        deleteError
      );

      if (deleteError?.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError(
        deleteError?.message ||
          "Unable to delete CMS section."
      );
    }
  }

  // ============================================================
  // SECTION TYPE LABEL
  // ============================================================

  function getSectionType(sectionKey) {
    if (!sectionKey) {
      return "Section";
    }

    if (sectionKey === "hero") {
      return "Hero";
    }

    if (sectionKey.startsWith("network_stats")) {
      return "Network Statistic";
    }

    if (sectionKey === "locations_intro") {
      return "Locations Introduction";
    }

    if (sectionKey === "benefits_intro") {
      return "Benefits Introduction";
    }

    if (sectionKey.startsWith("benefit_")) {
      return "Network Benefit";
    }

    if (sectionKey === "process_intro") {
      return "Process Introduction";
    }

    if (sectionKey.startsWith("process_")) {
      return "Campaign Process";
    }

    if (sectionKey === "cta") {
      return "Call To Action";
    }

    return "Content Section";
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/90">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/cms/pages")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Back to Pages"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <FileText
                size={23}
                className="text-slate-900"
              />
            </div>

            <div>
              <h1 className="font-semibold">
                Network CMS Sections
              </h1>

              <p className="text-xs text-slate-500">
                Manage Digital Wisdom network content
              </p>
            </div>

          </div>

          

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-medium text-slate-500">
              CMS Page
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {page?.title || "Network"}
            </h2>

            <p className="mt-2 text-slate-400">
              {page?.page_key
                ? `Manage sections for ${page.page_key}.`
                : "Manage the content sections of the Network page."}
            </p>

          </div>

          <button
            type="button"
            onClick={() => loadData(true)}
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

        {/* ====================================================
            MESSAGES
        ==================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-900/60 bg-green-950/30 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* ====================================================
            FORM
        ==================================================== */}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>
                <h3 className="font-semibold">
                  {editingSection
                    ? "Edit Network Section"
                    : "Create Network Section"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the content displayed on the Network page.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={
                  saving ||
                  uploadingImage
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* SECTION KEY */}

                <FormField
                  label="Section Key"
                  name="section_key"
                  value={form.section_key}
                  onChange={handleChange}
                  placeholder="example: hero"
                  disabled={Boolean(editingSection)}
                  required
                />

                {/* SECTION TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Section Type
                  </label>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-400">
                    {getSectionType(
                      form.section_key
                    )}
                  </div>

                </div>

                {/* EYEBROW */}

                <FormField
                  label="Eyebrow"
                  name="eyebrow"
                  value={form.eyebrow}
                  onChange={handleChange}
                  placeholder="Example: Our Digital Network"
                />

                {/* TITLE */}

                <FormField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Section title"
                  required
                />

                {/* SUBTITLE */}

                <FormField
                  label="Subtitle"
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Optional subtitle"
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
                    value={form.display_order}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <TextAreaField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Section description"
                    rows={4}
                  />

                </div>

                {/* CONTENT */}

                <div className="md:col-span-2">

                  <TextAreaField
                    label="Additional Content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Optional additional content"
                    rows={5}
                  />

                </div>

                {/* IMAGE */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Section Image
                  </label>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">

                    {form.image_url ? (

                      <div className="flex flex-col gap-4 sm:flex-row">

                        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 sm:w-64">

                          <img
                            src={getImageUrl(
                              form.image_url
                            )}
                            alt={
                              form.title ||
                              "Section preview"
                            }
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                        </div>

                        <div className="flex flex-1 flex-col justify-center">

                          <p className="text-sm font-medium text-slate-200">
                            Image selected
                          </p>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            {form.image_url}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                fileInputRef.current?.click()
                              }
                              disabled={
                                uploadingImage ||
                                saving
                              }
                              className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                            >
                              <Upload size={14} />
                              Replace
                            </button>

                            <button
                              type="button"
                              onClick={
                                handleRemoveImage
                              }
                              disabled={
                                uploadingImage ||
                                saving
                              }
                              className="flex items-center gap-2 rounded-xl border border-red-900/60 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-950/40 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        disabled={
                          uploadingImage ||
                          saving
                        }
                        className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 px-5 text-center transition hover:border-slate-500 hover:bg-slate-900 disabled:opacity-50"
                      >

                        {uploadingImage ? (
                          <>
                            <Loader2
                              size={30}
                              className="animate-spin text-slate-400"
                            />

                            <p className="mt-3 text-sm font-medium text-slate-300">
                              Uploading image...
                            </p>
                          </>
                        ) : (
                          <>
                            <ImageIcon
                              size={30}
                              className="text-slate-600"
                            />

                            <p className="mt-3 text-sm font-medium text-slate-300">
                              Click to upload an image
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              JPG, PNG, WEBP or GIF
                            </p>
                          </>
                        )}

                      </button>

                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={
                        handleImageSelect
                      }
                      className="hidden"
                    />

                  </div>

                  <div className="mt-3">

                    <FormField
                      label="Image URL"
                      name="image_url"
                      value={form.image_url}
                      onChange={handleChange}
                      placeholder="/uploads/cms/example.jpg"
                    />

                  </div>

                </div>

                {/* BUTTON TEXT */}

                <FormField
                  label="Button Text"
                  name="button_text"
                  value={form.button_text}
                  onChange={handleChange}
                  placeholder="Example: Advertise With Us"
                />

                {/* BUTTON URL */}

                <FormField
                  label="Button URL"
                  name="button_url"
                  value={form.button_url}
                  onChange={handleChange}
                  placeholder="/contact"
                />

                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
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

              </div>

              {/* FORM ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={
                    saving ||
                    uploadingImage
                  }
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage
                  }
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

                      {editingSection
                        ? "Update Section"
                        : "Create Section"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ====================================================
            SECTION LIST
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <h3 className="font-semibold">
              Network Page Sections
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {sections.length} section
              {sections.length === 1
                ? ""
                : "s"} configured.
            </p>

          </div>

          {loading ? (

            <div className="flex min-h-64 items-center justify-center">

              <div className="flex items-center gap-3 text-slate-400">

                <Loader2
                  size={21}
                  className="animate-spin"
                />

                Loading sections...

              </div>

            </div>

          ) : sections.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

              <FileText
                size={36}
                className="mb-4 text-slate-700"
              />

              <p className="font-medium text-slate-300">
                No sections found.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Create the first Network section.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <Plus size={17} />
                Create Section
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {sections.map((section) => (

                <div
                  key={section.id}
                  className="px-5 py-5 transition hover:bg-slate-950/40"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* INFORMATION */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-800 px-2 text-xs font-bold text-slate-300">
                          {section.display_order}
                        </span>

                        <h4 className="font-semibold text-white">
                          {section.title}
                        </h4>

                        <StatusBadge
                          status={
                            section.status
                          }
                        />

                        <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                          {getSectionType(
                            section.section_key
                          )}
                        </span>

                      </div>

                      <div className="mt-2 text-xs text-slate-500">
                        Key:{" "}
                        <span className="text-slate-400">
                          {section.section_key}
                        </span>
                      </div>

                      {section.eyebrow && (
                        <div className="mt-2 text-xs text-slate-500">
                          Eyebrow:{" "}
                          <span className="text-slate-400">
                            {section.eyebrow}
                          </span>
                        </div>
                      )}

                      {section.description && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                          {section.description}
                        </p>
                      )}

                      {section.subtitle && (
                        <p className="mt-2 text-xs text-slate-600">
                          Subtitle:{" "}
                          <span className="text-slate-500">
                            {section.subtitle}
                          </span>
                        </p>
                      )}

                      {section.image_url && (
                        <div className="mt-4 flex items-center gap-3">

                          <img
                            src={getImageUrl(
                              section.image_url
                            )}
                            alt={
                              section.title ||
                              "Section"
                            }
                            className="h-16 w-24 rounded-lg border border-slate-800 object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                          <div className="min-w-0">

                            <p className="text-xs font-medium text-slate-300">
                              Section image
                            </p>

                            <p className="mt-1 max-w-md truncate text-xs text-slate-600">
                              {section.image_url}
                            </p>

                          </div>

                        </div>
                      )}

                      {(section.button_text ||
                        section.button_url) && (
                        <div className="mt-3 text-xs text-slate-600">

                          Button:{" "}

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

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            section
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>


                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

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

export default AdminCmsSections;

