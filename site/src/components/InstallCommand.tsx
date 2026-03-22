import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Tab {
  label: string;
  command: string;
}

interface InstallCommandProps {
  tabs: Tab[];
}

export default function InstallCommand({ tabs }: InstallCommandProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[activeTab].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-terminal border border-border rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-bg-terminal-bar">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-xs font-mono transition-colors ${
              i === activeTab
                ? "text-green border-b-2 border-green bg-bg-terminal"
                : "text-text-faint hover:text-text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Command */}
      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-sm font-mono text-text break-all">
          <span className="text-green-dim select-none">$ </span>
          {tabs[activeTab].command}
        </code>
        <button
          onClick={handleCopy}
          className="ml-3 flex-shrink-0 text-text-faint hover:text-text transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check size={16} className="text-green" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
