import { Clock } from "lucide-react";
import { daysLeft, type Opportunity, type Track } from "@/lib/data";
import { cn } from "@/lib/utils";

const trackCls: Record<Track, string> = {
  "AI/ML": "bg-track-ai",
  Finance: "bg-track-fin",
  Design: "bg-track-design",
  "Social Impact": "bg-track-social",
};

export function TrackBadge({ track }: { track: Track }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs">
      <span className={cn("h-1.5 w-1.5 rounded-full", trackCls[track])} />
      {track}
    </span>
  );
}

export function Deadline({ o }: { o: Opportunity }) {
  const n = daysLeft(o.deadline);
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", n <= 5 ? "text-destructive" : "text-muted-foreground")}>
      <Clock size={12} /> {n}d left
    </span>
  );
}

export function DiffTag({ d }: { d: Opportunity["difficulty"] }) {
  return <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{d}</span>;
}
