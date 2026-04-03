"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendEmailVerification,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function friendlyError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in window was closed. Please try again.";
    default:
      return "Registration failed. Please try again.";
  }
}

async function createSession(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to create session.");
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return "weak";
    if (p.length < 10) return "fair";
    return "strong";
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      // Save display name
      await updateProfile(credential.user, { displayName: form.name.trim() });
      // Send email verification (non-blocking — don't fail registration if this errors)
      sendEmailVerification(credential.user).catch(() => {});
      const idToken = await credential.user.getIdToken();
      await createSession(idToken);
      router.push("/onboarding");
    } catch (err) {
      const code = (err as AuthError).code ?? "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      await createSession(idToken);
      // New Google users → onboarding; returning users → dashboard
      const isNew =
        credential.user.metadata.creationTime ===
        credential.user.metadata.lastSignInTime;
      router.push(isNew ? "/onboarding" : "/dashboard");
    } catch (err) {
      const code = (err as AuthError).code ?? "";
      if (code !== "auth/popup-closed-by-user") {
        setError(friendlyError(code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z" fill="white" />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-900">PathWise</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Create your account
            </h1>
            <p className="text-sm text-slate-500">
              Free to start. Takes 2 minutes to set up your profile and get
              career recommendations.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 grid grid-cols-1 gap-2">
            {[
              "Personalised career match scores",
              "Step-by-step learning roadmaps",
              "Skill gap analysis for every path",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-500 flex-shrink-0" />
                <span className="text-xs text-slate-600">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Google sign up */}
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
              <span className="px-3 bg-surface-subtle text-slate-400">or sign up with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
            />
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
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {strength && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {["weak", "fair", "strong"].map((level, i) => {
                      const active =
                        strength === "strong"
                          ? true
                          : strength === "fair"
                          ? i < 2
                          : i < 1;
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            active
                              ? strength === "strong"
                                ? "bg-emerald-500"
                                : strength === "fair"
                                ? "bg-amber-500"
                                : "bg-red-400"
                              : "bg-slate-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span
                    className={`text-xs font-medium capitalize ${
                      strength === "strong"
                        ? "text-emerald-600"
                        : strength === "fair"
                        ? "text-amber-600"
                        : "text-red-500"
                    }`}
                  >
                    {strength}
                  </span>
                </div>
              )}
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
              Create Account & Continue
            </Button>

            <p className="text-xs text-center text-slate-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-slate-600">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-slate-600">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-600 font-semibold hover:text-brand-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — visual panel */}
      <div className="hidden lg:flex flex-1 max-w-lg bg-brand-900 items-center justify-center px-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, rgb(99 102 241 / 0.3) 0%, transparent 60%)",
          }}
        />
        <div className="relative text-center space-y-6">
          <p className="text-3xl font-bold text-white leading-tight">
            Built for students who want more than a generic career quiz.
          </p>
          <div className="space-y-3">
            {[
              "Matches tailored to your actual skills",
              "Roadmaps built around your learning pace",
              "Explanations, not just labels",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-white/60 text-sm">
                <CheckCircle2 size={14} className="text-brand-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
