import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Search } from "lucide-react";
import { OPPORTUNITIES, TRACKS, daysLeft, type Track } from "@/lib/data";
import { matchScore, useStore } from "@/lib/store";
import { Deadline, DiffTag, TrackBadge } from "@/components/OppBits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalog — MatchEd" },
      { name: "description", content: "Search and filter every student opportunity in one curated catalog." },
      { property: "og:title", content: "Catalog — MatchEd" },
      { property: "og:description", content: "Search and filter every student opportunity in one curated catalog." },
    ],
  }),
  component: Catalog,
});

type Sort = "match" | "deadline" | "Secondary" | "University";

function Catalog() {
  const { profile, saved, save, unsave } = useStore();
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<Track | "All">("All");
  const [sort, setSort] = useState<Sort>("match");

  const list = useMemo(() => {
    let l = OPPORTUNITIES.filter((o) => (track === "All" || o.track === track) && `${o.title} ${o.org} ${o.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase()));
    if (sort === "Secondary" || sort === "University") l = l.filter((o) => o.level === sort || o.level === "All");
    return [...l].sort((a, b) => (sort === "deadline" ? daysLeft(a.deadline) - daysLeft(b.deadline) : matchScore(b, profile) - matchScore(a, profile)));
  }, [q, track, sort, profile]);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catalog · {list.length} results</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Every opportunity, <em>indexed.</em></h1>

      <div className="sticky top-16 z-30 -mx-5 mt-8 space-y-3 bg-background/80 px-5 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-full border bg-card px-4">
            <Search size={16} className="text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles, orgs, skills…" className="w-full bg-transparent py-3 outline-none" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border bg-card px-4 py-3 text-sm">
            <option value="match">Best match</option>
            <option value="deadline">Closing soon</option>
            <option value="Secondary">Secondary only</option>
            <option value="University">University only</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...TRACKS] as const).map((t) => (
            <button key={t} onClick={() => setTrack(t)} className={cn("rounded-full border px-4 py-1.5 text-sm transition", track === t ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground/40")}>{t}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {list.map((o) => {
          const isSaved = saved.includes(o.id);
          return (
            <article key={o.id} className="group flex flex-col justify-between gap-6 bg-card p-6 transition-colors hover:bg-muted/50 animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <TrackBadge track={o.track} />
                  <button onClick={() => (isSaved ? unsave(o.id) : save(o.id))} aria-label="Save" className="text-muted-foreground transition hover:text-foreground">
                    {isSaved ? <BookmarkCheck size={18} className="text-foreground" /> : <Bookmark size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{o.org} · {o.type}</p>
                <h3 className="font-display text-2xl leading-tight">{o.title}</h3>
                <p className="text-sm text-muted-foreground">{o.blurb}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><DiffTag d={o.difficulty} /><Deadline o={o} /></div>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{matchScore(o, profile)}%</span>
              </div>
            </article>
          );
        })}
        {list.length === 0 && <div className="col-span-full bg-card p-12 text-center text-muted-foreground">Nothing matches that search.</div>}
      </div>
    </div>
  );
}
