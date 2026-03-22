import { Link } from "react-router-dom";
import type { Agent } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/api";

function AgentAvatar({ agent }: { agent: Agent }) {
  if (agent.icon) {
    return (
      <img
        src={agent.icon}
        alt={agent.name}
        className="w-10 h-10 rounded"
        loading="lazy"
      />
    );
  }

  // Generate initials avatar
  const initials = agent.name
    .split("-")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="w-10 h-10 rounded bg-border flex items-center justify-center font-mono text-sm font-bold text-green">
      {initials}
    </div>
  );
}

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      to={`/agent/${agent.author}/${agent.name}`}
      className="group block bg-bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:bg-bg-card-hover hover:border-border-green hover:shadow-glow-green hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <AgentAvatar agent={agent} />
        <div className="flex-1 min-w-0">
          <h3 className="text-text-heading font-semibold truncate group-hover:text-green transition-colors">
            {agent.name}
          </h3>
          <p className="text-xs text-text-faint font-mono mt-0.5">
            {agent.author}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-muted line-clamp-2 leading-relaxed">
        {agent.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs px-2 py-0.5 rounded bg-border text-text-muted">
          {CATEGORY_LABELS[agent.category] ?? agent.category}
        </span>
        <span className="text-xs text-text-faint font-mono">
          v{agent.version}
        </span>
      </div>

      {agent.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {agent.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-border-subtle text-text-faint"
            >
              {tag}
            </span>
          ))}
          {agent.tags.length > 4 && (
            <span className="text-xs text-text-faint">
              +{agent.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
