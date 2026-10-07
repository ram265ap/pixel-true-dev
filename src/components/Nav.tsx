import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useStore } from "@/lib/store";

const tabs = [
  { to: "/", label: "Discover" },
  { to: "/catalog", label: "Catalog" },
  { to: "/roadmap", label: "Roadmap" },
] as const;

export function Nav() {
  const { profile, dark, toggleDark, saved, setProfile } = useStore();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-glass backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="font-display text-2xl tracking-tight">
          Match<span className="italic">Ed</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border bg-card p-1 text-sm">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:px-4"
              activeProps={{ className: "bg-primary !text-primary-foreground" }}
            >
              {t.label}
              {t.to === "/roadmap" && saved.length > 0 && (
                <span className="ml-1.5 text-xs opacity-70">{saved.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-full border bg-card transition hover:scale-105">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {profile && (
            <button
              onClick={() => confirm("Restart onboarding?") && setProfile(null)}
              title="Restart onboarding"
              className="hidden items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm sm:flex"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {profile.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="text-muted-foreground">{profile.level}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
