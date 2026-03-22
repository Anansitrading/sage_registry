import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ExternalLink,
  Tag,
  GitBranch,
  Shield,
  Cpu,
} from "lucide-react";
import { useAgents } from "@/hooks/useAgents";
import { fetchReadme, CATEGORY_LABELS } from "@/lib/api";
import InstallCommand from "@/components/InstallCommand";

export default function AgentPage() {
  const { author, name } = useParams<{ author: string; name: string }>();
  const { agents, loading: agentsLoading } = useAgents();
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(true);

  const agent = useMemo(
    () => agents.find((a) => a.author === author && a.name === name),
    [agents, author, name]
  );

  useEffect(() => {
    if (!agent) return;
    setReadmeLoading(true);
    fetchReadme(agent.readme)
      .then(setReadme)
      .catch(() => setReadme(null))
      .finally(() => setReadmeLoading(false));
  }, [agent]);

  if (agentsLoading) {
    return (
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-container mx-auto animate-pulse">
          <div className="h-6 w-32 bg-border rounded" />
          <div className="mt-8 h-10 w-64 bg-border rounded" />
          <div className="mt-4 h-4 w-96 bg-border-subtle rounded" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-container mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-text-heading">
            Agent not found
          </h1>
          <p className="mt-2 text-text-muted">
            No agent found for {author}/{name}
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 mt-6 text-green hover:underline"
          >
            <ArrowLeft size={16} /> Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const repoPath = agent.path
    ? `${agent.repository}/tree/main/${agent.path}`
    : agent.repository;

  const cloneCmd = agent.path
    ? `git clone ${agent.repository} && cd ${agent.repository.split("/").pop()}/${agent.path}`
    : `git clone ${agent.repository}`;

  const installTabs = [
    { label: "git clone", command: cloneCmd },
    {
      label: "gitagent run",
      command: `gitagent run -r ${agent.repository}${agent.path ? ` -p ${agent.path}` : ""}`,
    },
  ];

  // Generate initials avatar
  const initials = agent.name
    .split("-")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-container mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-green transition-colors"
        >
          <ArrowLeft size={14} /> Back to browse
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              {agent.icon ? (
                <img
                  src={agent.icon}
                  alt={agent.name}
                  className="w-16 h-16 rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-border flex items-center justify-center font-mono text-xl font-bold text-green">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-text-heading">
                  {agent.name}
                </h1>
                <p className="text-text-muted font-mono text-sm mt-1">
                  by {agent.author}
                </p>
              </div>
            </div>

            <p className="mt-4 text-text leading-relaxed">
              {agent.description}
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green/10 text-green border border-border-green">
                <Tag size={12} />
                {CATEGORY_LABELS[agent.category] ?? agent.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-border text-text-muted">
                <GitBranch size={12} />
                v{agent.version}
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-border text-text-muted">
                <Shield size={12} />
                {agent.license}
              </span>
            </div>

            {/* Install */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text-heading mb-3">
                Install
              </h2>
              <InstallCommand tabs={installTabs} />
            </div>

            {/* README */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-text-heading mb-4">
                Documentation
              </h2>
              {readmeLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-3/4 bg-border-subtle rounded" />
                  <div className="h-4 w-full bg-border-subtle rounded" />
                  <div className="h-4 w-2/3 bg-border-subtle rounded" />
                </div>
              ) : readme ? (
                <article className="prose prose-invert max-w-none prose-headings:text-text-heading prose-p:text-text prose-a:text-green hover:prose-a:underline prose-code:text-amber prose-code:bg-bg-terminal prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-bg-terminal prose-pre:border prose-pre:border-border prose-strong:text-text-heading prose-li:text-text prose-ul:text-text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {readme}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-text-muted text-sm">
                  No documentation available.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:w-72 flex-shrink-0">
            <div className="bg-bg-card border border-border rounded-lg p-5 space-y-5 md:sticky md:top-24">
              {/* Model */}
              <div>
                <h3 className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-2">
                  Model
                </h3>
                <div className="flex items-center gap-2 text-sm text-text">
                  <Cpu size={14} className="text-text-muted" />
                  <span className="font-mono text-xs">{agent.model}</span>
                </div>
              </div>

              {/* Adapters */}
              <div>
                <h3 className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-2">
                  Adapters
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {agent.adapters.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-0.5 rounded bg-border text-text-muted"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/browse?q=${encodeURIComponent(tag)}`}
                      className="text-xs px-2 py-0.5 rounded bg-border-subtle text-text-faint hover:text-green transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Added */}
              <div>
                <h3 className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-2">
                  Added
                </h3>
                <span className="text-sm text-text-muted">
                  {agent.added_at}
                </span>
              </div>

              {/* GitHub link */}
              <a
                href={repoPath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-border text-text-heading text-sm font-medium rounded-lg hover:bg-bg-card-hover transition-colors"
              >
                <ExternalLink size={14} />
                View on GitHub
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
