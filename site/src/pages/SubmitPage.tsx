import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

const EXAMPLE_METADATA = `{
  "name": "my-agent",
  "author": "your-github-username",
  "description": "A short description of what your agent does",
  "repository": "https://github.com/your-username/your-repo",
  "path": "",
  "version": "1.0.0",
  "category": "developer-tools",
  "tags": ["tag1", "tag2"],
  "license": "MIT",
  "model": "claude-sonnet-4-5-20250929",
  "adapters": ["claude-code", "system-prompt"],
  "icon": false
}`;

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-bg-terminal border border-border rounded-lg overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 text-text-faint hover:text-text transition-colors"
        title="Copy"
      >
        {copied ? (
          <Check size={16} className="text-green" />
        ) : (
          <Copy size={16} />
        )}
      </button>
      <pre className="p-4 text-sm font-mono text-text overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}

const STEPS = [
  {
    num: "1",
    title: "Fork the registry repo",
    content: (
      <p className="text-text-muted text-sm">
        Fork{" "}
        <a
          href="https://github.com/open-gitagent/registry"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green hover:underline"
        >
          open-gitagent/registry
        </a>{" "}
        on GitHub.
      </p>
    ),
  },
  {
    num: "2",
    title: "Create your agent folder",
    content: (
      <>
        <p className="text-text-muted text-sm mb-3">
          Create a folder using the naming convention{" "}
          <code className="text-amber bg-bg-terminal px-1.5 py-0.5 rounded text-xs">
            {"agents/<github-username>__<agent-name>/"}
          </code>
        </p>
        <CopyBlock code="mkdir agents/your-username__my-agent" />
      </>
    ),
  },
  {
    num: "3",
    title: "Add metadata.json",
    content: (
      <>
        <p className="text-text-muted text-sm mb-3">
          Add a <code className="text-amber bg-bg-terminal px-1.5 py-0.5 rounded text-xs">metadata.json</code> file
          describing your agent.
        </p>
        <CopyBlock code={EXAMPLE_METADATA} />
      </>
    ),
  },
  {
    num: "4",
    title: "Add README.md",
    content: (
      <p className="text-text-muted text-sm">
        Write a README.md describing what your agent does, its capabilities, and
        example usage. This is displayed on your agent's detail page.
      </p>
    ),
  },
  {
    num: "5",
    title: "Open a Pull Request",
    content: (
      <p className="text-text-muted text-sm">
        Push your branch and open a PR. CI will validate your submission
        automatically — checking the schema, verifying your repo has{" "}
        <code className="text-amber bg-bg-terminal px-1.5 py-0.5 rounded text-xs">
          agent.yaml
        </code>{" "}
        and{" "}
        <code className="text-amber bg-bg-terminal px-1.5 py-0.5 rounded text-xs">
          SOUL.md
        </code>
        , and confirming everything matches.
      </p>
    ),
  },
];

export default function SubmitPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-narrow mx-auto">
        <h1 className="text-3xl font-bold text-text-heading">
          Submit Your Agent
        </h1>
        <p className="mt-2 text-text-muted">
          Share your gitagent with the community. Submissions are reviewed via
          pull request — GitHub is the source of truth.
        </p>

        {/* Requirements */}
        <div className="mt-10 bg-bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-heading mb-3">
            Requirements
          </h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="text-green mt-0.5">&#10003;</span>
              Public GitHub repository
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green mt-0.5">&#10003;</span>
              Valid <code className="text-amber bg-bg-terminal px-1 py-0.5 rounded text-xs">agent.yaml</code> at repo root or specified path
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green mt-0.5">&#10003;</span>
              <code className="text-amber bg-bg-terminal px-1 py-0.5 rounded text-xs">SOUL.md</code> file present
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green mt-0.5">&#10003;</span>
              Follows the{" "}
              <a
                href="https://gitagent.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:underline"
              >
                gitagent standard
              </a>
            </li>
          </ul>
        </div>

        {/* Steps */}
        <div className="mt-10 space-y-8">
          {STEPS.map((step) => (
            <div key={step.num} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green/10 border border-border-green flex items-center justify-center font-mono text-sm font-bold text-green">
                {step.num}
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-text-heading font-semibold mb-2">
                  {step.title}
                </h3>
                {step.content}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/open-gitagent/registry/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green/10 border border-border-green text-green font-semibold text-sm rounded-lg hover:bg-green/20 transition-all hover:shadow-glow-green"
          >
            Fork & Submit <ExternalLink size={16} />
          </a>
          <p className="mt-3 text-xs text-text-faint">
            Full guide:{" "}
            <a
              href="https://github.com/open-gitagent/registry/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-green transition-colors"
            >
              CONTRIBUTING.md
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
