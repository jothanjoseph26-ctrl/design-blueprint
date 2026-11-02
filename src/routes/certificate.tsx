import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/apnet/Logo";
import { StudentShell } from "@/components/apnet/StudentShell";

export const Route = createFileRoute("/certificate")({
  head: () => ({
    meta: [
      { title: "Your Certificate — APNET Masterclass" },
      { name: "description", content: "Your APNET Masterclass certificate of completion." },
      { property: "og:title", content: "Your Certificate — APNET" },
      { property: "og:description", content: "Certificate of completion for the APNET Masterclass." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Certificate,
});

function CertificateCard() {
  return (
    <div className="rounded-lg bg-card p-3">
      <div className="relative rounded-md border-2 border-gold px-6 py-10 text-center md:px-12">
        {/* Corner ornaments */}
        {[
          "left-2 top-2 border-l-2 border-t-2",
          "right-2 top-2 border-r-2 border-t-2",
          "bottom-2 left-2 border-b-2 border-l-2",
          "bottom-2 right-2 border-b-2 border-r-2",
        ].map((pos) => (
          <span key={pos} className={`absolute h-6 w-6 border-gold ${pos}`} />
        ))}

        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-6 font-serif text-3xl text-gold">Certificate of Completion</p>
        <p className="mt-8 text-3xl font-semibold">Adéola Oladipo</p>
        <p className="mt-3 text-sm text-muted-foreground">
          has successfully completed the APNET Masterclass
          <span className="block">on Business Planning, Financial Modelling &amp; Valuation.</span>
        </p>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 text-left">
          <div>
            <p className="text-sm font-semibold">31 October 2024</p>
            <p className="text-xs text-muted-foreground">Date of completion</p>
          </div>
          <div className="relative mx-auto">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold to-warning p-1">
              <div className="grid h-full w-full place-items-center rounded-full border border-gold-foreground/40 font-display text-lg text-gold-foreground">
                AP
              </div>
            </div>
            <span className="absolute -bottom-2 left-3 h-4 w-2 -rotate-12 rounded-sm bg-primary" />
            <span className="absolute -bottom-2 left-7 h-4 w-2 rotate-12 rounded-sm bg-primary" />
          </div>
          <div className="text-right">
            <svg viewBox="0 0 120 30" className="ml-auto h-7 w-28 text-gold/80" aria-hidden>
              <path
                d="M4 20 C 20 4, 30 28, 45 14 S 75 6, 88 18 S 108 24, 116 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="mt-1 text-xs text-muted-foreground">Programme Director, APNET</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Certificate() {
  return (
    <StudentShell active="Certificates">
      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold">Your Certificate</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Congratulations! You have successfully completed the APNET Masterclass.
          </p>
          <div className="mt-6">
            <CertificateCard />
          </div>
        </div>

        <aside className="space-y-4">
          <button className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
            Download Certificate
          </button>
          <button className="w-full rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-secondary">
            Verify Certificate
          </button>

          <div className="flex items-start gap-3 rounded-lg bg-card p-4">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
            <div>
              <p className="text-sm font-semibold">Certificate Awarded</p>
              <p className="text-xs text-muted-foreground">Completed all modules on 31 Oct 2024</p>
            </div>
          </div>

          <div className="rounded-lg bg-card p-4">
            <p className="text-sm font-semibold">Share your achievement</p>
            <div className="mt-3 flex gap-3">
              <a
                href="#"
                aria-label="Share on LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-md bg-secondary font-serif text-sm font-bold text-info hover:brightness-110"
              >
                in
              </a>
              <a
                href="#"
                aria-label="Share on X"
                className="grid h-10 w-10 place-items-center rounded-md bg-secondary font-bold hover:brightness-110"
              >
                𝕏
              </a>
            </div>
          </div>
        </aside>
      </div>
    </StudentShell>
  );
}
