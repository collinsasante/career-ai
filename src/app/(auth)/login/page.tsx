"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Map Firebase error codes to friendly messages
function friendlyError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in window was closed. Please try again.";
    default:
      return "Sign in failed. Please try again.";
  }
}

// Exchange Firebase ID token for a secure session cookie
async function createSession(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create session.");
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  // ── Email / password sign in ──────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      const idToken = await credential.user.getIdToken();
      await createSession(idToken);
      router.push("/dashboard");
    } catch (err) {
      const code = (err as AuthError).code ?? "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google sign in ────────────────────────────
  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await createSession(idToken);
      const isNew =
        result.user.metadata.creationTime ===
        result.user.metadata.lastSignInTime;
      router.push(isNew ? "/onboarding" : "/dashboard");
    } catch (err) {
      const code = (err as AuthError).code ?? "";
      setError(friendlyError(code));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex">
      {/* ── Form panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z" fill="white" />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-900">PathWise</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500">
              Sign in to continue your career journey.
            </p>
          </div>

          {/* Google sign in */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M47.53 24.56c0-1.63-.14-3.2-.42-4.7H24v8.9h13.22c-.57 3.06-2.3 5.65-4.9 7.39v6.14h7.94c4.64-4.27 7.27-10.57 7.27-17.73z" fill="#4285F4"/>
                <path d="M24 48c6.48 0 11.92-2.15 15.9-5.81l-7.94-6.14c-2.15 1.44-4.9 2.29-7.96 2.29-6.12 0-11.3-4.13-13.16-9.68H2.66v6.34C6.64 42.58 14.73 48 24 48z" fill="#34A853"/>
                <path d="M10.84 28.66A14.86 14.86 0 0 1 9.9 24c0-1.62.28-3.2.78-4.66v-6.34H2.66A23.96 23.96 0 0 0 0 24c0 3.87.93 7.53 2.66 10.72l8.18-6.06z" fill="#FBBC04"/>
                <path d="M24 9.5c3.45 0 6.54 1.19 8.98 3.52l6.72-6.72C35.9 2.38 30.48 0 24 0 14.73 0 6.64 5.42 2.66 13.34l8.18 6.06C12.7 13.63 17.88 9.5 24 9.5z" fill="#E94235"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-surface-subtle text-slate-400">or sign in with email</span>
            </div>
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={googleLoading}
              rightIcon={<ArrowRight size={16} />}
              className="mt-2"
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-600 font-semibold hover:text-brand-700">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right decorative panel ── */}
      <div className="hidden lg:flex flex-1 max-w-lg bg-brand-900 items-center justify-center px-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgb(99 102 241 / 0.4) 0%, transparent 60%)",
          }}
        />
        <div className="relative text-center">
          <p className="text-4xl font-bold text-white mb-4 leading-tight">
            Your career path<br />is waiting for you.
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            PathWise gives you clarity, direction, and a personalised roadmap to
            the career that fits you — not just the job market.
          </p>
        </div>
      </div>
    </div>
  );
}
