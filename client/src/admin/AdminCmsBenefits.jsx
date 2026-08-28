import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Gift,
  LayoutList,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCmsBenefits,
  createCmsBenefit,
  updateCmsBenefit,
  deleteCmsBenefit,
} from "./services/adminApi";

const EMPTY_FORM = {
  title: "",
  description: "",
  icon: "",
  display_order: 1,
  status: "PUBLISHED",
};

const STATUS_OPTIONS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

function AdminCmsBenefits() {
  const navigate = useNavigate();

  const [benefits, setBenefits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  // ============================================================
  // LOAD BENEFITS
  // ============================================================

  async function loadBenefits(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getCmsBenefits();

      const data =
        response?.benefits ||
        response?.items ||
        response?.data?.benefits ||
        response?.data?.items ||
        response?.data ||
        [];

      const normalizedBenefits = Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              Number(a?.display_order ?? 0) -
              Number(b?.display_order ?? 0)
          )
        : [];

      setBenefits(normalizedBenefits);
    } catch (loadError) {
      console.error(
        "CMS BENEFITS LOAD ERROR:",
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
          "Unable to load CMS benefits."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBenefits();
  }, []);

  // ============================================================
  // CREATE
  // ============================================================

  function openCreateForm() {
    setEditingBenefit(null);

    const nextOrder =
      benefits.length > 0
        ? Math.max(
            ...benefits.map((item) =>
              Number(item?.display_order || 0)
            )
          ) + 1
        : 1;

    setForm({
      ...EMPTY_FORM,
      display_order: nextOrder,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // EDIT
  // ============================================================

  function openEditForm(benefit) {
    setEditingBenefit(benefit);

    setForm({
      title: benefit?.title || "",
      description: benefit?.description || "",
      icon: benefit?.icon || "",
      display_order:
        benefit?.display_order ?? 1,
      status:
        benefit?.status || "PUBLISHED",
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
    setEditingBenefit(null);

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
  // SAVE
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const title = form.title.trim();
    const description = form.description.trim();
    const displayOrder = Number(form.display_order);

    if (!title) {
      setError("Benefit title is required.");
      return;
    }

    if (!description) {
      setError("Benefit description is required.");
      return;
    }

    if (
      form.display_order === "" ||
      !Number.isInteger(displayOrder) ||
      displayOrder < 1
    ) {
      setError(
        "Display order must be a positive whole number."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title,
        description,
        icon: form.icon.trim() || null,
        display_order: displayOrder,
        status: form.status,
      };

      let data;

      if (editingBenefit) {
        data = await updateCmsBenefit(
          editingBenefit.id,
          payload
        );
      } else {
        data = await createCmsBenefit(payload);
      }

      setSuccess(
        data?.message ||
          (editingBenefit
            ? "Benefit updated successfully."
            : "Benefit created successfully.")
      );

      setShowForm(false);
      setEditingBenefit(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadBenefits(true);
    } catch (saveError) {
      console.error(
        "CMS BENEFIT SAVE ERROR:",
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
          "Unable to save CMS benefit."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(benefit) {
    const confirmed = window.confirm(
      `Delete the "${benefit.title}" benefit?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCmsBenefit(benefit.id);

      setSuccess(
        "Benefit deleted successfully."
      );

      await loadBenefits(true);
    } catch (deleteError) {
      console.error(
        "CMS BENEFIT DELETE ERROR:",
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
          "Unable to delete CMS benefit."
      );
    }
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
              onClick={() =>
                navigate("/admin/cms")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Back to CMS"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <Gift
                size={23}
                className="text-slate-900"
              />
            </div>

            <div>
              <h1 className="font-semibold">
                CMS Benefits
              </h1>

              <p className="text-xs text-slate-500">
                Manage customer benefits and advantages
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

            <p className="text-sm font-medium text-slate-500">
              CMS
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Customer Benefits
            </h2>

            <p className="mt-2 max-w-2xl text-slate-400">
              Manage the benefits and advantages
              displayed on the Digital Wisdom website.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadBenefits(true)
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

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-900/60 bg-green-950/30 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* ==================================================== */}
        {/* FORM */}
        {/* ==================================================== */}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h3 className="font-semibold">
                  {editingBenefit
                    ? "Edit Benefit"
                    : "Create New Benefit"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the benefit shown on the website.
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
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

                <FormField
                  label="Benefit Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Wider Audience Reach"
                  required
                />

                <FormField
                  label="Icon"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="Example: Target"
                />

                <div className="md:col-span-2">

                  <TextAreaField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the benefit..."
                    rows={4}
                    required
                  />

                </div>

                <FormField
                  label="Display Order"
                  name="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  min="1"
                  required
                />

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

                      {editingBenefit
                        ? "Update Benefit"
                        : "Create Benefit"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================== */}
        {/* BENEFITS LIST */}
        {/* ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <div className="flex items-center gap-2">

              <LayoutList
                size={18}
                className="text-slate-400"
              />

              <h3 className="font-semibold">
                Website Benefits
              </h3>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              {benefits.length} benefit
              {benefits.length === 1
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

                Loading benefits...

              </div>

            </div>

          ) : benefits.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

              <Gift
                size={36}
                className="mb-4 text-slate-700"
              />

              <p className="font-medium text-slate-300">
                No benefits found.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Create the first customer benefit.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <Plus size={17} />
                Create Benefit
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {benefits.map((benefit) => (

                <div
                  key={benefit.id}
                  className="px-5 py-5 transition hover:bg-slate-950/40"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-800 px-2 text-xs font-bold text-slate-300">
                          {benefit.display_order}
                        </span>

                        <h4 className="font-semibold text-white">
                          {benefit.title}
                        </h4>

                        <StatusBadge
                          status={benefit.status}
                        />

                      </div>

                      {benefit.icon && (
                        <div className="mt-2 text-xs text-slate-500">
                          Icon:{" "}
                          <span className="text-slate-400">
                            {benefit.icon}
                          </span>
                        </div>
                      )}

                      {benefit.description && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                          {benefit.description}
                        </p>
                      )}

                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(benefit)
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
  required = false,
  type = "text",
  min,
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
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-500"
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

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
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

export default AdminCmsBenefits;