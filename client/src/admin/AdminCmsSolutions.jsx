import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Edit3,
  Image as ImageIcon,
  Lightbulb,
  Loader2,
  Megaphone,
  MonitorPlay,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Target,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCmsSolutions,
  createCmsSolution,
  updateCmsSolution,
  deleteCmsSolution,
  uploadCmsImage,
} from "./services/adminApi";

// ============================================================
// EMPTY FORM
// ============================================================

const EMPTY_FORM = {
  title: "",
  description: "",
  icon: "MonitorPlay",
  image_url: "",
  display_order: 1,
  status: "DRAFT",
};

// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

// ============================================================
// ICON OPTIONS
// ============================================================

const ICON_OPTIONS = [
  {
    value: "MonitorPlay",
    label: "Video Advertising",
    Icon: MonitorPlay,
  },
  {
    value: "Image",
    label: "Image Advertising",
    Icon: ImageIcon,
  },
  {
    value: "Rocket",
    label: "Product Launches",
    Icon: Rocket,
  },
  {
    value: "BadgeCheck",
    label: "Brand Campaigns",
    Icon: BadgeCheck,
  },
  {
    value: "Megaphone",
    label: "Promotional Messages",
    Icon: Megaphone,
  },
  {
    value: "CalendarDays",
    label: "Seasonal Campaigns",
    Icon: CalendarDays,
  },
  {
    value: "Target",
    label: "Targeted Advertising",
    Icon: Target,
  },
  {
    value: "Building2",
    label: "Corporate Communication",
    Icon: Building2,
  },
];

// ============================================================
// ICON HELPER
// ============================================================

function getSolutionIcon(iconName) {
  const found = ICON_OPTIONS.find(
    (item) => item.value === iconName
  );

  return found?.Icon || Lightbulb;
}

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";


// ============================================================
// IMAGE URL HELPER
// ============================================================

function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  const value = String(imageUrl).trim();

  if (!value) {
    return "";
  }

  // Already an absolute URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  // Backend returns a relative URL
  if (value.startsWith("/")) {
    return `http://localhost:5000${value}`;
  }

  return `http://localhost:5000/${value}`;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function AdminCmsSolutions() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [solutions, setSolutions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSolution, setEditingSolution] =
    useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  // ==========================================================
  // LOAD SOLUTIONS
  // ==========================================================

  async function loadSolutions(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getCmsSolutions();

      const items =
        response?.items ||
        response?.solutions ||
        response?.data?.items ||
        response?.data?.solutions ||
        response?.data ||
        [];

      setSolutions(
        Array.isArray(items) ? items : []
      );
    } catch (loadError) {
      console.error(
        "CMS SOLUTIONS LOAD ERROR:",
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
          "Unable to load CMS solutions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadSolutions();
  }, []);

  // ==========================================================
  // CREATE FORM
  // ==========================================================

  function openCreateForm() {
    setEditingSolution(null);

    setForm({
      ...EMPTY_FORM,
      display_order: solutions.length + 1,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ==========================================================
  // EDIT FORM
  // ==========================================================

  function openEditForm(solution) {
    setEditingSolution(solution);

    setForm({
      title: solution?.title || "",
      description:
        solution?.description || "",
      icon:
        solution?.icon || "MonitorPlay",
      image_url:
        solution?.image_url || "",
      display_order:
        solution?.display_order ?? 1,
      status:
        solution?.status || "DRAFT",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  function closeForm() {
    if (saving || uploadingImage) {
      return;
    }

    setShowForm(false);
    setEditingSolution(null);

    setForm({
      ...EMPTY_FORM,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

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

  // ==========================================================
  // SELECT IMAGE
  // ==========================================================

  async function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    // --------------------------------------------------------
    // VALIDATE TYPE
    // --------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid image type. Please select JPG, PNG, WEBP or GIF."
      );

      event.target.value = "";
      return;
    }

    // --------------------------------------------------------
    // VALIDATE SIZE
    // --------------------------------------------------------

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image is too large. Maximum allowed size is 5 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const response =
        await uploadCmsImage(file);

      console.log(
        "CMS IMAGE UPLOAD RESPONSE:",
        response
      );

      const uploadedUrl =
        response?.url ||
        response?.image_url ||
        response?.data?.url ||
        response?.data?.image_url ||
        response?.image?.url ||
        response?.image?.image_url;

      if (!uploadedUrl) {
        throw new Error(
          "Image uploaded, but the server did not return an image URL."
        );
      }

      setForm((current) => ({
        ...current,
        image_url: uploadedUrl,
      }));

      setSuccess(
        "Image uploaded successfully. Save the solution to apply it."
      );
    } catch (uploadError) {
      console.error(
        "CMS SOLUTION IMAGE UPLOAD ERROR:",
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
          "Unable to upload solution image."
      );
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ==========================================================
  // REMOVE IMAGE
  // ==========================================================

  function removeImage() {
    if (saving || uploadingImage) {
      return;
    }

    setForm((current) => ({
      ...current,
      image_url: "",
    }));

    setSuccess("");
  }

  // ==========================================================
  // SAVE SOLUTION
  // ==========================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!form.title.trim()) {
      setError(
        "Solution title is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Solution description is required."
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

    if (!form.icon) {
      setError(
        "Please select an icon."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),

        description:
          form.description.trim(),

        icon: form.icon,

        image_url:
          form.image_url?.trim() || null,

        display_order:
          Number(form.display_order),

        status: form.status,
      };

      console.log(
        "CMS SOLUTION PAYLOAD:",
        payload
      );

      let data;

      if (editingSolution) {
        data = await updateCmsSolution(
          editingSolution.id,
          payload
        );
      } else {
        data = await createCmsSolution(
          payload
        );
      }

      setSuccess(
        data?.message ||
          (
            editingSolution
              ? "Solution updated successfully."
              : "Solution created successfully."
          )
      );

      setShowForm(false);
      setEditingSolution(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadSolutions(true);
    } catch (saveError) {
      console.error(
        "CMS SOLUTION SAVE ERROR:",
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
          "Unable to save CMS solution."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // DELETE SOLUTION
  // ==========================================================

  async function handleDelete(solution) {
    const confirmed = window.confirm(
      `Delete the "${solution.title}" solution?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCmsSolution(
        solution.id
      );

      setSuccess(
        "Solution deleted successfully."
      );

      await loadSolutions(true);
    } catch (deleteError) {
      console.error(
        "CMS SOLUTION DELETE ERROR:",
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
          "Unable to delete CMS solution."
      );
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

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
              <Lightbulb
                size={23}
                className="text-slate-900"
              />
            </div>

            <div>
              <h1 className="font-semibold">
                CMS Solutions
              </h1>

              <p className="text-xs text-slate-500">
                Manage advertising solutions
              </p>
            </div>

          </div>

          

        </div>

      </header>

      {/* ==================================================== */}
      {/* MAIN */}
      {/* ==================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-medium text-slate-500">
              CMS
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Advertising Solutions
            </h2>

            <p className="mt-2 max-w-2xl text-slate-400">
              Manage the advertising solutions displayed
              on the Digital Wisdom website.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadSolutions(true)
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

        {/* ================================================== */}
        {/* FORM */}
        {/* ================================================== */}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h3 className="font-semibold">
                  {editingSolution
                    ? "Edit Solution"
                    : "Create New Solution"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the advertising solution.
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

                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <FormField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Video Advertising"
                  required
                />

                {/* ================================================= */}
                {/* ICON */}
                {/* ================================================= */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Icon
                    <span className="ml-1 text-red-400">
                      *
                    </span>
                  </label>

                  <select
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500"
                  >
                    {ICON_OPTIONS.map(
                      ({
                        value,
                        label,
                        Icon,
                      }) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {label} ({value})
                        </option>
                      )
                    )}
                  </select>

                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-3">

                    {(() => {
                      const Icon =
                        getSolutionIcon(
                          form.icon
                        );

                      return (
                        <Icon
                          size={21}
                          className="text-slate-300"
                        />
                      );
                    })()}

                    <span className="text-xs text-slate-500">
                      Selected icon:{" "}
                      <span className="text-slate-300">
                        {form.icon}
                      </span>
                    </span>

                  </div>

                </div>

                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                <div className="md:col-span-2">

                  <TextAreaField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe this advertising solution..."
                    rows={5}
                    required
                  />

                </div>

                {/* ================================================= */}
                {/* IMAGE UPLOAD */}
                {/* ================================================= */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Solution Image
                  </label>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">

                    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">

                      {/* IMAGE PREVIEW */}

                      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

                        {form.image_url ? (
                          <div className="relative aspect-video w-full">

                            <img
                              src={getImageUrl(
                                form.image_url
                              )}
                              alt={
                                form.title ||
                                "Solution preview"
                              }
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                            <button
                              type="button"
                              onClick={removeImage}
                              disabled={
                                saving ||
                                uploadingImage
                              }
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/90 text-red-300 backdrop-blur transition hover:bg-red-900 hover:text-white disabled:opacity-50"
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>

                          </div>
                        ) : (
                          <div className="flex aspect-video w-full flex-col items-center justify-center text-slate-600">

                            <ImageIcon
                              size={34}
                            />

                            <span className="mt-2 text-xs">
                              No image
                            </span>

                          </div>
                        )}

                      </div>

                      {/* UPLOAD CONTROLS */}

                      <div className="flex flex-col justify-center">

                        <p className="text-sm font-medium text-slate-300">
                          Upload solution image
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          Recommended format: JPG, PNG or WEBP.
                          Maximum file size: 5 MB.
                        </p>

                        <div className="mt-4">

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={
                              handleImageSelect
                            }
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            disabled={
                              saving ||
                              uploadingImage
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            {uploadingImage ? (
                              <>
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />

                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload
                                  size={17}
                                />

                                {form.image_url
                                  ? "Replace Image"
                                  : "Upload Image"}
                              </>
                            )}

                          </button>

                        </div>

                        {form.image_url && (
                          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">

                            <p className="text-[11px] uppercase tracking-wide text-slate-600">
                              Image URL
                            </p>

                            <p className="mt-1 break-all text-xs text-slate-400">
                              {form.image_url}
                            </p>

                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

                {/* ================================================= */}
                {/* DISPLAY ORDER */}
                {/* ================================================= */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Display Order
                    <span className="ml-1 text-red-400">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Lower numbers appear first.
                  </p>

                </div>

                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

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

              {/* ================================================= */}
              {/* ACTIONS */}
              {/* ================================================= */}

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
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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

                      {editingSolution
                        ? "Update Solution"
                        : "Create Solution"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================== */}
        {/* SOLUTIONS LIST */}
        {/* ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <h3 className="font-semibold">
              Advertising Solutions
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {solutions.length} solution
              {solutions.length === 1
                ? ""
                : "s"} configured.
            </p>

          </div>

          {/* ================================================== */}
          {/* LOADING */}
          {/* ================================================== */}

          {loading ? (

            <div className="flex min-h-64 items-center justify-center">

              <div className="flex items-center gap-3 text-slate-400">

                <Loader2
                  size={21}
                  className="animate-spin"
                />

                Loading solutions...

              </div>

            </div>

          ) : solutions.length === 0 ? (

            /* ================================================= */
            /* EMPTY */
            /* ================================================= */

            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

              <Lightbulb
                size={36}
                className="mb-4 text-slate-700"
              />

              <p className="font-medium text-slate-300">
                No solutions found.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Create the first advertising solution.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
              >
                <Plus size={17} />

                Create Solution
              </button>

            </div>

          ) : (

            /* ================================================= */
            /* LIST */
            /* ================================================= */

            <div className="divide-y divide-slate-800">

              {solutions.map(
                (solution) => {

                  const SolutionIcon =
                    getSolutionIcon(
                      solution.icon
                    );

                  const solutionImage =
                    getImageUrl(
                      solution.image_url
                    );

                  return (
                    <div
                      key={solution.id}
                      className="px-5 py-5 transition hover:bg-slate-950/40"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        {/* ================================================= */}
                        {/* IMAGE */}
                        {/* ================================================= */}

                        <div className="shrink-0">

                          {solutionImage ? (
                            <div className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 sm:w-52">

                              <img
                                src={solutionImage}
                                alt={
                                  solution.title ||
                                  "Solution"
                                }
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            </div>
                          ) : (
                            <div className="flex h-32 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-700 sm:w-52">

                              <ImageIcon
                                size={30}
                              />

                            </div>
                          )}

                        </div>

                        {/* ================================================= */}
                        {/* CONTENT */}
                        {/* ================================================= */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-3">

                            {/* ORDER */}

                            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-800 px-2 text-xs font-bold text-slate-300">
                              {solution.display_order}
                            </span>

                            {/* ICON */}

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">

                              <SolutionIcon
                                size={18}
                                className="text-slate-300"
                              />

                            </div>

                            {/* TITLE */}

                            <h4 className="font-semibold text-white">
                              {solution.title}
                            </h4>

                            {/* STATUS */}

                            <StatusBadge
                              status={
                                solution.status
                              }
                            />

                          </div>

                          {/* ICON NAME */}

                          <div className="mt-2 text-xs text-slate-600">

                            Icon:{" "}

                            <span className="text-slate-400">
                              {solution.icon ||
                                "—"}
                            </span>

                          </div>

                          {/* DESCRIPTION */}

                          {solution.description && (
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                              {
                                solution.description
                              }
                            </p>
                          )}

                          {/* IMAGE URL */}

                          {solution.image_url && (
                            <div className="mt-3 max-w-3xl break-all text-xs text-slate-700">
                              Image:{" "}
                              <span className="text-slate-500">
                                {solution.image_url}
                              </span>
                            </div>
                          )}

                        </div>

                        {/* ================================================= */}
                        {/* ACTIONS */}
                        {/* ================================================= */}

                        <div className="flex shrink-0 flex-wrap items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                solution
                              )
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                          >
                            <Edit3
                              size={14}
                            />

                            Edit
                          </button>

                         

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

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
        required={required}
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

export default AdminCmsSolutions;