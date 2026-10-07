import { useRef, useState } from "react";
import { ArrowRight, Check, FileText, GraduationCap, School, Upload } from "lucide-react";
import { TRACKS, type Level, type Track } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const EXTRACT: Record<Track, string[]> = {
  "AI/ML": ["Python", "PyTorch", "Statistics"],
  Finance: ["Excel", "Statistics", "Research"],
  Design: ["UI/UX", "Figma", "Illustration"],
  "Social Impact": ["Research", "Pitching", "Teamwork"],
};

export function Onboarding() {
  const { setProfile } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>("University");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const parse = (f: File) => {
    setFile(f.name);
    setProgress(0);
    setSkills([]);
    const pool = Array.from(new Set(["React", ...tracks.flatMap((t) => EXTRACT[t]), "Python", "UI/UX"]));
    let p = 0;
    const iv = setInterval(() => {
      p += 4;
      setProgress(p);
      setSkills(pool.slice(0, Math.floor((p / 100) * pool.length)));
      if (p >= 100) {
        clearInterval(iv);
        setSkills(pool);
      }
    }, 70);
  };

  const done = progress >= 100;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border bg-card p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>

        {step === 0 ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome to MatchEd</p>
              <h2 className="mt-2 font-display text-4xl leading-tight">Opportunities, curated to <em>you</em>.</h2>
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
            <div className="grid grid-cols-2 gap-3">
              {([["Secondary", School, "Secondary School"], ["University", GraduationCap, "University"]] as const).map(([v, Icon, label]) => (
                <button key={v} onClick={() => setLevel(v)} className={cn("flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition", level === v ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground/40")}>
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Career tracks</p>
              <div className="flex flex-wrap gap-2">
                {TRACKS.map((t) => {
                  const on = tracks.includes(t);
                  return (
                    <button key={t} onClick={() => setTracks(on ? tracks.filter((x) => x !== t) : [...tracks, t])} className={cn("rounded-full border px-4 py-2 text-sm transition", on ? "border-accent bg-accent text-accent-foreground" : "hover:border-foreground/40")}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <button disabled={!name || !tracks.length} onClick={() => setStep(1)} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-medium text-primary-foreground transition disabled:opacity-30">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 2 · CV parser</p>
              <h2 className="mt-2 font-display text-4xl leading-tight">Drop your résumé.</h2>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) parse(f); }}
              onClick={() => input.current?.click()}
              className={cn("cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition", drag ? "border-accent bg-accent/10" : "hover:border-foreground/40")}
            >
              <input ref={input} type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={(e) => e.target.files?.[0] && parse(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm"><FileText size={18} /> {file}</div>
              ) : (
                <div className="space-y-2 text-sm text-muted-foreground"><Upload className="mx-auto" size={22} /><p>Drag & drop or click to upload (PDF, DOCX)</p></div>
              )}
              {file && (
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
            {skills.length > 0 && (
              <div>
                <p className="mb-2 text-sm text-muted-foreground">{done ? "Extracted skills" : "Analysing document…"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((s) => (
                    <div key={s} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm animate-in fade-in slide-in-from-left-2">
                      <Check size={14} className="text-track-fin" /> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setProfile({ name, level, tracks, skills: [] })} className="rounded-full border px-5 py-3 text-sm">Skip</button>
              <button disabled={!done} onClick={() => setProfile({ name, level, tracks, skills })} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 font-medium text-primary-foreground disabled:opacity-30">
                Start matching <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
