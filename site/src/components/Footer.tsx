import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="font-mono font-bold text-green glow-green"
            >
              gitagent<span className="text-text-muted">/</span>registry
            </Link>
            <p className="mt-3 text-sm text-text-muted max-w-sm">
              The public registry for git-native AI agents. Discover, share, and
              install agents built with the gitagent standard.
            </p>
          </div>

          {/* Registry */}
          <div>
            <h4 className="text-sm font-semibold text-text-heading mb-3">
              Registry
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/browse"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Browse Agents
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Submit an Agent
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-heading mb-3">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://gitagent.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  gitagent.sh
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/open-gitagent/registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/open-gitagent/registry/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Contributing
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle text-center text-xs text-text-faint">
          open-gitagent &middot; MIT License
        </div>
      </div>
    </footer>
  );
}
