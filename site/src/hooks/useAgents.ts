import { useState, useEffect } from "react";
import { fetchAgents, type Agent, type AgentIndex } from "@/lib/api";

interface UseAgentsReturn {
  agents: Agent[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useAgents(): UseAgentsReturn {
  const [data, setData] = useState<AgentIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return {
    agents: data?.agents ?? [],
    total: data?.total ?? 0,
    loading,
    error,
  };
}
