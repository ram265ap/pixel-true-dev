import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Level, Opportunity, Track } from "./data";

export interface Profile {
  name: string;
  level: Level;
  tracks: Track[];
  skills: string[];
}

interface Store {
  ready: boolean;
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  saved: string[];
  passed: string[];
  save: (id: string) => void;
  unsave: (id: string) => void;
  pass: (id: string) => void;
  resetDeck: () => void;
  dark: boolean;
  toggleDark: () => void;
}

const Ctx = createContext<Store | null>(null);

function load<T>(k: string, f: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : f;
  } catch {
    return f;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setProfile(load("matched.profile", null));
    setSaved(load("matched.saved", []));
    setPassed(load("matched.passed", []));
    setDark(load("matched.dark", false));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("matched.profile", JSON.stringify(profile));
    localStorage.setItem("matched.saved", JSON.stringify(saved));
    localStorage.setItem("matched.passed", JSON.stringify(passed));
    localStorage.setItem("matched.dark", JSON.stringify(dark));
    document.documentElement.classList.toggle("dark", dark);
  }, [ready, profile, saved, passed, dark]);

  return (
    <Ctx.Provider
      value={{
        ready,
        profile,
        setProfile,
        saved,
        passed,
        save: (id) => setSaved((s) => (s.includes(id) ? s : [...s, id])),
        unsave: (id) => setSaved((s) => s.filter((x) => x !== id)),
        pass: (id) => setPassed((s) => [...s, id]),
        resetDeck: () => setPassed([]),
        dark,
        toggleDark: () => setDark((v) => !v),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}

export function matchScore(o: Opportunity, p: Profile | null) {
  if (!p) return 70;
  let s = 58;
  if (p.tracks.includes(o.track)) s += 18;
  if (o.level === "All" || o.level === p.level) s += 8;
  const overlap = o.skills.filter((k) => p.skills.includes(k)).length;
  s += Math.round((overlap / o.skills.length) * 16);
  return Math.min(99, s);
}

export function matchInsight(o: Opportunity, p: Profile | null) {
  const overlap = p ? o.skills.filter((k) => p.skills.includes(k)) : [];
  const first = overlap.length
    ? `Your hands-on experience with ${overlap.join(" and ")} maps directly onto what ${o.org} looks for in this ${o.type.toLowerCase()}.`
    : `This ${o.type.toLowerCase()} is a strong stretch opportunity that would broaden your profile beyond your current toolkit.`;
  const second = p?.tracks.includes(o.track)
    ? `It also sits squarely in your ${o.track} track, so it compounds the story you're already building.`
    : `It adds a ${o.track} angle that makes your applications stand out from single-track candidates.`;
  return `${first} ${second}`;
}
