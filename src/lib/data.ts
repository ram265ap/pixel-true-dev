export type Track = "AI/ML" | "Finance" | "Design" | "Social Impact";
export type Level = "Secondary" | "University";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  track: Track;
  level: Level | "All";
  difficulty: Difficulty;
  deadline: string; // ISO
  type: string;
  blurb: string;
  skills: string[];
}

const d = (days: number) => new Date(Date.now() + days * 864e5).toISOString();

export const TRACKS: Track[] = ["AI/ML", "Finance", "Design", "Social Impact"];

export const OPPORTUNITIES: Opportunity[] = [
  { id: "o1", title: "Junior ML Research Fellowship", org: "A*STAR Labs", track: "AI/ML", level: "University", difficulty: "Advanced", deadline: d(12), type: "Fellowship", blurb: "Twelve weeks building vision models with working researchers.", skills: ["Python", "PyTorch", "Statistics"] },
  { id: "o2", title: "Young Coders AI Hackathon", org: "GovTech", track: "AI/ML", level: "Secondary", difficulty: "Beginner", deadline: d(5), type: "Hackathon", blurb: "A 48-hour sprint shipping AI tools for local communities.", skills: ["Python", "Teamwork"] },
  { id: "o3", title: "Quant Trading Summer Analyst", org: "Optiver", track: "Finance", level: "University", difficulty: "Advanced", deadline: d(20), type: "Internship", blurb: "Market-making simulations, probability puzzles and live desks.", skills: ["Python", "Statistics", "Excel"] },
  { id: "o4", title: "Student Investment Challenge", org: "SGX Academy", track: "Finance", level: "Secondary", difficulty: "Intermediate", deadline: d(9), type: "Competition", blurb: "Manage a virtual portfolio and pitch your thesis to judges.", skills: ["Excel", "Research"] },
  { id: "o5", title: "Product Design Residency", org: "Grab Design", track: "Design", level: "University", difficulty: "Intermediate", deadline: d(15), type: "Residency", blurb: "Ship a real feature with mentorship from senior designers.", skills: ["UI/UX", "Figma", "Research"] },
  { id: "o6", title: "Poster & Type Open Call", org: "DesignSingapore", track: "Design", level: "All", difficulty: "Beginner", deadline: d(3), type: "Open Call", blurb: "Get your work exhibited at the National Design Centre.", skills: ["Figma", "Illustration"] },
  { id: "o7", title: "Climate Venture Bootcamp", org: "Ground-Up Initiative", track: "Social Impact", level: "All", difficulty: "Intermediate", deadline: d(18), type: "Bootcamp", blurb: "Prototype a climate solution and pitch for seed grants.", skills: ["Research", "Teamwork", "Pitching"] },
  { id: "o8", title: "Youth Volunteer Tech Corps", org: "Code for SG", track: "Social Impact", level: "Secondary", difficulty: "Beginner", deadline: d(25), type: "Volunteer", blurb: "Build websites for local charities alongside mentors.", skills: ["React", "Teamwork"] },
  { id: "o9", title: "LLM Applications Internship", org: "Sea AI Lab", track: "AI/ML", level: "University", difficulty: "Intermediate", deadline: d(30), type: "Internship", blurb: "Prototype retrieval pipelines and evaluation harnesses.", skills: ["Python", "React", "NLP"] },
  { id: "o10", title: "Fintech Design Sprint", org: "DBS", track: "Finance", level: "University", difficulty: "Beginner", deadline: d(7), type: "Sprint", blurb: "Redesign a banking flow for Gen Z in one week.", skills: ["UI/UX", "Research"] },
  { id: "o11", title: "Social Enterprise Fellowship", org: "raiSE", track: "Social Impact", level: "University", difficulty: "Advanced", deadline: d(40), type: "Fellowship", blurb: "Six months embedded in a growing social enterprise.", skills: ["Research", "Pitching", "Excel"] },
  { id: "o12", title: "Creative Coding Workshop", org: "ArtScience Museum", track: "Design", level: "Secondary", difficulty: "Beginner", deadline: d(11), type: "Workshop", blurb: "Generative art with code — no experience needed.", skills: ["React", "Illustration"] },
];

export const ALL_SKILLS = ["Python", "React", "UI/UX", "Figma", "Statistics", "Excel", "Research", "Teamwork", "Pitching", "PyTorch", "NLP", "Illustration"];

export function daysLeft(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5));
}
