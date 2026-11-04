import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock, Video, CheckCircle2, ChevronRight, ChevronLeft, Download, FileText, PlayCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import excel from "@/assets/lesson-excel.jpg";
import { StudentShell } from "@/components/apnet/StudentShell";
import { VideoPlayer, type VideoPlayerHandle } from "@/components/apnet/VideoPlayer";
import { lessons, resolveVideoSource, streamPoster } from "@/lib/lessons";

export const Route = createFileRoute("/lesson")({
  head: () => ({
    meta: [
      { title: "Lesson Player — APNET Masterclass" },
      { name: "description", content: "Watch APNET Masterclass video lessons with transcript, notes and downloadable resources." },
      { property: "og:title", content: "Lesson Player — APNET Masterclass" },
      { property: "og:description", content: "Module 4 lesson player — Excel demonstrations streamed from Cloudflare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPlayer,
});

const TOTAL_IN_MODULE = 10;
const PRIOR_DONE = 4; // lessons 7–10 outside this list; sample baseline
type Store = { done: string[]; pos: Record<string, number>; notes: Record<string, string>; current: string };
const KEY = "apnet-lesson-progress";
const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

function LessonPlayer() {
  const [store, setStore] = useState<Store>({ done: ["l1", "l2"], pos: {}, notes: {}, current: "l3" });
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [now, setNow] = useState(0);
  const player = useRef<VideoPlayerHandle>(null);
  const lastSave = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(store)); }, [store, loaded]);

  const idx = Math.max(0, lessons.findIndex((l) => l.id === store.current));
  const lesson = lessons[idx] ?? lessons[0]!;
  const source = useMemo(() => resolveVideoSource(lesson), [lesson]);
  // Capture resume point once per lesson switch
  const startAt = useMemo(() => store.pos[lesson.id] ?? 0, [lesson.id, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const doneCount = store.done.length;
  const pct = Math.round(((doneCount + PRIOR_DONE) / TOTAL_IN_MODULE) * 100);
  const isDone = store.done.includes(lesson.id);

  const go = (id: string) => { setStore((s) => ({ ...s, current: id })); setNow(0); };
  const markDone = (id = lesson.id) =>
    setStore((s) => (s.done.includes(id) ? s : { ...s, done: [...s.done, id] }));

  const tabs = ["Overview", "Notes", `Resources (${lesson.resources.length})`, "Transcript"];
  const activeLine = lesson.transcript.reduce((a, l, i) => (now >= l.t ? i : a), 0);

  return (
    <StudentShell
      active="My Masterclass"
      topbar={
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">My Masterclass</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/module" className="hover:text-foreground">Module 4</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Lesson {lesson.n}</span>
        </nav>
      }
    >
      <div className="mx-auto grid max-w-6xl gap-5 p-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          {loaded ? (
            <VideoPlayer
              key={lesson.id}
              ref={player}
              src={source.src}
              isHls={source.isHls}
              poster={streamPoster(lesson) ?? excel}
              startAt={startAt}
              onProgress={(t, d) => {
                setNow(t);
                if (Math.abs(t - lastSave.current) > 5) {
                  lastSave.current = t;
                  setStore((s) => ({ ...s, pos: { ...s.pos, [lesson.id]: t } }));
                }
                if (d && t / d > 0.95) markDone();
              }}
              onEnded={() => markDone()}
            />
          ) : (
            <div className="aspect-video w-full rounded-lg bg-card" />
          )}

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Lesson {lesson.n}: {lesson.title}</h1>
              <p className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lesson.duration}</span>
                <span className="flex items-center gap-1"><Video className="h-3 w-3" />Video Lesson</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button disabled={idx === 0} onClick={() => go(lessons[idx - 1]!.id)} className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm disabled:opacity-40 hover:bg-secondary">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button disabled={idx === lessons.length - 1} onClick={() => go(lessons[idx + 1]!.id)} className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">
                Next Lesson <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex gap-6 overflow-x-auto border-b border-border text-sm">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mb-px whitespace-nowrap border-b-2 pb-2 ${t === tab ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm">
              {tab === "Overview" && <p className="text-muted-foreground">{lesson.summary}</p>}

              {tab === "Notes" && (
                <div className="space-y-2">
                  <textarea
                    value={store.notes[lesson.id] ?? ""}
                    onChange={(e) => setStore((s) => ({ ...s, notes: { ...s.notes, [lesson.id]: e.target.value } }))}
                    placeholder="Write your notes for this lesson…"
                    className="h-40 w-full rounded-md border border-border bg-card p-3 outline-none focus:border-primary"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Notes save automatically.</span>
                    <button
                      className="rounded border border-border px-2 py-1 hover:bg-secondary"
                      onClick={() => {
                        const t = player.current?.currentTime() ?? 0;
                        setStore((s) => ({ ...s, notes: { ...s.notes, [lesson.id]: `${s.notes[lesson.id] ?? ""}${s.notes[lesson.id] ? "\n" : ""}[${fmt(t)}] ` } }));
                      }}
                    >
                      + Add timestamp
                    </button>
                  </div>
                </div>
              )}

              {tab.startsWith("Resources") && (
                <ul className="space-y-2">
                  {lesson.resources.map((r) => (
                    <li key={r.name} className="flex items-center gap-3 rounded-md bg-card p-3">
                      <FileText className="h-5 w-5 text-gold" />
                      <span className="flex-1">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.size}</span>
                      <a href={r.href} download className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-secondary">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {tab === "Transcript" && (
                <ul className="max-h-72 space-y-1 overflow-y-auto">
                  {lesson.transcript.map((l, i) => (
                    <li key={l.t}>
                      <button
                        onClick={() => player.current?.seek(l.t)}
                        className={`flex w-full gap-3 rounded px-2 py-1.5 text-left ${i === activeLine ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}
                      >
                        <span className="w-10 shrink-0 font-semibold text-gold tabular-nums">{fmt(l.t)}</span>
                        <span>{l.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg bg-card p-4">
          <h2 className="font-semibold">Module 4 Lessons</h2>
          <p className="mt-1 text-xs text-muted-foreground">{pct}% complete ({doneCount + PRIOR_DONE} of {TOTAL_IN_MODULE} lessons)</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {lessons.map((l) => {
              const active = l.id === lesson.id;
              const done = store.done.includes(l.id);
              return (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left ${active ? "bg-gold text-gold-foreground" : "hover:bg-secondary"}`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${active ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                      {active ? <PlayCircle className="h-3.5 w-3.5" /> : l.n}
                    </span>
                    <span className="flex-1 leading-tight">{l.title}</span>
                    <span className="text-xs opacity-80">{l.duration}</span>
                    {done && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => markDone()}
            disabled={isDone}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-secondary disabled:text-success"
          >
            <CheckCircle2 className="h-4 w-4" /> {isDone ? "Completed" : "Mark as Complete"}
          </button>
        </aside>
      </div>
    </StudentShell>
  );
}
