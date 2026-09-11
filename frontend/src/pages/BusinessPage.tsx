import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const STAGES = ["Idea", "Pre-launch", "Early revenue", "Scaling"];

export function BusinessPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [name, setName] = useState("");
  const [stage, setStage] = useState(STAGES[0]);
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    navigate("/opportunity-map");
  }

  return (
    <div className="min-h-full bg-slate-50">
      <TopBar userName={user?.firstName} onLogout={logout} />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="animate-fade-in-up">
          <p className="text-sm font-semibold text-brand-600">Step 1 of 2</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Tell me about your business
          </h1>
          <p className="mt-2 text-slate-500">
            {user ? `Thanks, ${user.firstName}. ` : ""}A few quick details help us build a sharper
            opportunity map for you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100"
          >
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Business name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Acme Inc."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
              />
            </label>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Current stage</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STAGES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStage(option)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      stage === option
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                What does your business do?
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="We help small retailers manage inventory with…"
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Biggest goal for the next 90 days
              </span>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                placeholder="Reach $10k MRR"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-400 hover:to-brand-600"
            >
              Build my opportunity map
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function TopBar({ userName, onLogout }: { userName?: string; onLogout: () => void }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-4">
          {userName && <span className="hidden text-sm text-slate-500 sm:inline">Hi, {userName}</span>}
          <button
            onClick={onLogout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
