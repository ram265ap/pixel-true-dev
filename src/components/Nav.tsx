import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/discover", label: "Discover" },
  { to: "/catalog", label: "Catalog" },
  { to: "/roadmap", label: "Roadmap" },
] as const;

export function Nav() {
  const { profile, dark, toggleDark, saved, setProfile } = useStore();
  const home = useRouterState({ select: s => s.location.pathname === "/" });
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-glass backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5">
        <Link to="/" className="font-display text-xl font-bold sm:text-2xl">
          MatchEd<span className="text-primary">.</span>
        </Link>
        <nav className="flex items-center gap-1 text-xs sm:text-sm">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:text-foreground sm:px-4"
              activeProps={{ className: "bg-secondary !text-primary" }}
            >
              {t.label}
              {t.to === "/roadmap" && saved.length > 0 && (
                <span className="ml-1.5 text-xs opacity-70">{saved.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme" title="Toggle theme" className="hidden sm:inline-flex">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          {home ? <Button asChild className="hidden sm:inline-flex"><Link to="/discover">Get started</Link></Button> : profile && (
            <Button variant="outline"
              onClick={() => confirm("Restart onboarding?") && setProfile(null)}
              title="Restart onboarding"
              className="hidden items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm sm:flex"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {profile.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="text-muted-foreground">{profile.level}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
