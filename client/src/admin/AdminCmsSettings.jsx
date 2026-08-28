import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCmsSettings,
  createCmsSetting,
  updateCmsSetting,
  deleteCmsSetting,
} from "./services/adminApi";

const EMPTY_FORM = {
  setting_key: "",
  setting_value: "",
  setting_type: "TEXT",
};

const TYPE_OPTIONS = [
  "TEXT",
  "URL",
  "EMAIL",
  "PHONE",
  "NUMBER",
  "BOOLEAN",
];

function AdminCmsSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  // ============================================================
  // LOAD SETTINGS
  // ============================================================

  async function loadSettings(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getCmsSettings();

      setSettings(
        response?.settings ||
          response?.data?.settings ||
          response?.data ||
          []
      );
    } catch (loadError) {
      console.error(
        "CMS SETTINGS LOAD ERROR:",
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
          "Unable to load CMS settings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  // ============================================================
  // CREATE
  // ============================================================

  function openCreateForm() {
    setEditingSetting(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // EDIT
  // ============================================================

  function openEditForm(setting) {
    setEditingSetting(setting);

    setForm({
      setting_key:
        setting?.setting_key || "",

      setting_value:
        setting?.setting_value || "",

      setting_type:
        setting?.setting_type || "TEXT",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================================================
  // CLOSE
  // ============================================================

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingSetting(null);

    setForm({
      ...EMPTY_FORM,
    });
  }

  // ============================================================
  // CHANGE
  // ============================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // ============================================================
  // SAVE
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.setting_key.trim()) {
      setError("Setting key is required.");
      return;
    }

    if (!form.setting_value.trim()) {
      setError("Setting value is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        setting_key:
          form.setting_key.trim(),

        setting_value:
          form.setting_value.trim(),

        setting_type:
          form.setting_type,
      };

      let data;

      if (editingSetting) {
        data = await updateCmsSetting(
          editingSetting.id,
          payload
        );
      } else {
        data = await createCmsSetting(
          payload
        );
      }

      setSuccess(
        data?.message ||
          (
            editingSetting
              ? "Site setting updated successfully."
              : "Site setting created successfully."
          )
      );

      setShowForm(false);
      setEditingSetting(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadSettings(true);
    } catch (saveError) {
      console.error(
        "CMS SETTING SAVE ERROR:",
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
          "Unable to save CMS setting."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(setting) {
    const confirmed = window.confirm(
      `Delete the "${setting.setting_key}" setting?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCmsSetting(
        setting.id
      );

      setSuccess(
        "Site setting deleted successfully."
      );

      await loadSettings(true);
    } catch (deleteError) {
      console.error(
        "CMS SETTING DELETE ERROR:",
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
          "Unable to delete CMS setting."
      );
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

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
              <Settings
                size={23}
                className="text-slate-900"
              />
            </div>

            <div>
              <h1 className="font-semibold">
                CMS Settings
              </h1>

              <p className="text-xs text-slate-500">
                Manage global website settings
              </p>
            </div>

          </div>

         

        </div>

      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-medium text-slate-500">
              CMS
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Website Settings
            </h2>

            <p className="mt-2 max-w-2xl text-slate-400">
              Manage global values used throughout
              the Digital Wisdom website.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadSettings(true)
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

        {/* FORM */}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h3 className="font-semibold">
                  {editingSetting
                    ? "Edit Site Setting"
                    : "Create New Site Setting"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure a global website setting.
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
                  label="Setting Key"
                  name="setting_key"
                  value={form.setting_key}
                  onChange={handleChange}
                  placeholder="example: company_email"
                  disabled={Boolean(editingSetting)}
                  required
                />

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Setting Type
                  </label>

                  <select
                    name="setting_type"
                    value={form.setting_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500"
                  >
                    {TYPE_OPTIONS.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">

                    Setting Value

                    <span className="ml-1 text-red-400">
                      *
                    </span>

                  </label>

                  <textarea
                    name="setting_value"
                    value={form.setting_value}
                    onChange={handleChange}
                    placeholder="Enter setting value..."
                    rows={4}
                    required
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-500"
                  />

                </div>

              </div>

              {/* ACTIONS */}

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

                      {editingSetting
                        ? "Update Setting"
                        : "Create Setting"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SETTINGS LIST */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <h3 className="font-semibold">
              Global Website Settings
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {settings.length} setting
              {settings.length === 1
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

                Loading settings...

              </div>

            </div>

          ) : settings.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

              <Settings
                size={36}
                className="mb-4 text-slate-700"
              />

              <p className="font-medium text-slate-300">
                No settings found.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Create the first website setting.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <Plus size={17} />
                Create Setting
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {settings.map((setting) => (

                <div
                  key={setting.id}
                  className="px-5 py-5 transition hover:bg-slate-950/40"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="font-semibold text-white">
                          {setting.setting_key}
                        </h4>

                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                          {setting.setting_type ||
                            "TEXT"}
                        </span>

                      </div>

                      <p className="mt-3 break-all text-sm leading-6 text-slate-400">
                        {setting.setting_value ||
                          "—"}
                      </p>

                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(setting)
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

export default AdminCmsSettings;