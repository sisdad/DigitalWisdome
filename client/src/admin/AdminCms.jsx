import {
  FileText,
  Layers,
  Lightbulb,
  MapPin,
  Gift,
  ListChecks,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function AdminCms() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Pages",
      description:
        "Manage Home, About, Network, Solutions and Contact pages.",
      icon: <FileText size={24} />,
      path: "/admin/cms/pages",
    },

    {
      title: "Solutions",
      description:
        "Manage advertising solutions displayed on the website.",
      icon: <Lightbulb size={24} />,
      path: "/admin/cms/solutions",
    },

    {
      title: "Locations",
      description:
        "Manage Digital Wisdom advertising network locations.",
      icon: <MapPin size={24} />,
      path: "/admin/cms/locations",
    },

    {
      title: "Benefits",
      description:
        "Manage the benefits and advantages shown to customers.",
      icon: <Gift size={24} />,
      path: "/admin/cms/benefits",
    },

    {
      title: "Campaign Process",
      description:
        "Manage the steps customers follow to launch campaigns.",
      icon: <ListChecks size={24} />,
      path: "/admin/cms/campaign-process",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

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
                Content Management System
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={17} />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </button>

        </div>

      </header>

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900">
              <Layers size={25} />
            </div>

            <div>

              <h2 className="text-3xl font-bold">
                Content Management
              </h2>

              <p className="mt-1 text-slate-400">
                Manage the content and configuration of
                the Digital Wisdom website.
              </p>

            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* CMS CARDS */}
        {/* ================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {sections.map((section) => (

            <button
              key={section.path}
              type="button"
              onClick={() =>
                navigate(section.path)
              }
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/80"
            >

              <div className="mb-5 flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition group-hover:bg-white group-hover:text-slate-900">
                  {section.icon}
                </div>

                <ArrowRight
                  size={19}
                  className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
                />

              </div>

              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {section.description}
              </p>

            </button>

          ))}

        </div>

        {/* ================================================== */}
        {/* INFORMATION */}
        {/* ================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">
              <Layers size={20} />
            </div>

            <div>

              <h3 className="font-semibold text-white">
                CMS Administration
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Changes made through this area are stored
                in the Digital Wisdom database and can be
                published to the public website without
                modifying the React source code.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminCms;