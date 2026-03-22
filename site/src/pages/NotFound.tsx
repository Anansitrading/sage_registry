import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-container mx-auto text-center py-20">
        <h1 className="text-6xl font-mono font-bold text-text-faint">404</h1>
        <p className="mt-4 text-lg text-text-muted">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 text-green hover:underline"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    </div>
  );
}
