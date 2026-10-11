import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Code2, Heart, Palette, TrendingUp } from "lucide-react";
import { OPPORTUNITIES } from "@/lib/data";

const icons = { "AI/ML": Code2, Finance: TrendingUp, Design: Palette, "Social Impact": Heart };
const opportunities = OPPORTUNITIES.slice(0, 6);

export function OpportunityFlow() {
  return <div className="opportunity-flow" aria-label="Explore sample student opportunities">
    <div className="flow-track">
      {[0, 1].map(copy => <div key={copy} className="flow-group" aria-hidden={copy === 1 ? true : undefined}>
        {opportunities.map(o => {
          const Icon = icons[o.track];
          return <Link key={o.id} to="/catalog" tabIndex={copy === 1 ? -1 : 0} className="flow-item">
            <span className="flow-icon"><Icon size={21} strokeWidth={1.6} /></span>
            <span className="flow-copy"><span>{o.track} <span aria-hidden="true">/</span> {o.type}</span><strong>{o.title}</strong></span>
            <ArrowUpRight size={17} className="flow-arrow" />
          </Link>;
        })}
      </div>)}
    </div>
  </div>;
}