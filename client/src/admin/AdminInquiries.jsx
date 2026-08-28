import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Eye,
  X,
  CheckCircle2,
  Clock3,
  PhoneCall,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminToken,
  getAdminInquiries,
  updateInquiryStatus as apiUpdateInquiryStatus,
  logoutAdmin,
} from "./services/adminApi";

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_STYLES = {
  NEW: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  CONTACTED:
    "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  IN_PROGRESS:
    "bg-purple-500/10 text-purple-300 border-purple-500/20",
  COMPLETED:
    "bg-green-500/10 text-green-300 border-green-500/20",
  CANCELLED:
    "bg-red-500/10 text-red-300 border-red-500/20",
};

// ============================================================
// DATE FORMATTER
// ============================================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ||
        "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

// ============================================================
// ADMIN INQUIRIES
// ============================================================

function AdminInquiries() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  // ============================================================
  // ADMIN DISPLAY DATA
  // ============================================================

  const adminData = useMemo(() => {
    try {
      const value = localStorage.getItem(
        "digital_wisdom_admin"
      );

      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }, []);

  // ============================================================
  // TOKEN
  // ============================================================

  function getToken() {
    return getAdminToken();
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function logout() {
    logoutAdmin();

    localStorage.removeItem(
      "digital_wisdom_admin"
    );

    setInquiries([]);
    setSelectedInquiry(null);

    navigate("/admin/login", {
      replace: true,
    });
  }

  // ============================================================
  // LOAD INQUIRIES
  // ============================================================

  async function loadInquiries(showRefresh = false) {
    const token = getToken();

    if (!token) {
      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAdminInquiries();

      setInquiries(data.inquiries || []);
    } catch (loadError) {
      console.error(
        "LOAD INQUIRIES ERROR:",
        loadError
      );

      // ========================================================
      // AUTHENTICATION FAILURE
      // ========================================================

      if (loadError.status === 401) {
        logout();
        return;
      }

      // ========================================================
      // DATABASE STATUS / ROLE FAILURE
      // ========================================================

      if (loadError.status === 403) {
        setError(
          loadError.message ||
            "You do not have permission to access inquiries."
        );

        return;
      }

      setError(
        loadError.message ||
          "Unable to load inquiries."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ============================================================
  // UPDATE INQUIRY STATUS
  // ============================================================

  async function updateStatus(
    inquiryId,
    newStatus
  ) {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    try {
      setUpdatingId(inquiryId);
      setError("");

      const data =
        await apiUpdateInquiryStatus(
          inquiryId,
          newStatus
        );

      const updatedInquiry = data.inquiry;

      // ========================================================
      // UPDATE TABLE
      // ========================================================

      setInquiries((previous) =>
        previous.map((inquiry) =>
          inquiry.id === inquiryId
            ? updatedInquiry
            : inquiry
        )
      );

      // ========================================================
      // UPDATE OPEN MODAL
      // ========================================================

      setSelectedInquiry((previous) =>
        previous?.id === inquiryId
          ? updatedInquiry
          : previous
      );
    } catch (updateError) {
      console.error(
        "UPDATE STATUS ERROR:",
        updateError
      );

      // ========================================================
      // AUTHENTICATION FAILURE
      // ========================================================

      if (updateError.status === 401) {
        logout();
        return;
      }

      // ========================================================
      // AUTHORIZATION FAILURE
      // ========================================================

      if (updateError.status === 403) {
        setError(
          updateError.message ||
            "You do not have permission to update this inquiry."
        );

        return;
      }

      setError(
        updateError.message ||
          "Unable to update inquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadInquiries();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredInquiries = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return inquiries;
    }

    return inquiries.filter((inquiry) =>
      [
        inquiry.name,
        inquiry.email,
        inquiry.company,
        inquiry.campaign_type,
        inquiry.message,
        inquiry.status,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field)
            .toLowerCase()
            .includes(value)
        )
    );
  }, [inquiries, search]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    return {
      total: inquiries.length,

      new: inquiries.filter(
        (item) => item.status === "NEW"
      ).length,

      contacted: inquiries.filter(
        (item) => item.status === "CONTACTED"
      ).length,

      inProgress: inquiries.filter(
        (item) => item.status === "IN_PROGRESS"
      ).length,

      completed: inquiries.filter(
        (item) => item.status === "COMPLETED"
      ).length,

      cancelled: inquiries.filter(
        (item) => item.status === "CANCELLED"
      ).length,
    };
  }, [inquiries]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <ShieldCheck
                size={24}
                className="text-slate-900"
              />
            </div>

            <div>
              <h1 className="font-semibold">
                Digital Wisdom Admin
              </h1>

              <p className="text-xs text-slate-500">
                Inquiry Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminData && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-200">
                  {adminData.fullName ||
                    adminData.full_name ||
                    "Administrator"}
                </p>

                <p className="text-xs text-slate-500">
                  {adminData.email}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-red-500/40 hover:text-red-300"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold">
              Advertising Inquiries
            </h2>

            <p className="mt-2 text-slate-400">
              Review and manage advertising requests
              received from the Digital Wisdom website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadInquiries(true)}
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
        {/* STATISTICS */}
        {/* ==================================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Total"
            value={statistics.total}
            icon={<CircleAlert size={19} />}
          />

          <StatCard
            label="New"
            value={statistics.new}
            icon={<CircleAlert size={19} />}
          />

          <StatCard
            label="Contacted"
            value={statistics.contacted}
            icon={<PhoneCall size={19} />}
          />

          <StatCard
            label="In Progress"
            value={statistics.inProgress}
            icon={<Clock3 size={19} />}
          />

          <StatCard
            label="Completed"
            value={statistics.completed}
            icon={<CheckCircle2 size={19} />}
          />

          <StatCard
            label="Cancelled"
            value={statistics.cancelled}
            icon={<X size={19} />}
          />
        </div>

        {/* ==================================================== */}
        {/* SEARCH */}
        {/* ==================================================== */}

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4">
          <Search
            size={19}
            className="text-slate-500"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search name, email, company, campaign..."
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>

        {/* ==================================================== */}
        {/* TABLE */}
        {/* ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2
                  size={22}
                  className="animate-spin"
                />

                Loading inquiries...
              </div>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <CircleAlert
                size={36}
                className="mb-3 text-slate-600"
              />

              <h3 className="font-semibold text-slate-300">
                No inquiries found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try a different search."
                  : "There are currently no advertising inquiries."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-slate-800 bg-slate-950/50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Advertiser
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Campaign
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Received
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredInquiries.map(
                    (inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {inquiry.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {inquiry.email}
                          </p>

                          {inquiry.company && (
                            <p className="mt-1 text-xs text-slate-600">
                              {inquiry.company}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {inquiry.campaign_type}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={inquiry.status}
                          />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {formatDate(
                            inquiry.created_at
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedInquiry(
                                inquiry
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                          >
                            <Eye size={16} />

                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ====================================================== */}
      {/* DETAILS MODAL */}
      {/* ====================================================== */}

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Inquiry #{selectedInquiry.id}
                </h3>

                <p className="text-xs text-slate-500">
                  Received{" "}
                  {formatDate(
                    selectedInquiry.created_at
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedInquiry(null)
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Name"
                  value={selectedInquiry.name}
                />

                <DetailItem
                  label="Email"
                  value={selectedInquiry.email}
                />

                <DetailItem
                  label="Company"
                  value={
                    selectedInquiry.company ||
                    "Not provided"
                  }
                />

                <DetailItem
                  label="Campaign"
                  value={
                    selectedInquiry.campaign_type
                  }
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Message
                </p>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Inquiry Status
                </p>

                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          updatingId ===
                            selectedInquiry.id ||
                          selectedInquiry.status ===
                            status
                        }
                        onClick={() =>
                          updateStatus(
                            selectedInquiry.id,
                            status
                          )
                        }
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          STATUS_STYLES[status]
                        }`}
                      >
                        {updatingId ===
                          selectedInquiry.id &&
                        selectedInquiry.status !==
                          status ? (
                          <span className="inline-flex items-center gap-1">
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />

                            Updating...
                          </span>
                        ) : (
                          status
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid gap-5 border-t border-slate-800 pt-5 sm:grid-cols-2">
                <DetailItem
                  label="Created"
                  value={formatDate(
                    selectedInquiry.created_at
                  )}
                />

                <DetailItem
                  label="Last Updated"
                  value={formatDate(
                    selectedInquiry.updated_at
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>

        <span className="text-slate-500">
          {icon}
        </span>
      </div>

      <p className="text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="break-words text-sm text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default AdminInquiries;