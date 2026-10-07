import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Heart, RotateCcw, Sparkles, X } from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/lib/data";
import { matchInsight, matchScore, useStore } from "@/lib/store";
import { Deadline, DiffTag, TrackBadge } from "@/components/OppBits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — MatchEd" },
      { name: "description", content: "Swipe through student opportunities and get instant AI match scores." },
      { property: "og:title", content: "Discover — MatchEd" },
      { property: "og:description", content: "Discover student opportunities with personalised skill-based match scores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { profile, saved, passed, save, pass, resetDeck } = useStore();
  const deck = OPPORTUNITIES.filter((o) => !saved.includes(o.id) && !passed.includes(o.id));
  const [match, setMatch] = useState<Opportunity | null>(null);
  const [fly, setFly] = useState<"l" | "r" | null>(null);

  const act = (dir: "l" | "r") => {
    const top = deck[0];
    if (!top || fly) return;
    setFly(dir);
    setTimeout(() => {
      setFly(null);
      if (dir === "r") { save(top.id); setMatch(top); } else pass(top.id);
    }, 280);
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hot or not · {deck.length} left</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-7xl">
          {profile ? <>Hey {profile.name},<br /></> : null}
          find your <em>next</em> big thing.
        </h1>
        <p className="mt-5 max-w-md text-muted-foreground">Swipe right to save and get an instant AI match evaluation. Swipe left to pass. Use ← → keys or the buttons.</p>
      </div>

      <div className="relative mx-auto h-[520px] w-full max-w-[400px]" tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowRight") act("r"); if (e.key === "ArrowLeft") act("l"); }}>
        {deck.length === 0 ? (
          <div className="grid h-full place-items-center rounded-3xl border border-dashed text-center">
            <div>
              <p className="font-display text-3xl">All caught up.</p>
              <button onClick={resetDeck} className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"><RotateCcw size={14} /> Revisit passed</button>
            </div>
          </div>
        ) : (
          deck.slice(0, 3).reverse().map((o, i, arr) => {
            const depth = arr.length - 1 - i;
            return <SwipeCard key={o.id} o={o} depth={depth} fly={depth === 0 ? fly : null} onSwipe={act} />;
          })
        )}
        {deck.length > 0 && (
          <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-5">
            <button onClick={() => act("l")} aria-label="Pass" className="grid h-14 w-14 place-items-center rounded-full border bg-card shadow-lg transition hover:scale-110"><X /></button>
            <button onClick={() => act("r")} aria-label="Save" className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg transition hover:scale-110"><Heart /></button>
          </div>
        )}
      </div>

      {match && <MatchPopup o={match} onClose={() => setMatch(null)} />}
    </div>
  );
}

function SwipeCard({ o, depth, fly, onSwipe }: { o: Opportunity; depth: number; fly: "l" | "r" | null; onSwipe: (d: "l" | "r") => void }) {
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);
  const x = fly === "r" ? 600 : fly === "l" ? -600 : dx;
  const active = depth === 0;

  return (
    <div
      onPointerDown={(e) => { if (!active) return; start.current = e.clientX; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => start.current !== null && setDx(e.clientX - start.current)}
      onPointerUp={() => { start.current = null; if (dx > 110) onSwipe("r"); else if (dx < -110) onSwipe("l"); setDx(0); }}
      className={cn("absolute inset-0 flex select-none flex-col justify-between rounded-3xl border bg-card p-7 shadow-xl touch-none", active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none", start.current === null && "transition-transform duration-300")}
      style={{ transform: `translate(${x}px, ${depth * 14}px) rotate(${x / 18}deg) scale(${1 - depth * 0.05})`, opacity: fly ? 0 : 1 - depth * 0.25, zIndex: 10 - depth }}
    >
      {active && dx !== 0 && (
        <div className={cn("absolute right-6 top-6 rounded-full px-3 py-1 text-sm font-semibold", dx > 0 ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground")} style={{ opacity: Math.min(1, Math.abs(dx) / 100) }}>
          {dx > 0 ? "SAVE" : "PASS"}
        </div>
      )}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2"><TrackBadge track={o.track} /><DiffTag d={o.difficulty} /></div>
        <p className="text-sm text-muted-foreground">{o.org} · {o.type}</p>
        <h3 className="font-display text-4xl leading-tight">{o.title}</h3>
        <p className="text-muted-foreground">{o.blurb}</p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">{o.skills.map((s) => <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs">{s}</span>)}</div>
        <div className="flex items-center justify-between border-t pt-4"><Deadline o={o} /><span className="text-xs text-muted-foreground">{o.level === "All" ? "All levels" : o.level}</span></div>
      </div>
    </div>
  );
}

function MatchPopup({ o, onClose }: { o: Opportunity; onClose: () => void }) {
  const { profile } = useStore();
  const score = matchScore(o, profile);
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-background/60 p-4 backdrop-blur-md animate-in fade-in">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-2xl animate-in zoom-in-90 duration-300">
        <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground"><Sparkles size={14} /> AI evaluation</p>
        <div className="glow mx-auto my-6 grid h-36 w-36 place-items-center rounded-full bg-accent text-accent-foreground animate-in zoom-in-50 duration-700">
          <div><div className="font-display text-5xl">{score}%</div><div className="text-xs font-medium uppercase tracking-wider">Match</div></div>
        </div>
        <h3 className="font-display text-2xl">{o.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{matchInsight(o, profile)}</p>
        <button onClick={onClose} className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground">Keep swiping</button>
      </div>
    </div>
  );
}
