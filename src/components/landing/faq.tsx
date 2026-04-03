"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does PathWise generate career recommendations?",
    answer:
      "PathWise uses a multi-factor scoring algorithm that evaluates your profile across five dimensions: skills overlap with career requirements, your stated interests and goals, academic subject alignment, industry preferences, and work style compatibility. Each career receives a weighted score, and the results are ranked with specific explanations for why each path suits your profile.",
  },
  {
    question: "How accurate are the match scores?",
    answer:
      "Match scores are a meaningful signal, not a guarantee. They reflect how well your current profile aligns with the career's requirements. A score of 80+ means strong existing alignment. A score of 50–70 often means the path is achievable with targeted skill development — and PathWise shows you exactly what to work on.",
  },
  {
    question: "How long does the onboarding questionnaire take?",
    answer:
      "Typically 4–6 minutes. The onboarding flow has five short steps covering basic info, interests, skills, preferences, and goals. You can update your profile at any time, and PathWise will refresh your recommendations accordingly.",
  },
  {
    question: "Do I need any coding or technical knowledge to use PathWise?",
    answer:
      "No. PathWise is designed for students from any background — technical or non-technical. We recommend careers across software, design, data, management, and more. The recommendations adapt to what you know and what you're interested in learning.",
  },
  {
    question: "What is a learning roadmap?",
    answer:
      "A learning roadmap is a structured, phase-by-phase guide showing you exactly what to learn to become job-ready for a specific career. Each roadmap includes specific topics, curated resources (free and paid), estimated hours, and a logical progression from beginner to job-ready — so you never have to guess what to study next.",
  },
  {
    question: "Can I update my profile later?",
    answer:
      "Yes, absolutely. As your skills grow and your interests evolve, you can update your profile at any time. PathWise will regenerate your recommendations to reflect your current level — making it a tool that stays useful throughout your academic journey.",
  },
  {
    question: "Is PathWise free to use?",
    answer:
      "PathWise offers a free tier that includes full access to career recommendations, roadmap previews, and your student dashboard. Premium features — such as advanced skill gap analysis, mentorship connections, and extended roadmap resources — are available on the pro plan.",
  },
  {
    question: "Is PathWise only for technology careers?",
    answer:
      "The current career library is focused on technology and digital careers — including design, data, product, security, and engineering. This covers a large and growing portion of the job market. We are actively expanding the library to include other professional fields.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-900">{question}</span>
        <ChevronDown
          size={18}
          className={cn(
            "flex-shrink-0 text-slate-400 mt-0.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm text-slate-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="section bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left — header */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">
              Common questions
            </h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Everything you need to know about PathWise. Can&apos;t find your
              answer?{" "}
              <a
                href="mailto:hello@pathwise.app"
                className="text-brand-600 hover:text-brand-700 underline underline-offset-2"
              >
                Get in touch.
              </a>
            </p>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-3 bg-slate-50 rounded-2xl px-6 py-2">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
