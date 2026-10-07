import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, Check, ChevronDown, Compass, GraduationCap, MapPin, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPPORTUNITIES, TRACKS, type Track } from "@/lib/data";
import { useStore } from "@/lib/store";
import { TrackBadge, Deadline } from "@/components/OppBits";
import campus from "@/assets/campus-students.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MatchEd — Your next opportunity starts here" },
    { name: "description", content: "Find your next chapter with MatchEd. Explore student internships, competitions and fellowships in Singapore, discover your fit and build your opportunity roadmap." },
    { property: "og:title", content: "MatchEd — Your next opportunity starts here" },
    { property: "og:description", content: "Student opportunities. Personal matches. A path that's yours. Discover MatchEd for Singapore students." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const questions = [
  { q: "Who is MatchEd for?", a: "MatchEd is for secondary school and university students exploring their interests, building experience, or looking for their next challenge in Singapore." },
  { q: "How are my matches calculated?", a: "Match scores compare your chosen career tracks, education level and skills with each opportunity. They are a guide to your fit, not a guarantee of acceptance." },
  { q: "Are these opportunities live?", a: "The current catalog contains 12 sample listings to help you explore MatchEd. Organisation names are illustrative, not partner endorsements, and the listings are not verified open applications." },
  { q: "Do I need a CV to get started?", a: "No. You can start with your interests and education level. The current CV step is a demo that suggests skills from your chosen tracks; it does not read your uploaded file." },
];

function Landing() {
  const [track, setTrack] = useState<Track | "All">("All");
  const [open, setOpen] = useState<number | null>(null);
  const { saved, save, unsave } = useStore();
  const featured = OPPORTUNITIES.filter(o => track === "All" ? ["o2", "o5", "o7"].includes(o.id) : o.track === track).slice(0, 3);

  return <div className="landing">
    <section className="landing-hero">
      <img src={campus} width={1920} height={1024} fetchPriority="high" alt="Students walking together on a bright Singapore-style university campus" className="hero-photo" />
      <div className="hero-wash" />
      <div className="hero-content page-width">
        <p className="hero-eyebrow"><span className="h-2 w-2 rounded-full bg-primary" /> Big possibilities. Right here in Singapore.</p>
        <h1>MatchEd<span className="text-primary">.</span></h1>
        <h2>Your next chapter.<br /><span className="text-primary">Not just your next application.</span></h2>
        <p className="hero-description">Find opportunities that feel like <strong>you</strong>. From your first hackathon to your dream internship, discover where your interests can take you.</p>
        <div className="hero-actions">
          <Button asChild size="lg"><Link to="/discover">Find my match <ArrowUpRight /></Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/catalog">Explore opportunities <ArrowRight /></Link></Button>
        </div>
        <div className="hero-notes"><span><Check size={14} /> For secondary & university students</span><span><Check size={14} /> Your interests. Your pace.</span></div>
      </div>
      <div className="hero-caption"><MapPin size={14} /><span>A world of possibility, closer than you think.</span></div>
    </section>

    <div className="category-strip" aria-label="Opportunity types"><div className="page-width"><span>YOUR NEXT COULD BE</span>{["An internship", "A hackathon", "A fellowship", "A competition", "A new direction"].map(t => <p key={t}><Sparkles size={16} />{t}</p>)}</div></div>

    <section className="page-width opportunity-section">
      <div className="section-heading"><div><p className="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</p><h2>Something here could<br />change <span className="text-primary">everything.</span></h2></div><Button asChild variant="link"><Link to="/catalog">View the full catalog <ArrowUpRight /></Link></Button></div>
      <div className="flex flex-wrap gap-2 mb-7" aria-label="Filter opportunities">{(["All", ...TRACKS] as const).map(t => <Button key={t} variant={t === track ? "default" : "outline"} size="sm" onClick={() => setTrack(t)} aria-pressed={track === t}>{t === "All" ? "All interests" : t}</Button>)}</div>
      <div className="grid gap-5 md:grid-cols-3">{featured.map(o => <article key={o.id} className="opportunity-card">
        <div className="flex items-center justify-between"><TrackBadge track={o.track} /><Button variant="ghost" size="icon" aria-label={saved.includes(o.id) ? `Unsave ${o.title}` : `Save ${o.title}`} title={saved.includes(o.id) ? "Remove from roadmap" : "Save to roadmap"} onClick={() => saved.includes(o.id) ? unsave(o.id) : save(o.id)}>{saved.includes(o.id) ? <BookmarkCheck /> : <Bookmark />}</Button></div>
        <p className="mt-6 text-xs text-muted-foreground">{o.org} <span className="mx-1">·</span> {o.type}</p><h3>{o.title}</h3><p className="card-blurb">{o.blurb}</p>
        <div className="mt-5 flex flex-wrap gap-2">{o.skills.map(s => <span key={s} className="bg-secondary px-2 py-1 text-xs rounded">{s}</span>)}</div>
        <div className="mt-auto pt-6"><div className="flex items-center justify-between border-t pt-4"><Deadline o={o} /><Button asChild variant="link" className="h-auto p-0 text-xs"><Link to="/catalog">Explore <ArrowUpRight /></Link></Button></div></div>
      </article>)}</div>
      <p className="mt-4 text-xs text-muted-foreground">A taste of what's possible · Sample listings, not verified open applications.</p>
    </section>

    <section className="journey-section"><div className="page-width">
      <div className="section-heading"><div><p className="eyebrow">LESS GUESSWORK. MORE YOU.</p><h2>From “what if”<br />to <span className="text-primary">what's next.</span></h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground">You don't need your whole future figured out.<br />Just a little curiosity, and a place to start.</p></div>
      <div className="journey-grid">{[
        { n: "01", icon: Compass, title: "Start with what excites you.", text: "Tech, design, finance, making a difference. Your interests are a better starting point than someone else's checklist.", action: "Discover your direction", to: "/discover" as const },
        { n: "02", icon: Target, title: "Find your kind of opportunity.", text: "Look beyond the title. See how your skills and interests line up with an opportunity worth exploring.", action: "Find your fit", to: "/catalog" as const },
        { n: "03", icon: GraduationCap, title: "Make your next move.", text: "Save what speaks to you and bring your deadlines together. Build a roadmap, one possibility at a time.", action: "See your roadmap", to: "/roadmap" as const },
      ].map(step => <div key={step.n} className="journey-step"><div className="flex items-center justify-between"><step.icon size={27} className="text-primary" /><span className="text-sm text-muted-foreground">{step.n}</span></div><h3>{step.title}</h3><p>{step.text}</p><Button asChild variant="link" className="px-0 mt-5"><Link to={step.to}>{step.action}<ArrowUpRight /></Link></Button></div>)}</div>
    </div></section>

    <section className="page-width faq-section"><div><p className="eyebrow">GOOD QUESTIONS</p><h2>A little clarity.<br />A lot of possibility.</h2></div><div>{questions.map((item, i) => <div key={item.q} className="border-b"><Button variant="ghost" aria-expanded={open === i} aria-controls={`answer-${i}`} onClick={() => setOpen(open === i ? null : i)} className="faq-question"><span>{item.q}</span><ChevronDown className={open === i ? "rotate-180" : ""} /></Button>{open === i && <p id={`answer-${i}`} className="pb-6 text-sm leading-7 text-muted-foreground">{item.a}</p>}</div>)}</div></section>

    <section className="closing-section"><div className="page-width"><p className="eyebrow">THE FUTURE ISN'T ONE-SIZE-FITS-ALL</p><h2>Find the next<br />thing that's <span className="closing-emphasis">your thing.</span></h2><p>You bring the curiosity. We'll bring the possibilities.</p><Button asChild size="lg" variant="secondary"><Link to="/discover">Let's find my match <ArrowUpRight /></Link></Button></div></section>
    <footer className="page-width landing-footer"><Link to="/" className="font-display font-bold text-2xl">MatchEd<span className="text-primary">.</span></Link><p>Made for the possibilities ahead.</p><div className="flex gap-6"><Link to="/discover">Discover</Link><Link to="/catalog">Catalog</Link><Link to="/roadmap">Roadmap</Link></div><span className="footer-note">Singapore · Student opportunity discovery</span></footer>
  </div>;
}
