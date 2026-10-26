import { Link } from "@tanstack/react-router";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display text-xl text-primary-foreground">
        AP
      </span>
      <span className="leading-none">
        <span className={`block font-display text-2xl tracking-wide ${dark ? "text-paper-foreground" : "text-foreground"}`}>
          APNET
        </span>
        <span className={`block text-[8px] tracking-[0.35em] ${dark ? "text-paper-foreground/70" : "text-muted-foreground"}`}>
          MASTERCLASS
        </span>
      </span>
    </Link>
  );
}
