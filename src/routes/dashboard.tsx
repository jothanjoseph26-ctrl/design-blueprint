import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpen, Layers, ClipboardList, Award, FolderOpen, Mail, User, Settings,
  HelpCircle, Bell, ChevronDown, ArrowRight, Clock, Video,
} from "lucide-react";
import { Logo } from "@/components/apnet/Logo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Masterclass — APNET Student Dashboard" },
      { name: "description", content: "Track your progress, schedule and lessons in the APNET Masterclass." },
      { property: "og:title", content: "My Masterclass — APNET" },
      { property: "og:description", content: "Your APNET learning dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Masterclass" },
  { icon: Layers, label: "Modules" },
  { icon: ClipboardList, label: "Assessments" },
  { icon: Award, label: "Certificates" },
  { icon: FolderOpen, label: "Resources" },
  { icon: Mail, label: "Messages", badge: 2 },
];
const schedule = [
  { d: "15", t: "Continue Lesson", s: "Cash Flow Statement" },
  { d: "18", t: "Module 4 Assessment", s: "Due in 3 days" },
  { d: "02", m: "Nov", t: "Module 5 Available", s: "Forecasting & Scenario Analysis" },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 flex-col border-r border-border bg-card p-4 md:flex">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1 text-sm">
          {nav.map(({ icon: I, label, active, badge }) => (
            <a key={label} href="#" className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <I className="h-4 w-4" /> <span className="flex-1">{label}</span>
              {badge && <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{badge}</span>}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {[[User, "Profile"], [Settings, "Settings"], [HelpCircle, "Help & Support"]].map(([I, l]: any) => (
            <a key={l} href="#" className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-secondary hover:text-foreground"><I className="h-4 w-4" />{l}</a>
          ))}
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex items-center justify-end gap-5 border-b border-border px-6 py-3">
          <Bell className="h-5 w-5" />
          <div className="flex items-center gap-2 text-sm">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-paper text-xs font-bold text-paper-foreground">AO</span>
            Adeola Oladipo <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Welcome back,<br />Adeola 👋</h1>
              <p className="mt-2 text-sm text-muted-foreground">Continue your learning journey in the APNET Masterclass.</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-paper p-4 text-paper-foreground">
              <div className="grid h-16 w-16 place-items-center rounded-full font-bold" style={{ background: "conic-gradient(var(--success) 24%, var(--border) 0)" }}>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-paper">24%</span>
              </div>
              <div><p className="font-semibold">Overall Progress</p><p className="text-xs opacity-70">36 of 150 lessons completed</p></div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-lg bg-paper p-5 text-paper-foreground">
              <h2 className="font-semibold">Continue Learning</h2>
              <div className="mt-3 h-32 rounded-md bg-gradient-to-br from-info/30 to-success/30" />
              <p className="mt-3 text-sm font-semibold">Module 4: Building a Three-Statement Model</p>
              <p className="text-xs opacity-70">Lesson 3: Cash Flow Statement</p>
              <p className="mt-2 flex gap-4 text-xs opacity-70"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />22 minutes</span><span className="flex items-center gap-1"><Video className="h-3 w-3" />Video Lesson</span></p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Continue Learning <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="rounded-lg bg-paper p-5 text-paper-foreground">
              <div className="flex justify-between"><h2 className="font-semibold">My Schedule</h2><a className="text-xs">View All →</a></div>
              <ul className="mt-4 space-y-4">
                {schedule.map((s) => (
                  <li key={s.t} className="flex items-center gap-4">
                    <span className="w-12 rounded-md border border-primary/30 py-1 text-center text-primary"><b className="block text-lg leading-none">{s.d}</b><span className="text-[10px]">{s.m ?? "Oct"}</span></span>
                    <div><p className="text-sm font-semibold">{s.t}</p><p className="text-xs opacity-70">{s.s}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border text-paper-foreground md:grid-cols-4">
            {[["36/150", "Lessons Completed"], ["3/15", "Modules Passed"], ["2", "Assessments Pending"]].map(([v, l]) => (
              <div key={l} className="bg-paper p-4 text-center"><p className="text-2xl font-bold">{v}</p><p className="text-xs opacity-70">{l}</p></div>
            ))}
            <div className="flex items-center gap-3 bg-paper p-4"><Award className="h-8 w-8 text-gold" /><div><p className="font-semibold">Certificate</p><p className="text-xs opacity-70">Complete all modules</p></div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
