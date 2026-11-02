import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import { StudentShell } from "@/components/apnet/StudentShell";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Module 4 Assessment — APNET Masterclass" },
      { name: "description", content: "Practical assessment questions for Module 4: Building a Three-Statement Model." },
      { property: "og:title", content: "Module 4 Assessment — APNET" },
      { property: "og:description", content: "Assessment questions for Module 4." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Assessment,
});

const tabs = ["Instructions", "Questions", "Submit"];

const options = [
  "A fixed input that never changes",
  "An assumption that can be adjusted to test different scenarios",
  "A historical number copied from financial statements",
  "A formula used only in the cash flow statement",
];

function Assessment() {
  const [tab, setTab] = useState("Questions");
  const [selected, setSelected] = useState(0);

  return (
    <StudentShell
      active="Assessments"
      topbar={
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">My Masterclass</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/module" className="hover:text-foreground">Module 4</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Assessment</span>
        </nav>
      }
    >
      <div className="mx-auto max-w-4xl space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">Module 4 Assessment</h1>
          <span className="rounded-full border border-warning/30 bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
            Due 30 Oct 2024
          </span>
        </div>

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

        <div className="rounded-lg bg-card p-5">
          <div className="flex items-center justify-between text-sm">
            <p className="font-semibold">Question 3 of 10</p>
            <p className="text-muted-foreground">2 points</p>
          </div>
          <p className="mt-4 font-medium">
            Which of the following best describes a key driver in a financial model?
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {options.map((o, i) => (
              <li key={o}>
                <button
                  onClick={() => setSelected(i)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-secondary"
                >
                  <span
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                      selected === i ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}
                  >
                    {selected === i && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                  </span>
                  {o}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <button className="flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm hover:bg-secondary">
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
