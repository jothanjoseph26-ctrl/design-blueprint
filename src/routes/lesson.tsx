import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Play, SkipForward, Volume2, Settings, Maximize, Clock, Video,
  CheckCircle2, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import excel from "@/assets/lesson-excel.jpg";
import { StudentShell } from "@/components/apnet/StudentShell";

export const Route = createFileRoute("/lesson")({
  head: () => ({
    meta: [
      { title: "Lesson 3: Building the Income Statement — APNET Masterclass" },
      { name: "description", content: "Excel demonstration: build a detailed income statement with revenue drivers, cost assumptions and key checks." },
      { property: "og:title", content: "Lesson 3: Building the Income Statement — APNET" },
      { property: "og:description", content: "Module 4 lesson player — Excel demonstration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPlayer,
});

const tabs = ["Overview", "Notes", "Resources (3)", "Transcript"];

const lessons = [
  { n: 1, t: "Model Overview", d: "5 min", done: true },
  { n: 2, t: "Understanding the Lineages", d: "18 min", done: true },
  { n: 3, t: "Building the Income Statement", d: "22 min", active: true },
  { n: 4, t: "Building the Balance Sheet", d: "22 min" },
  { n: 5, t: "Building the Cash Flow Statement", d: "20 min" },
  { n: 6, t: "Model Checks and Error Tracing", d: "18 min" },
];

function LessonPlayer() {
  const [tab, setTab] = useState("Overview");

  return (
    <StudentShell
      active="My Masterclass"
      topbar={
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">My Masterclass</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/module" className="hover:text-foreground">Module 4</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Lesson 3</span>
        </nav>
      }
    >
      <div className="mx-auto grid max-w-6xl gap-5 p-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <div className="relative overflow-hidden rounded-lg bg-card">
            <img src={excel} alt="Excel demonstration" width={1280} height={720} className="w-full" loading="lazy" />
            <img
              src={hero}
              alt="Instructor"
              width={160}
              height={90}
              className="absolute bottom-14 right-3 w-40 rounded-md border border-border object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-background/80 px-4 py-2.5 text-foreground">
              <button aria-label="Play"><Play className="h-4 w-4" /></button>
              <button aria-label="Skip forward"><SkipForward className="h-4 w-4" /></button>
              <button aria-label="Volume"><Volume2 className="h-4 w-4" /></button>
              <span className="text-xs text-muted-foreground">10:24 / 22:00</span>
              <span className="flex-1" />
              <span className="text-xs">1x</span>
              <span className="text-xs font-semibold">CC</span>
              <button aria-label="Settings"><Settings className="h-4 w-4" /></button>
              <button aria-label="Fullscreen"><Maximize className="h-4 w-4" /></button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold">Lesson 3: Building the Income Statement</h1>
            <p className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />22 minutes</span>
              <span className="flex items-center gap-1"><Video className="h-3 w-3" />Video Lesson</span>
            </p>
          </div>

          <div>
            <div className="flex gap-6 overflow-x-auto border-b border-border text-sm">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mb-px whitespace-nowrap border-b-2 pb-2 ${
                    t === tab
                      ? "border-primary font-semibold text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              In this lesson, we build a detailed income statement with revenue drivers, cost
              assumptions and key checks.
            </p>
          </div>
        </div>

        <aside className="rounded-lg bg-card p-4">
          <h2 className="font-semibold">Module 4 Lessons</h2>
          <p className="mt-1 text-xs text-muted-foreground">60% complete (6 of 10 lessons)</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[60%] rounded-full bg-gold" />
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {lessons.map((l) => (
              <li
                key={l.n}
                className={`flex items-center gap-2 rounded-md px-2 py-2 ${
                  l.active ? "bg-gold text-gold-foreground" : ""
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${
                    l.active ? "bg-primary text-primary-foreground" : "border border-border"
                  }`}
                >
                  {l.n}
                </span>
                <span className="flex-1 leading-tight">{l.t}</span>
                <span className="text-xs opacity-80">{l.d}</span>
                {l.done && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
              </li>
            ))}
          </ul>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-secondary">
            <CheckCircle2 className="h-4 w-4" /> Mark as Complete
          </button>
        </aside>
      </div>
    </StudentShell>
  );
}
