"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "landing" | "app";
  session?: { name: string; email: string } | null;
}

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#careers", label: "Career Paths" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar({ variant = "landing", session }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        "bg-white/90 backdrop-blur-sm border-slate-100"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-base">PathWise</span>
        </Link>

        {/* Desktop nav — landing only */}
        {variant === "landing" && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* App nav links */}
        {variant === "app" && (
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/careers", label: "Explore Careers" },
              { href: "/profile", label: "My Profile" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* CTA area */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-slate-500">
                {session.name.split(" ")[0]}
              </span>
              <Link href="/dashboard">
                <Button size="sm" variant="primary">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {variant === "landing" &&
            navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
          {variant === "app" &&
            [
              { href: "/dashboard", label: "Dashboard" },
              { href: "/careers", label: "Explore Careers" },
              { href: "/profile", label: "My Profile" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-slate-100 mt-3">
            {session ? (
              <Link href="/dashboard">
                <Button fullWidth variant="primary" size="md">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button fullWidth variant="outline" size="md">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button fullWidth variant="primary" size="md">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
