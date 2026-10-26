import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, CheckCircle2, PlayCircle, Building2, Network, BarChart3, Landmark, Scale,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Logo } from "@/components/apnet/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APNET Masterclass — Financial Modelling & Valuation" },
      { name: "description", content: "A practical, hands-on training programme to build real-world finance skills using Excel." },
      { property: "og:title", content: "APNET Masterclass — Financial Modelling & Valuation" },
      { property: "og:description", content: "Master business planning, financial modelling and valuation in Excel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  "15 Structured Modules", "Excel Templates & Workbooks",
  "Real-World Case Studies", "Practical Assessments",
  "20+ Hours of Video Lessons", "Certificate on Completion",
];
const topics = [
  { icon: Building2, label: "Business Planning" },
  { icon: Network, label: "Financial Modelling" },
  { icon: BarChart3, label: "Investment Analysis" },
  { icon: Landmark, label: "Corporate Accounting" },
  { icon: Scale, label: "Nigerian Tax Compliance" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="relative z-20 border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden gap-8 text-sm md:flex">
            {["Home", "Programme", "Curriculum", "Instructors", "FAQs"].map((n, i) => (
              <a key={n} href="#" className={i === 0 ? "border-b-2 border-foreground pb-1 font-semibold" : "text-muted-foreground hover:text-foreground"}>{n}</a>
            ))}
          </nav>
          <div className="flex gap-3">
            <Link to="/dashboard" className="rounded-md border border-border px-5 py-2 text-sm hover:bg-secondary">Login</Link>
            <Link to="/dashboard" className="rounded-md bg-gold px-5 py-2 text-sm font-semibold text-gold-foreground hover:brightness-110">Enrol Now</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={hero} alt="APNET instructor" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold tracking-[0.25em] text-foreground/90">APNET MASTERCLASS</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight md:text-6xl">
            Master Business Planning,
            <span className="block text-gold">Financial Modelling &amp; Valuation</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-foreground/85">
            A practical, hands-on training programme to build real-world finance skills using Excel.
          </p>
          <ul className="mt-6 grid max-w-xl grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-gold" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-gold px-8 py-3 font-semibold text-gold-foreground hover:brightness-110">
              Enrol Now <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center gap-2 rounded-md border border-foreground/70 px-6 py-3 font-medium hover:bg-foreground/10">
              <PlayCircle className="h-5 w-5" /> Watch Programme Trailer
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-6 md:grid-cols-5">
          {topics.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm font-medium">
              <Icon className="h-7 w-7 text-foreground/80" /> {label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
