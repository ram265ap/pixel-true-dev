import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { OPPORTUNITIES, daysLeft } from "@/lib/data";
import { matchInsight, matchScore, useStore } from "@/lib/store";
import { DiffTag, TrackBadge } from "@/components/OppBits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Your Roadmap — MatchEd" },
      { name: "description", content: "Your saved opportunities organised into a deadline-driven career timeline." },
      { property: "og:title", content: "Your Roadmap — MatchEd" },
      { property: "og:description", content: "Your saved opportunities organised into a deadline-driven career timeline." },
    ],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { profile, saved, unsave } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const items = OPPORTUNITIES.filter((o) => saved.includes(o.id)).sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline));
  const groups = [
    { label: "This week", items: items.filter((o) => daysLeft(o.deadline) <= 7) },
    { label: "This month", items: items.filter((o) => daysLeft(o.deadline) > 7 && daysLeft(o.deadline) <= 30) },
    { label: "Later", items: items.filter((o) => daysLeft(o.deadline) > 30) },
  ].filter((g) => g.items.length);

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit space-y-6 rounded-3xl border bg-card p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-accent font-display text-2xl text-accent-foreground">{profile?.name.slice(0, 1).toUpperCase() ?? "?"}</div>
          <div><p className="font-display text-2xl">{profile?.name ?? "Guest"}</p><p className="text-sm text-muted-foreground">{profile?.level}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-muted p-3"><p className="font-display text-3xl">{items.length}</p><p className="text-xs text-muted-foreground">Saved</p></div>
          <div className="rounded-2xl bg-muted p-3"><p className="font-display text-3xl">{items.length ? Math.round(items.reduce((s, o) => s + matchScore(o, profile), 0) / items.length) : 0}%</p><p className="text-xs text-muted-foreground">Avg match</p></div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Tracks</p>
          <div className="flex flex-wrap gap-1.5">{profile?.tracks.map((t) => <TrackBadge key={t} track={t} />)}</div>
        </div>
        {!!profile?.skills.length && (
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Skills</p>
            <div className="flex flex-wrap gap-1.5">{profile.skills.map((s) => <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs">{s}</span>)}</div>
          </div>
        )}
      </aside>

      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Career timeline</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">Your <em>roadmap.</em></h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed p-12 text-center">
            <p className="font-display text-2xl">Nothing saved yet.</p>
            <Link to="/" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Start swiping</Link>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="mb-4 text-sm font-medium">{g.label}</p>
                <ol className="relative space-y-4 border-l pl-8">
                  {g.items.map((o) => {
                    const n = daysLeft(o.deadline);
                    const isOpen = open === o.id;
                    return (
                      <li key={o.id} className="relative">
                        <span className={cn("absolute -left-[39px] top-6 h-3.5 w-3.5 rounded-full border-2 border-background", n <= 7 ? "bg-destructive" : "bg-accent")} />
                        <div className="rounded-2xl border bg-card p-5 transition hover:shadow-lg">
                          <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full items-start justify-between gap-4 text-left">
                            <div>
                              <p className="text-xs text-muted-foreground">{new Date(o.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short" })} · {n}d left · {o.org}</p>
                              <h3 className="mt-1 font-display text-2xl">{o.title}</h3>
                            </div>
                            <ChevronDown size={18} className={cn("mt-2 shrink-0 transition-transform", isOpen && "rotate-180")} />
                          </button>
                          {isOpen && (
                            <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-1">
                              <div className="flex flex-wrap items-center gap-2"><TrackBadge track={o.track} /><DiffTag d={o.difficulty} /><span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">{matchScore(o, profile)}% match</span></div>
                              <p className="text-sm text-muted-foreground">{matchInsight(o, profile)}</p>
                              <button onClick={() => unsave(o.id)} className="inline-flex items-center gap-1.5 text-sm text-destructive"><Trash2 size={14} /> Remove</button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
