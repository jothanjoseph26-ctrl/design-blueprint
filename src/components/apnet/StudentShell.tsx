import { Link } from "@tanstack/react-router";
import {
  Bell, ChevronDown, User, Settings, HelpCircle,
  LayoutDashboard, BookOpen, Layers, ClipboardList, Award, FolderOpen, Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Logo } from "@/components/apnet/Logo";

type NavItem = { icon: LucideIcon; label: string; to?: string; badge?: number };

export const studentNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: BookOpen, label: "My Masterclass", to: "/lesson" },
  { icon: Layers, label: "Modules", to: "/module" },
  { icon: ClipboardList, label: "Assessments", to: "/assessment" },
  { icon: Award, label: "Certificates", to: "/certificate" },
  { icon: FolderOpen, label: "Resources" },
  { icon: Mail, label: "Messages", badge: 2 },
];

const bottomNav: [ComponentType<{ className?: string }>, string][] = [
  [User, "Profile"],
  [Settings, "Settings"],
  [HelpCircle, "Help & Support"],
];

export function StudentShell({
  active,
  topbar,
  children,
}: {
  active: string;
  topbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 flex-col border-r border-border bg-card p-4 md:flex">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1 text-sm">
          {studentNav.map(({ icon: I, label, to, badge }) => {
            const isActive = label === active;
            const className = `flex items-center gap-3 rounded-md px-3 py-2.5 ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`;
            const inner = (
              <>
                <I className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {badge}
                  </span>
                )}
              </>
            );
            return to ? (
              <Link key={label} to={to} className={className}>{inner}</Link>
            ) : (
              <a key={label} href="#" className={className}>{inner}</a>
            );
          })}
        </nav>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {bottomNav.map(([I, label]) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-secondary hover:text-foreground"
            >
              <I className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {topbar ? <div className="border-b border-border px-6 py-3">{topbar}</div> : null}
        {children}
      </main>
    </div>
  );
}

export function StudentUserMenu() {
  return (
    <div className="flex items-center justify-end gap-5">
      <Bell className="h-5 w-5" />
      <button className="flex items-center gap-2 text-sm">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-paper text-xs font-bold text-paper-foreground">
          AO
        </span>
        Adeola Oladipo <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
