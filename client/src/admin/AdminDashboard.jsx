import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Inbox,
  PhoneCall,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminInquiries,
  logoutAdmin,
} from "./services/adminApi";

import { useAdminAuth } from "./context/AdminAuthContext";

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

function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard(showRefresh = false) {
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
        "ADMIN DASHBOARD ERROR:",
        loadError
      );

      if (loadError.status === 401) {
        logout();
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError(
        loadError.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

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

  const recentInquiries = useMemo(() => {
    return [...inquiries]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 5);
  }, [inquiries]);

  function handleLogout() {
    logoutAdmin();
    logout();

    navigate("/admin/login", {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

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
                Administration Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {admin && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-200">
                  {admin.fullName ||
                    admin.full_name ||
                    "Administrator"}
                </p>

                <p className="text-xs text-slate-500">
                  {admin.email}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
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

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>

            <p className="mt-2 text-slate-400">
              Overview of Digital Wisdom advertising
              inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
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

        {/* STATISTICS */}

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

          <StatCard
            label="Total"
            value={statistics.total}
            icon={<Inbox size={19} />}
          />

          <StatCard
            label="New"
            value={statistics.new}
            icon={<Inbox size={19} />}
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
            icon={<XCircle size={19} />}
          />

        </div>

        {/* QUICK ACTIONS */}

        <div className="mb-8 grid gap-4 md:grid-cols-2">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/inquiries")
            }
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-slate-700 hover:bg-slate-900/80"
          >
            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold text-white">
                  Manage Inquiries
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Review, search and update advertising
                  inquiries.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white"
              />

            </div>
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="font-semibold text-white">
              Administrator
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {admin?.email || "Administrator"}
            </p>

            <div className="mt-4 inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
              ACTIVE
            </div>

          </div>

        </div>

        {/* RECENT INQUIRIES */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

            <div>
              <h3 className="font-semibold">
                Recent Inquiries
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Latest advertising requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/inquiries")
              }
              className="text-sm text-slate-400 transition hover:text-white"
            >
              View all
            </button>

          </div>

          {loading ? (

            <div className="flex min-h-48 items-center justify-center">
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2
                  size={21}
                  className="animate-spin"
                />
                Loading...
              </div>
            </div>

          ) : recentInquiries.length === 0 ? (

            <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
              No inquiries yet.
            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {recentInquiries.map((inquiry) => (

                <div
                  key={inquiry.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <p className="font-medium text-white">
                      {inquiry.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {inquiry.email}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {inquiry.campaign_type}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">

                    <StatusBadge
                      status={inquiry.status}
                    />

                    <p className="mt-2 text-xs text-slate-600">
                      {formatDate(
                        inquiry.created_at
                      )}
                    </p>

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

function StatusBadge({ status }) {
  const styles = {
    NEW:
      "bg-blue-500/10 text-blue-300 border-blue-500/20",

    CONTACTED:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",

    IN_PROGRESS:
      "bg-purple-500/10 text-purple-300 border-purple-500/20",

    COMPLETED:
      "bg-green-500/10 text-green-300 border-green-500/20",

    CANCELLED:
      "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default AdminDashboard;