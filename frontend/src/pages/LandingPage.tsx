import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  {
    title: "Tell us about your business",
    body: "Answer a few guided questions about your model, customers, and goals.",
  },
  {
    title: "We map your landscape",
    body: "Groundwork analyzes your inputs to surface where the real leverage is.",
  },
  {
    title: "Get your opportunity map",
    body: "A prioritized, visual plan of the highest-impact moves to make next.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function startAssessment() {
    navigate("/login");
  }

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Logo light />
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-white"
          >
            {user ? "Dashboard" : "Log in"}
          </button>
        </header>

        <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Strategic clarity for founders
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Find the ground worth
              <span className="bg-gradient-to-r from-brand-300 to-fuchsia-300 bg-clip-text text-transparent">
                {" "}
                building on.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Groundwork turns a short assessment of your business into a clear, prioritized
              opportunity map — so you always know the highest-impact move to make next.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={startAssessment}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-700/30 transition hover:from-brand-400 hover:to-brand-600"
              >
                Start Assessment
                <svg viewBox="0 0 20 20" className="h-4 w-4 transition group-hover:translate-x-0.5" fill="currentColor">
                  <path d="M10.5 3.5 16 9m0 0-5.5 5.5M16 9H4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-sm text-slate-400">Free · takes about 5 minutes</span>
            </div>
          </div>

          <div className="mt-24 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/20 text-sm font-bold text-brand-200">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
