import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAgents } from "@/hooks/useAgents";
import { CATEGORY_LABELS } from "@/lib/api";
import AgentGrid from "@/components/AgentGrid";
import SearchBar from "@/components/SearchBar";
import {
  Code,
  Database,
  Server,
  Shield,
  Lock,
  FileText,
  TestTube,
  Search,
  Zap,
  DollarSign,
  MessageCircle,
  Palette,
  GraduationCap,
  Package,
  ArrowRight,
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  "developer-tools": <Code size={20} />,
  "data-engineering": <Database size={20} />,
  devops: <Server size={20} />,
  compliance: <Shield size={20} />,
  security: <Lock size={20} />,
  documentation: <FileText size={20} />,
  testing: <TestTube size={20} />,
  research: <Search size={20} />,
  productivity: <Zap size={20} />,
  finance: <DollarSign size={20} />,
  "customer-support": <MessageCircle size={20} />,
  creative: <Palette size={20} />,
  education: <GraduationCap size={20} />,
  other: <Package size={20} />,
};

export default function HomePage() {
  const { agents, total, loading } = useAgents();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Unique categories from actual agents
  const activeCategories = useMemo(() => {
    const cats = new Set(agents.map((a) => a.category));
    return Array.from(cats).sort();
  }, [agents]);

  // Unique contributors
  const contributors = useMemo(() => {
    return new Set(agents.map((a) => a.author)).size;
  }, [agents]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      navigate(`/browse?q=${encodeURIComponent(value)}`);
    }
  };

  const featured = agents.slice(0, 6);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-green bg-border-green/10 text-xs font-mono text-green mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            open-gitagent/registry
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-text-heading tracking-tight leading-tight">
            The Agent{" "}
            <span className="text-green glow-green">Registry</span>
          </h1>

          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Discover, share, and install git-native AI agents built with the
            gitagent standard.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto">
            <SearchBar
              value={query}
              onChange={handleSearch}
              placeholder="Search agents by name, tag, or category..."
            />
          </div>

          {/* Stats */}
          <div className="mt-10 flex items-center justify-center gap-8 text-sm">
            <div>
              <span className="font-mono font-bold text-text-heading text-lg">
                {loading ? "-" : total}
              </span>
              <span className="text-text-muted ml-1.5">agents</span>
            </div>
            <div className="w-px h-5 bg-border" />
            <div>
              <span className="font-mono font-bold text-text-heading text-lg">
                {loading ? "-" : activeCategories.length}
              </span>
              <span className="text-text-muted ml-1.5">categories</span>
            </div>
            <div className="w-px h-5 bg-border" />
            <div>
              <span className="font-mono font-bold text-text-heading text-lg">
                {loading ? "-" : contributors}
              </span>
              <span className="text-text-muted ml-1.5">contributors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured agents */}
      <section className="py-16 px-6">
        <div className="max-w-container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-heading">
              Featured Agents
            </h2>
            <Link
              to="/browse"
              className="text-sm text-text-muted hover:text-green transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <AgentGrid agents={featured} loading={loading} />
        </div>
      </section>

      {/* Categories */}
      {activeCategories.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-container mx-auto">
            <h2 className="text-2xl font-bold text-text-heading mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeCategories.map((cat) => {
                const count = agents.filter((a) => a.category === cat).length;
                return (
                  <Link
                    key={cat}
                    to={`/browse?category=${cat}`}
                    className="group flex items-center gap-3 p-4 bg-bg-card border border-border rounded-lg transition-all hover:bg-bg-card-hover hover:border-border-green hover:shadow-glow-green"
                  >
                    <span className="text-text-muted group-hover:text-green transition-colors">
                      {CATEGORY_ICON_MAP[cat] ?? <Package size={20} />}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-text-heading">
                        {CATEGORY_LABELS[cat] ?? cat}
                      </span>
                      <span className="block text-xs text-text-faint">
                        {count} {count === 1 ? "agent" : "agents"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Submit CTA */}
      <section className="py-20 px-6">
        <div className="max-w-narrow mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-heading">
            Share Your Agent
          </h2>
          <p className="mt-3 text-text-muted">
            Built an agent with gitagent? Submit it to the registry and share it
            with the community.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green/10 border border-border-green text-green font-semibold text-sm rounded-lg hover:bg-green/20 transition-all hover:shadow-glow-green"
          >
            Submit Your Agent <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
