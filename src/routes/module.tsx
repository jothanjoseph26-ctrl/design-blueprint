import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import workbook from "@/assets/workbook-template.jpg";
import { StudentShell } from "@/components/apnet/StudentShell";

export const Route = createFileRoute("/module")({
  head: () => ({
    meta: [
      { title: "Module 4: Building a Three-Statement Model — APNET Masterclass" },
      { name: "description", content: "Build an integrated three-statement model from scratch, including assumptions, drivers and key financial checks." },
      { property: "og:title", content: "Module 4: Building a Three-Statement Model — APNET" },
      { property: "og:description", content: "Module overview — lessons, resources and assessment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ModuleOverview,
});

const tabs = ["Overview", "Lessons (10)", "Resources (6)", "Assessment"];

const outcomes = [
  "Build a fully integrated three-statement model",
  "Link assumptions, drivers and key schedules",
  "Perform key financial checks and validation",
  "Use professional modelling best practices",
];

function ModuleOverview() {
  const [tab, setTab] = useState("Overview");

  return (
    <StudentShell
      active="Modules"
      topbar={
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
          <Link to="/dashboard" className="hover:text-foreground">My Masterclasses</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Module 4</span>
        </nav>
      }
    >
      <div className="mx-auto max-w-6xl space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Module 4: Building a Three-Statement Model</h1>
          <span className="rounded-full border border-warning/30 bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
            In Progress
          </span>
        </div>

        <p className="max-w-3xl text-sm text-muted-foreground">
          Learn how to build an integrated three-statement model from scratch, including
          assumptions, drivers and key financial checks.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-2 ${
                t === tab
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-card p-5">
            <h2 className="font-semibold">Learning Outcomes</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-card p-4">
            <img
              src={workbook}
              alt="Module workbook starter template"
              width={1024}
              height={640}
              className="w-full rounded-md border border-border"
              loading="lazy"
            />
            <p className="mt-3 text-sm font-semibold">Module Workbook (Starter Template)</p>
            <button className="mt-3 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
              Download Excel Template
            </button>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
