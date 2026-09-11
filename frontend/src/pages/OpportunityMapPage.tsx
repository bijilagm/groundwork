import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const OPPORTUNITIES = [
  { title: "Sharpen your ICP", impact: "High", effort: "Low", tint: "from-emerald-500 to-teal-600" },
  { title: "Launch a referral loop", impact: "High", effort: "Medium", tint: "from-brand-500 to-brand-700" },
  { title: "Automate onboarding", impact: "Medium", effort: "Low", tint: "from-amber-500 to-orange-600" },
  { title: "Add usage-based pricing", impact: "Medium", effort: "High", tint: "from-fuchsia-500 to-purple-600" },
];

export function OpportunityMapPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo />
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="animate-fade-in-up">
          <p className="text-sm font-semibold text-brand-600">Your results</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            {user ? `${user.firstName}'s opportunity map` : "Your opportunity map"}
          </h1>
          <p className="mt-2 text-slate-500">
            Prioritized moves based on your assessment. Start at the top-left for the biggest wins.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {OPPORTUNITIES.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-100"
              >
                <div className={`h-1.5 bg-gradient-to-r ${item.tint}`} />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Impact: {item.impact}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Effort: {item.effort}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/business"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              ← Refine my answers
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
