import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

type Mode = "login" | "register";

const HIGHLIGHTS = [
  "Guided business assessment",
  "AI-built opportunity map",
  "Prioritized, actionable moves",
];

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ firstName, lastName, email, password });
      } else {
        await login({ email, password });
      }
      navigate("/business");
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldError = err.fields ? Object.values(err.fields)[0] : undefined;
        setError(fieldError ?? err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight">
            Build your business on solid ground.
          </h2>
          <p className="mt-4 max-w-md text-slate-300">
            Log in to continue your assessment and unlock a clear, prioritized opportunity map for
            your business.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-200">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/20 text-brand-200">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-slate-400">© {new Date().getFullYear()} Groundwork</div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="animate-fade-in-up rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-100">
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  !isRegister ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  isRegister ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign up
              </button>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isRegister
                ? "Start your assessment in just a few minutes."
                : "Log in to pick up where you left off."}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="First name"
                    value={firstName}
                    onChange={setFirstName}
                    autoComplete="given-name"
                    placeholder="Ada"
                    required
                  />
                  <Field
                    label="Last name"
                    value={lastName}
                    onChange={setLastName}
                    autoComplete="family-name"
                    placeholder="Lovelace"
                    required
                  />
                </div>
              )}

              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={isRegister ? "At least 8 characters" : "••••••••"}
                required
              />

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-400 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Please wait…"
                  : isRegister
                    ? "Create account & continue"
                    : "Log in & continue"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? "Already have an account? " : "New to Groundwork? "}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? "login" : "register")}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                {isRegister ? "Log in" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

function Field({ label, value, onChange, type = "text", placeholder, autoComplete, required }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
      />
    </label>
  );
}
