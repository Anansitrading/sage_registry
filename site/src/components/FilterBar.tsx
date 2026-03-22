import { CATEGORIES, CATEGORY_LABELS } from "@/lib/api";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedAdapter: string;
  onAdapterChange: (adapter: string) => void;
  adapters: string[];
}

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedAdapter,
  onAdapterChange,
  adapters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Category filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-bg-card border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-border-green cursor-pointer"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>

      {/* Adapter filter */}
      <select
        value={selectedAdapter}
        onChange={(e) => onAdapterChange(e.target.value)}
        className="bg-bg-card border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-border-green cursor-pointer"
      >
        <option value="">All Adapters</option>
        {adapters.map((adapter) => (
          <option key={adapter} value={adapter}>
            {adapter}
          </option>
        ))}
      </select>
    </div>
  );
}
