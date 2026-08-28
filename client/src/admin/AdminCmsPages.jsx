import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCmsPages,
  createCmsPage,
  updateCmsPage,
  deleteCmsPage,
} from "./services/adminApi";

const EMPTY_FORM = {
  page_key: "",
  title: "",
  slug: "",
  meta_title: "",
  meta_description: "",
  status: "DRAFT",
};

const STATUS_OPTIONS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

function AdminCmsPages() {
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  // ============================================================
  // LOAD CMS PAGES
  // ============================================================

  async function loadPages(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getCmsPages();

      setPages(data?.pages || []);
    } catch (loadError) {
      console.error(
        "CMS PAGES LOAD ERROR:",
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
          "Unable to load CMS pages."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  // ============================================================
  // CREATE FORM
  // ============================================================

  function openCreateForm() {
    setEditingPage(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // EDIT FORM
  // ============================================================

  function openEditForm(page) {
    setEditingPage(page);

    setForm({
      page_key: page?.page_key || "",
      title: page?.title || "",
      slug: page?.slug || "",
      meta_title: page?.meta_title || "",
      meta_description:
        page?.meta_description || "",
      status: page?.status || "DRAFT",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingPage(null);

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
      [name]: value,
    }));
  }

  // ============================================================
  // SAVE PAGE
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.page_key.trim()) {
      setError("Page key is required.");
      return;
    }

    if (!form.title.trim()) {
      setError("Page title is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Page slug is required.");
      return;
    }

    try {
      setSaving(true);

      let data;

      if (editingPage) {
        data = await updateCmsPage(
          editingPage.id,
          form
        );
      } else {
        data = await createCmsPage(form);
      }

      setSuccess(
        data?.message ||
          (
            editingPage
              ? "Page updated successfully."
              : "Page created successfully."
          )
      );

      setShowForm(false);
      setEditingPage(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadPages();
    } catch (saveError) {
      console.error(
        "CMS PAGE SAVE ERROR:",
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
          "Unable to save CMS page."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE PAGE
  // ============================================================

  async function handleDelete(page) {
    const confirmed = window.confirm(
      `Delete the "${page.title}" page?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCmsPage(page.id);

      setSuccess(
        "Page deleted successfully."
      );

      await loadPages();
    } catch (deleteError) {
      console.error(
        "CMS PAGE DELETE ERROR:",
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
          "Unable to delete CMS page."
      );
    }
  }

  // ============================================================
  // MANAGE SECTIONS
  // ============================================================

  function openSections(page) {
    navigate(
      `/admin/cms/pages/${page.id}/sections`
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

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("/admin/cms")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Back to CMS"
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
                CMS Pages
              </h1>

              <p className="text-xs text-slate-500">
                Manage website pages and content structure
              </p>
            </div>

          </div>

         

        </div>

      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <h2 className="text-3xl font-bold">
              Website Pages
            </h2>

            <p className="mt-2 text-slate-400">
              Create and manage the pages used by
              Digital Wisdom.
            </p>

          </div>

          <button
            type="button"
            onClick={() => loadPages(true)}
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
        {/* CREATE / EDIT FORM */}
        {/* ==================================================== */}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h3 className="font-semibold">
                  {editingPage
                    ? "Edit Page"
                    : "Create New Page"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the basic page information.
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                title="Close"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* PAGE KEY */}

                <FormField
                  label="Page Key"
                  name="page_key"
                  value={form.page_key}
                  onChange={handleChange}
                  placeholder="example: home"
                  disabled={Boolean(editingPage)}
                  required
                />

                {/* TITLE */}

                <FormField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Home"
                  required
                />

                {/* SLUG */}

                <FormField
                  label="Slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Example: /"
                  required
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

                {/* META TITLE */}

                <div className="md:col-span-2">

                  <FormField
                    label="Meta Title"
                    name="meta_title"
                    value={form.meta_title}
                    onChange={handleChange}
                    placeholder="SEO title"
                  />

                </div>

                {/* META DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Meta Description
                  </label>

                  <textarea
                    name="meta_description"
                    value={form.meta_description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="SEO description"
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-500"
                  />

                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
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

                      {editingPage
                        ? "Update Page"
                        : "Create Page"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE LIST */}
        {/* ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <h3 className="font-semibold">
              Pages
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {pages.length} page
              {pages.length === 1
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

                Loading pages...

              </div>

            </div>

          ) : pages.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

              <FileText
                size={36}
                className="mb-4 text-slate-700"
              />

              <p className="font-medium text-slate-300">
                No CMS pages found.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Create your first website page.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <Plus size={17} />
                Create Page
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {pages.map((page) => (

                <div
                  key={page.id}
                  className="px-5 py-5 transition hover:bg-slate-950/40"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* PAGE INFORMATION */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="font-semibold text-white">
                          {page.title}
                        </h4>

                        <StatusBadge
                          status={page.status}
                        />

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

                        <span>
                          Key:{" "}

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
                            {page.section_count ?? 0}
                          </span>
                        </span>

                      </div>

                      {page.meta_title && (
                        <p className="mt-2 text-xs text-slate-600">
                          SEO: {page.meta_title}
                        </p>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openSections(page)
                        }
                        className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        Manage Sections
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(page)
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

export default AdminCmsPages;