import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAgents } from "@/hooks/useAgents";
import { search } from "@/lib/search";
import AgentGrid from "@/components/AgentGrid";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";

export default function BrowsePage() {
  const { agents, loading } = useAgents();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [adapter, setAdapter] = useState(searchParams.get("adapter") ?? "");

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (adapter) params.set("adapter", adapter);
    setSearchParams(params, { replace: true });
  }, [query, category, adapter, setSearchParams]);

  // Get unique adapters
  const allAdapters = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => a.adapters.forEach((ad) => set.add(ad)));
    return Array.from(set).sort();
  }, [agents]);

  // Filter and search
  const filtered = useMemo(() => {
    let result = agents;

    // Category filter
    if (category) {
      result = result.filter((a) => a.category === category);
    }

    // Adapter filter
    if (adapter) {
      result = result.filter((a) => a.adapters.includes(adapter));
    }

    // Text search
    if (query.trim()) {
      result = search(query, result);
    }

    return result;
  }, [agents, query, category, adapter]);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-container mx-auto">
        <h1 className="text-3xl font-bold text-text-heading">Browse Agents</h1>
        <p className="mt-2 text-text-muted">
          Search and filter the full agent catalog.
        </p>

        {/* Search + Filters */}
        <div className="mt-8 space-y-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by name, description, tags..."
          />
          <FilterBar
            selectedCategory={category}
            onCategoryChange={setCategory}
            selectedAdapter={adapter}
            onAdapterChange={setAdapter}
            adapters={allAdapters}
          />
        </div>

        {/* Results count */}
        <div className="mt-6 mb-6 text-sm text-text-muted">
          {loading
            ? "Loading..."
            : `${filtered.length} ${filtered.length === 1 ? "agent" : "agents"} found`}
        </div>

        {/* Grid */}
        <AgentGrid
          agents={filtered}
          loading={loading}
          emptyMessage="No agents match your search. Try different keywords or filters."
        />
      </div>
    </div>
  );
}
