
import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  MessageSquare,
  XCircle,
  Mail,
  Building2,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getAdminToken,
  getAdminInquiries,
  getAdminComments,
  getAdminComment,
  logoutAdmin,
  updateInquiryStatus as apiUpdateInquiryStatus,
} from "./services/adminApi";

// ============================================================
// INQUIRY STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES = {
  NEW: {
    label: "New",
    className:
      "bg-blue-500/15 text-blue-300 border-blue-400/20",
  },

  CONTACTED: {
    label: "Contacted",
    className:
      "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-amber-500/15 text-amber-300 border-amber-400/20",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-red-500/15 text-red-300 border-red-400/20",
  },
};

// ============================================================
// DATE FORMATTER
// ============================================================

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
  const config =
    STATUS_STYLES[status] || {
      label: status || "Unknown",
      className:
        "bg-slate-500/15 text-slate-300 border-slate-400/20",
    };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-white">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs font-medium text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <Icon size={14} />
        {label}
      </div>

      <div className="break-words text-sm font-semibold text-white">
        {value || "—"}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminInquiries() {
  const navigate = useNavigate();

  // ==========================================================
  // ACTIVE TAB
  // ==========================================================

  const [activeTab, setActiveTab] = useState(
    "inquiries"
  );

  // ==========================================================
  // INQUIRIES
  // ==========================================================

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] =
    useState(null);

  // ==========================================================
  // COMMENTS
  // ==========================================================

  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] =
    useState(null);

  // ==========================================================
  // LOADING
  // ==========================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [commentsLoading, setCommentsLoading] =
    useState(false);

  const [commentViewingId, setCommentViewingId] =
    useState(null);

  const [error, setError] = useState("");

  // ==========================================================
  // SEARCH
  // ==========================================================

  const [search, setSearch] = useState("");
  const [commentSearch, setCommentSearch] =
    useState("");

  // ==========================================================
  // INQUIRY UPDATING
  // ==========================================================

  const [updatingId, setUpdatingId] =
    useState(null);

  // ==========================================================
  // ADMIN DATA
  // ==========================================================

  const adminData = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "digital_wisdom_admin"
        ) || "null"
      );
    } catch {
      return null;
    }
  }, []);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  function logout() {
    logoutAdmin();

    localStorage.removeItem(
      "digital_wisdom_admin"
    );

    navigate("/admin/login");
  }

  // ==========================================================
  // LOAD INQUIRIES
  // ==========================================================

  async function loadInquiries(
    showRefresh = false
  ) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result =
        await getAdminInquiries();

      const inquiryData =
        result?.data ||
        result?.inquiries ||
        [];

      setInquiries(
        Array.isArray(inquiryData)
          ? inquiryData
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN INQUIRIES LOAD ERROR:",
        err
      );

      if (err?.status === 401) {
        logout();
        return;
      }

      if (err?.status === 403) {
        setError(
          "You do not have permission to access advertising inquiries."
        );
        return;
      }

      setError(
        err?.message ||
          "Unable to load advertising inquiries."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ==========================================================
  // LOAD COMMENTS
  // ==========================================================

  async function loadComments(
    showRefresh = false
  ) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setCommentsLoading(true);
      }

      const result =
        await getAdminComments();

      const commentData =
        result?.data ||
        result?.comments ||
        [];

      setComments(
        Array.isArray(commentData)
          ? commentData
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN COMMENTS LOAD ERROR:",
        err
      );

      if (err?.status === 401) {
        logout();
        return;
      }

      if (err?.status === 403) {
        setError(
          "You do not have permission to access customer comments."
        );
        return;
      }

      setError(
        err?.message ||
          "Unable to load customer comments."
      );
    } finally {
      setCommentsLoading(false);
      setRefreshing(false);
    }
  }

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login");
      return;
    }

    loadInquiries();
  }, []);

  // ==========================================================
  // LOAD DATA WHEN TAB CHANGES
  // ==========================================================

  useEffect(() => {
    if (activeTab === "comments") {
      if (comments.length === 0) {
        loadComments();
      }
    }
  }, [activeTab]);

  // ==========================================================
  // REFRESH ACTIVE TAB
  // ==========================================================

  function refreshCurrentTab() {
    if (activeTab === "inquiries") {
      loadInquiries(true);
    } else {
      loadComments(true);
    }
  }

  // ==========================================================
  // UPDATE INQUIRY STATUS
  // ==========================================================

  async function updateStatus(
    inquiryId,
    newStatus
  ) {
    try {
      setUpdatingId(inquiryId);

      await apiUpdateInquiryStatus(
        inquiryId,
        newStatus
      );

      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === inquiryId
            ? {
                ...inquiry,
                status: newStatus,
              }
            : inquiry
        )
      );

      setSelectedInquiry((current) =>
        current?.id === inquiryId
          ? {
              ...current,
              status: newStatus,
            }
          : current
      );
    } catch (err) {
      console.error(
        "UPDATE INQUIRY STATUS ERROR:",
        err
      );

      if (err?.status === 401) {
        logout();
        return;
      }

      setError(
        err?.message ||
          "Unable to update inquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // ==========================================================
  // VIEW CUSTOMER COMMENT
  // ==========================================================
  //
  // IMPORTANT:
  // Clicking View calls the backend endpoint:
  //
  // GET /api/comments/admin/:id
  //
  // The backend automatically changes:
  //
  // is_seen = 0  ->  is_seen = 1
  //
  // ==========================================================

  async function viewComment(comment) {
    try {
      setError("");
      setCommentViewingId(comment.id);

      const result =
        await getAdminComment(comment.id);

      const viewedComment =
        result?.data ||
        result?.comment ||
        null;

      if (!viewedComment) {
        throw new Error(
          "Unable to load the customer comment."
        );
      }

      // ------------------------------------------------------
      // Update selected comment
      // ------------------------------------------------------

      setSelectedComment(
        viewedComment
      );

      // ------------------------------------------------------
      // Immediately mark the row as SEEN locally.
      //
      // The database is already updated by the backend.
      // ------------------------------------------------------

      setComments((current) =>
        current.map((item) =>
          Number(item.id) ===
          Number(comment.id)
            ? {
                ...item,
                ...viewedComment,
                is_seen: 1,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "VIEW CUSTOMER COMMENT ERROR:",
        err
      );

      if (err?.status === 401) {
        logout();
        return;
      }

      if (err?.status === 403) {
        setError(
          "You do not have permission to view customer comments."
        );
        return;
      }

      setError(
        err?.message ||
          "Unable to load the customer comment."
      );
    } finally {
      setCommentViewingId(null);
    }
  }

  // ==========================================================
  // FILTER INQUIRIES
  // ==========================================================

  const filteredInquiries = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return inquiries;
    }

    return inquiries.filter((inquiry) => {
      return [
        inquiry.name,
        inquiry.email,
        inquiry.company,
        inquiry.campaign_type,
        inquiry.campaignType,
        inquiry.message,
        inquiry.status,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field)
            .toLowerCase()
            .includes(value)
        );
    });
  }, [inquiries, search]);

  // ==========================================================
  // FILTER COMMENTS
  // ==========================================================

  const filteredComments = useMemo(() => {
    const value =
      commentSearch.trim().toLowerCase();

    if (!value) {
      return comments;
    }

    return comments.filter((comment) =>
      String(comment.comment || "")
        .toLowerCase()
        .includes(value)
    );
  }, [comments, commentSearch]);

  // ==========================================================
  // INQUIRY STATISTICS
  // ==========================================================

  const inquiryStats = useMemo(() => {
    return {
      total: inquiries.length,

      new: inquiries.filter(
        (item) => item.status === "NEW"
      ).length,

      contacted: inquiries.filter(
        (item) => item.status === "CONTACTED"
      ).length,

      inProgress: inquiries.filter(
        (item) =>
          item.status === "IN_PROGRESS"
      ).length,

      completed: inquiries.filter(
        (item) =>
          item.status === "COMPLETED"
      ).length,

      cancelled: inquiries.filter(
        (item) =>
          item.status === "CANCELLED"
      ).length,
    };
  }, [inquiries]);

  // ==========================================================
  // COMMENT STATISTICS
  // ==========================================================

  const commentStats = useMemo(() => {
    const total = comments.length;

    const unseen = comments.filter(
      (comment) =>
        Number(comment.is_seen) === 0
    ).length;

    const seen = total - unseen;

    return {
      total,
      unseen,
      seen,
    };
  }, [comments]);

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06152d] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              size={38}
              className="animate-spin text-blue-400"
            />

            <p className="text-sm font-semibold text-slate-400">
              Loading administrator dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#06152d] text-white">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06152d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                Digital Wisdom
              </h1>

              <p className="text-xs font-semibold text-slate-500">
                Administration Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-white">
                {adminData?.name ||
                  adminData?.email ||
                  "Administrator"}
              </p>

              <p className="text-xs text-slate-500">
                {adminData?.role || "ADMIN"}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
        {/* ====================================================
            PAGE TITLE
        ==================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-blue-400">
              Management
            </p>

            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              {activeTab === "inquiries"
                ? "Advertising Inquiries"
                : "Customer Comments"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {activeTab === "inquiries"
                ? "Manage advertising inquiries submitted through the website."
                : "View customer feedback submitted through the website."}
            </p>
          </div>

          <button
            type="button"
            onClick={refreshCurrentTab}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
            <CircleAlert
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <p className="font-bold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-200/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-300 transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* ====================================================
            TABS
        ==================================================== */}

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {/* INQUIRIES TAB */}

            <button
              type="button"
              onClick={() => {
                setActiveTab("inquiries");
                setError("");
              }}
              className={`group relative flex items-center justify-center gap-3 rounded-xl px-5 py-4 text-sm font-black transition ${
                activeTab === "inquiries"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <BriefcaseBusiness
                size={19}
              />

              <span>
                Advertising Inquiries
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  activeTab === "inquiries"
                    ? "bg-white/20 text-white"
                    : "bg-white/[0.06] text-slate-500"
                }`}
              >
                {inquiryStats.total}
              </span>
            </button>

            {/* COMMENTS TAB */}

            <button
              type="button"
              onClick={() => {
                setActiveTab("comments");
                setError("");
              }}
              className={`group relative flex items-center justify-center gap-3 rounded-xl px-5 py-4 text-sm font-black transition ${
                activeTab === "comments"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <MessageSquare
                size={19}
              />

              <span>
                Customer Comments
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  commentStats.unseen > 0
                    ? activeTab === "comments"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-amber-500/20 text-amber-300"
                    : activeTab === "comments"
                    ? "bg-white/20 text-white"
                    : "bg-white/[0.06] text-slate-500"
                }`}
              >
                {commentStats.unseen > 0
                  ? `${commentStats.unseen} Unseen`
                  : commentStats.total}
              </span>
            </button>
          </div>
        </div>

        {/* ====================================================
            ADVERTISING INQUIRIES TAB
        ==================================================== */}

        {activeTab === "inquiries" && (
          <>
            {/* INQUIRY STATS */}

            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                icon={MessageSquare}
                label="Total"
                value={inquiryStats.total}
                description="All inquiries"
              />

              <StatCard
                icon={CircleAlert}
                label="New"
                value={inquiryStats.new}
                description="Needs attention"
              />

              <StatCard
                icon={PhoneCall}
                label="Contacted"
                value={inquiryStats.contacted}
                description="Customer contacted"
              />

              <StatCard
                icon={Clock3}
                label="In Progress"
                value={inquiryStats.inProgress}
                description="Currently active"
              />

              <StatCard
                icon={CheckCircle2}
                label="Completed"
                value={inquiryStats.completed}
                description="Successfully handled"
              />

              <StatCard
                icon={XCircle}
                label="Cancelled"
                value={inquiryStats.cancelled}
                description="Cancelled inquiries"
              />
            </section>

            {/* INQUIRY TABLE */}

            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl">
              <div className="border-b border-white/10 p-5 md:p-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div>
                    <h3 className="text-xl font-black text-white">
                      Advertising Inquiries
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {filteredInquiries.length}{" "}
                      inquiry
                      {filteredInquiries.length ===
                      1
                        ? ""
                        : "ies"}{" "}
                      displayed
                    </p>
                  </div>

                  <div className="relative w-full lg:max-w-md">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search inquiries..."
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Company
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Campaign
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInquiries.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-16 text-center"
                        >
                          <MessageSquare
                            size={34}
                            className="mx-auto mb-3 text-slate-600"
                          />

                          <p className="font-bold text-slate-400">
                            No inquiries found
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            Try changing your
                            search.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map(
                        (inquiry) => (
                          <tr
                            key={inquiry.id}
                            className="border-b border-white/[0.06] transition hover:bg-white/[0.025]"
                          >
                            <td className="px-5 py-4">
                              <div className="font-bold text-white">
                                {inquiry.name ||
                                  "—"}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {inquiry.email ||
                                  "—"}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-slate-300">
                              {inquiry.company ||
                                "—"}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-slate-300">
                              {inquiry.campaign_type ||
                                inquiry.campaignType ||
                                "—"}
                            </td>

                            <td className="px-5 py-4 text-xs font-medium text-slate-500">
                              {formatDate(
                                inquiry.created_at ||
                                  inquiry.createdAt
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <StatusBadge
                                  status={
                                    inquiry.status
                                  }
                                />

                                <select
                                  value={
                                    inquiry.status ||
                                    "NEW"
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateStatus(
                                      inquiry.id,
                                      event.target
                                        .value
                                    )
                                  }
                                  disabled={
                                    updatingId ===
                                    inquiry.id
                                  }
                                  className="rounded-lg border border-white/10 bg-[#081a35] px-2 py-1.5 text-xs font-bold text-slate-300 outline-none disabled:opacity-50"
                                >
                                  {STATUS_OPTIONS.map(
                                    (status) => (
                                      <option
                                        key={status}
                                        value={
                                          status
                                        }
                                      >
                                        {
                                          STATUS_STYLES[
                                            status
                                          ].label
                                        }
                                      </option>
                                    )
                                  )}
                                </select>

                                {updatingId ===
                                  inquiry.id && (
                                  <Loader2
                                    size={14}
                                    className="animate-spin text-blue-400"
                                  />
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedInquiry(
                                    inquiry
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-black text-blue-300 transition hover:bg-blue-500/20"
                              >
                                <Eye
                                  size={15}
                                />
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ====================================================
            CUSTOMER COMMENTS TAB
        ==================================================== */}

        {activeTab === "comments" && (
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl">

            {/* COMMENT HEADER */}

            <div className="border-b border-white/10 p-5 md:p-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                      <MessageSquare
                        size={21}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">
                        Customer Comments
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {commentStats.total}{" "}
                        customer comment
                        {commentStats.total === 1
                          ? ""
                          : "s"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative w-full lg:max-w-md">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={commentSearch}
                    onChange={(event) =>
                      setCommentSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search comments..."
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
                  />
                </div>
              </div>

              {/* COMMENT COUNTERS */}

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <MessageSquare
                    size={14}
                    className="text-blue-300"
                  />

                  <span className="text-xs font-bold text-slate-400">
                    Total
                  </span>

                  <span className="text-xs font-black text-white">
                    {commentStats.total}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2">
                  <CircleAlert
                    size={14}
                    className="text-amber-300"
                  />

                  <span className="text-xs font-bold text-amber-300">
                    Unseen
                  </span>

                  <span className="text-xs font-black text-amber-200">
                    {commentStats.unseen}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-300"
                  />

                  <span className="text-xs font-bold text-emerald-300">
                    Seen
                  </span>

                  <span className="text-xs font-black text-emerald-200">
                    {commentStats.seen}
                  </span>
                </div>
              </div>
            </div>

            {/* COMMENT TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Comment
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Submitted
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {commentsLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-16 text-center"
                      >
                        <Loader2
                          size={30}
                          className="mx-auto mb-3 animate-spin text-blue-400"
                        />

                        <p className="text-sm font-semibold text-slate-500">
                          Loading customer
                          comments...
                        </p>
                      </td>
                    </tr>
                  ) : filteredComments.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-16 text-center"
                      >
                        <MessageSquare
                          size={34}
                          className="mx-auto mb-3 text-slate-600"
                        />

                        <p className="font-bold text-slate-400">
                          No customer comments
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Customer comments will
                          appear here when submitted.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredComments.map(
                      (comment) => {
                        const isUnseen =
                          Number(
                            comment.is_seen
                          ) === 0;

                        const isViewing =
                          Number(
                            commentViewingId
                          ) ===
                          Number(comment.id);

                        return (
                          <tr
                            key={comment.id}
                            className={`border-b border-white/[0.06] transition ${
                              isUnseen
                                ? "bg-amber-500/[0.025] hover:bg-amber-500/[0.05]"
                                : "hover:bg-white/[0.025]"
                            }`}
                          >
                            {/* COMMENT */}

                            <td className="max-w-[700px] px-5 py-5">
                              <div className="flex items-start gap-3">

                                {/* UNSEEN DOT */}

                                <span
                                  className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                                    isUnseen
                                      ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.65)]"
                                      : "bg-emerald-400/40"
                                  }`}
                                />

                                <p
                                  className={`line-clamp-2 text-sm leading-6 ${
                                    isUnseen
                                      ? "font-bold text-white"
                                      : "font-medium text-slate-300"
                                  }`}
                                >
                                  {comment.comment ||
                                    "—"}
                                </p>
                              </div>
                            </td>

                            {/* DATE */}

                            <td className="whitespace-nowrap px-5 py-5 text-xs font-medium text-slate-500">
                              {formatDate(
                                comment.created_at ||
                                  comment.createdAt
                              )}
                            </td>

                            {/* SEEN / UNSEEN */}

                            <td className="px-5 py-5">
                              {isUnseen ? (
                                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-[11px] font-black tracking-wide text-amber-300">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                  UNSEEN
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-black tracking-wide text-emerald-300">
                                  <CheckCircle2
                                    size={13}
                                  />
                                  SEEN
                                </span>
                              )}
                            </td>

                            {/* VIEW BUTTON */}

                            <td className="px-5 py-5 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  viewComment(
                                    comment
                                  )
                                }
                                disabled={
                                  commentViewingId !==
                                    null ||
                                  isViewing
                                }
                                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                  isUnseen
                                    ? "border-amber-400/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                    : "border-blue-400/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                                }`}
                              >
                                {isViewing ? (
                                  <>
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />

                                    Loading...
                                  </>
                                ) : (
                                  <>
                                    <Eye
                                      size={15}
                                    />

                                    {isUnseen
                                      ? "View"
                                      : "View Again"}
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ======================================================
          INQUIRY DETAIL MODAL
      ====================================================== */}

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#081a35] shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#081a35]/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                  Inquiry Details
                </p>

                <h3 className="mt-1 text-xl font-black text-white">
                  {selectedInquiry.name ||
                    "Customer Inquiry"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedInquiry(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={UserRound}
                  label="Customer"
                  value={
                    selectedInquiry.name
                  }
                />

                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={
                    selectedInquiry.email
                  }
                />

                <DetailItem
                  icon={Building2}
                  label="Company"
                  value={
                    selectedInquiry.company
                  }
                />

                <DetailItem
                  icon={BriefcaseBusiness}
                  label="Campaign"
                  value={
                    selectedInquiry.campaign_type ||
                    selectedInquiry.campaignType
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Submitted"
                  value={formatDate(
                    selectedInquiry.created_at ||
                      selectedInquiry.createdAt
                  )}
                />

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={
                        selectedInquiry.status
                      }
                    />

                    <select
                      value={
                        selectedInquiry.status ||
                        "NEW"
                      }
                      onChange={(event) =>
                        updateStatus(
                          selectedInquiry.id,
                          event.target.value
                        )
                      }
                      disabled={
                        updatingId ===
                        selectedInquiry.id
                      }
                      className="rounded-lg border border-white/10 bg-[#06152d] px-3 py-2 text-xs font-bold text-slate-300 outline-none"
                    >
                      {STATUS_OPTIONS.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {
                              STATUS_STYLES[
                                status
                              ].label
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  <MessageSquare size={15} />
                  Customer Message
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {selectedInquiry.message ||
                    "No message provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          CUSTOMER COMMENT DETAIL MODAL
      ====================================================== */}

      {selectedComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#081a35] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <MessageSquare
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                    Customer Feedback
                  </p>

                  <h3 className="mt-1 text-lg font-black text-white">
                    Customer Comment
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedComment(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* COMMENT CONTENT */}

            <div className="p-6">

              {/* SEEN STATUS */}

              <div className="mb-5 flex justify-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-black tracking-wide text-emerald-300">
                  <CheckCircle2
                    size={13}
                  />
                  SEEN
                </span>
              </div>

              <div className="rounded-2xl border border-blue-400/10 bg-blue-500/[0.04] p-6">
                <p className="whitespace-pre-wrap break-words text-base leading-8 text-slate-200">
                  {selectedComment.comment}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    {formatDate(
                      selectedComment.created_at ||
                        selectedComment.createdAt
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedComment(null)
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/[0.09]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}