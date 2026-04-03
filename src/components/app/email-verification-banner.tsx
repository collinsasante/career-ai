"use client";

import { useState, useEffect } from "react";
import { Mail, X, CheckCircle2, Loader2 } from "lucide-react";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function EmailVerificationBanner() {
  const [show,      setShow]      = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // Show only for email/password users who haven't verified yet
      if (user && !user.emailVerified && user.providerData[0]?.providerId === "password") {
        setShow(true);
      }
    });
    return unsub;
  }, []);

  if (!show || dismissed) return null;

  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setSending(true);
    try {
      await sendEmailVerification(user);
      setSent(true);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <Mail size={15} className="text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          {sent
            ? "Verification email sent. Check your inbox."
            : "Please verify your email address to secure your account."}
        </p>
        {!sent && (
          <button
            onClick={handleResend}
            disabled={sending}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline flex items-center gap-1 flex-shrink-0"
          >
            {sending && <Loader2 size={11} className="animate-spin" />}
            {sending ? "Sending..." : "Resend email"}
          </button>
        )}
        {sent && <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-500 hover:text-amber-700 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}
