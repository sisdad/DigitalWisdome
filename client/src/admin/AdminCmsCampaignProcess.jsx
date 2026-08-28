import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Loader2,
  ListChecks,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCmsCampaignProcess,
  createCmsCampaignProcess,
  updateCmsCampaignProcess,
  deleteCmsCampaignProcess,
} from "./services/adminApi";

const EMPTY_FORM = {
  step_number: 1,
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

function AdminCmsCampaignProcess() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  // ============================================================
  // LOAD CAMPAIGN PROCESS
  // ============================================================

  async function loadCampaignProcess(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getCmsCampaignProcess();

      setItems(
        response?.items ||
          response?.campaignProcess ||
          response?.data?.items ||
          response?.data?.campaignProcess ||
          response?.data ||
          []
      );
    } catch (loadError) {
      console.error(
        "CMS CAMPAIGN PROCESS LOAD ERROR:",
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
          "Unable to load campaign process."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCampaignProcess();
  }, []);

  // ============================================================
  // CREATE
  // ============================================================

  function openCreateForm() {
    setEditingItem(null);

    const nextNumber = items.length + 1;

    setForm({
      ...EMPTY_FORM,
      step_number: nextNumber,
      display_order: nextNumber,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // EDIT
  // ============================================================

  function openEditForm(item) {
    setEditingItem(item);

    setForm({
      step_number:
        item?.step_number ?? 1,

      title:
        item?.title || "",

      description:
        item?.description || "",

      icon:
        item?.icon || "",

      display_order:
        item?.display_order ?? 1,

      status:
        item?.status || "PUBLISHED",
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
    setEditingItem(null);

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
        name === "step_number" ||
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

    if (
      form.step_number === "" ||
      Number(form.step_number) < 1
    ) {
      setError(
        "Step number must be a positive number."
      );
      return;
    }

    if (!form.title.trim()) {
      setError("Step title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Step description is required.");
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
        step_number:
          Number(form.step_number),

        title:
          form.title.trim(),

        description:
          form.description.trim(),

        icon:
          form.icon.trim() || null,

        display_order:
          Number(form.display_order),

        status:
          form.status,
      };

      let data;

      if (editingItem) {
        data = await updateCmsCampaignProcess(
          editingItem.id,
          payload
        );
      } else {
        data = await createCmsCampaignProcess(
          payload
        );
      }

      setSuccess(
        data?.message ||
          (
            editingItem
              ? "Campaign process step updated successfully."
              : "Campaign process step created successfully."
          )
      );

      setShowForm(false);
      setEditingItem(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadCampaignProcess(true);
    } catch (saveError) {
      console.error(
        "CMS CAMPAIGN PROCESS SAVE ERROR:",
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
          "Unable to save campaign process step."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete campaign process step "${item.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCmsCampaignProcess(
        item.id
      );

      setSuccess(
        "Campaign process step deleted successfully."
      );

      await loadCampaignProcess(true);
    } catch (deleteError) {
      console.error(
        "CMS CAMPAIGN PROCESS DELETE ERROR:",
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
          "Unable to delete campaign process step."
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
              <ListChecks
                size={23}
                className="text-slate-900"
              />
            </div>

            <div>
              <h1 className="font-semibold">
                CMS Campaign Process
              </h1>

              <p className="text-xs text-slate-500">
                Manage campaign process steps
              </p>
            </div>

          </div>

       

        </div>

      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-medium text-slate-500">
              CMS
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Campaign Process
            </h2>

            <p className="mt-2 max-w-2xl text-slate-400">
              Manage the steps customers follow
              to launch and manage their campaigns.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadCampaignProcess(true)
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
                  {editingItem
                    ? "Edit Campaign Process Step"
                    : "Create Campaign Process Step"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the campaign process step.
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
                  label="Step Number"
                  name="step_number"
                  type="number"
                  value={form.step_number}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  min="1"
                  required
                />

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

                <FormField
                  label="Step Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Choose Your Advertising Solution"
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
                    placeholder="Describe what customers do in this step."
                    rows={4}
                    required
                  />

                </div>

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

                      {editingItem
                        ? "Update Step"
                        : "Create Step"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================== */}
        {/* CAMPAIGN PROCESS LIST */}
        {/* ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <h3 className="font-semibold">
              Campaign Process Steps
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {items.length} step
              {items.length === 1
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

                Loading campaign process...

              </div>

            </div>

          ) : items.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

              <ListChecks
                size={36}
                className="mb-4 text-slate-700"
              />

              <p className="font-medium text-slate-300">
                No campaign process steps found.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Create the first campaign process step.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <Plus size={17} />
                Create Step
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {items.map((item) => (

                <div
                  key={item.id}
                  className="px-5 py-5 transition hover:bg-slate-950/40"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-white px-2 text-sm font-bold text-slate-900">
                          {item.step_number}
                        </span>

                        <span className="text-xs text-slate-600">
                          Order {item.display_order}
                        </span>

                        <h4 className="font-semibold text-white">
                          {item.title}
                        </h4>

                        <StatusBadge
                          status={item.status}
                        />

                      </div>

                      {item.icon && (
                        <div className="mt-2 text-xs text-slate-500">
                          Icon:{" "}
                          <span className="text-slate-400">
                            {item.icon}
                          </span>
                        </div>
                      )}

                      {item.description && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      )}

                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(item)
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

export default AdminCmsCampaignProcess;