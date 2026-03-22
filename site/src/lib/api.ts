export interface Agent {
  name: string;
  author: string;
  description: string;
  repository: string;
  path?: string;
  version: string;
  category: string;
  tags: string[];
  license: string;
  model: string;
  adapters: string[];
  icon: string | null;
  banner: string | null;
  readme: string;
  added_at: string;
}

export interface AgentIndex {
  agents: Agent[];
  total: number;
  generated_at: string;
}

const INDEX_URL = import.meta.env.DEV
  ? "/index.json"
  : "/index.json";

let cached: AgentIndex | null = null;

export async function fetchAgents(): Promise<AgentIndex> {
  if (cached) return cached;

  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);

  cached = await res.json();
  return cached!;
}

export async function fetchReadme(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch readme: ${res.status}`);
  return res.text();
}

export const CATEGORIES = [
  "developer-tools",
  "data-engineering",
  "devops",
  "compliance",
  "security",
  "documentation",
  "testing",
  "research",
  "productivity",
  "finance",
  "customer-support",
  "creative",
  "education",
  "other",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  "developer-tools": "Developer Tools",
  "data-engineering": "Data Engineering",
  devops: "DevOps",
  compliance: "Compliance",
  security: "Security",
  documentation: "Documentation",
  testing: "Testing",
  research: "Research",
  productivity: "Productivity",
  finance: "Finance",
  "customer-support": "Customer Support",
  creative: "Creative",
  education: "Education",
  other: "Other",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "developer-tools": "Code",
  "data-engineering": "Database",
  devops: "Server",
  compliance: "Shield",
  security: "Lock",
  documentation: "FileText",
  testing: "TestTube",
  research: "Search",
  productivity: "Zap",
  finance: "DollarSign",
  "customer-support": "MessageCircle",
  creative: "Palette",
  education: "GraduationCap",
  other: "Package",
};
