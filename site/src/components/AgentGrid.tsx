import type { Agent } from "@/lib/api";
import AgentCard from "./AgentCard";

interface AgentGridProps {
  agents: Agent[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function AgentGrid({
  agents,
  loading,
  emptyMessage = "No agents found",
}: AgentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-bg-card border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-border" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-border rounded" />
                <div className="h-3 w-16 bg-border-subtle rounded mt-2" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full bg-border-subtle rounded" />
              <div className="h-3 w-3/4 bg-border-subtle rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {agents.map((agent) => (
        <AgentCard key={`${agent.author}/${agent.name}`} agent={agent} />
      ))}
    </div>
  );
}
