import { Quote } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { AnimateOnScroll } from "./animate-on-scroll";

const testimonials = [
  {
    quote:
      "I had no idea what to do after my CS degree. PathWise matched me with Frontend Development and gave me a 6-month roadmap. Three months in, I had my first internship offer.",
    name: "Priya M.",
    detail: "3rd Year, Computer Science — University of Toronto",
    career: "Frontend Developer",
  },
  {
    quote:
      "The skill gap analysis was eye-opening. I thought I was qualified for data science but PathWise showed me exactly what was missing and gave me a practical plan to close the gaps.",
    name: "James K.",
    detail: "Recent Graduate, Mathematics — UCL",
    career: "Data Scientist",
  },
  {
    quote:
      "What I appreciated most was the honesty. It didn't just tell me what I wanted to hear — it ranked careers by match and explained the reasoning clearly. That's rare.",
    name: "Aisha N.",
    detail: "Postgraduate, Information Systems — NUS",
    career: "Cybersecurity Analyst",
  },
  {
    quote:
      "I'm a business major with no coding background. PathWise pointed me toward Product Management with a roadmap that didn't require me to become an engineer overnight. Perfect fit.",
    name: "Tom H.",
    detail: "4th Year, Business Administration — TU Delft",
    career: "Product Manager",
  },
  {
    quote:
      "The roadmap feature alone is worth it. Each phase has exactly the right resources, in the right order. I spent way less time figuring out what to learn next.",
    name: "Sara L.",
    detail: "2nd Year, Design — RMIT",
    career: "UI/UX Designer",
  },
  {
    quote:
      "I was sceptical that a platform could give genuinely good advice — but the match reasoning was specific and accurate. It clearly understood my profile, not just my job title.",
    name: "Rohan P.",
    detail: "Year 3, Electronics Engineering — BITS Pilani",
    career: "Cloud / DevOps Engineer",
  },
];

export function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
        <div className="max-w-xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            Student Stories
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Students who found their direction
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Hear from students who used PathWise to move from uncertainty to a
            clear, confident career plan.
          </p>
        </div>
        </AnimateOnScroll>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} animation="fade-up" delay={i * 80}>
            <div
              className={`bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex flex-col gap-4
                ${i === 0 ? "lg:row-span-1" : ""}`}
            >
              {/* Quote icon */}
              <Quote size={20} className="text-brand-200 flex-shrink-0" />

              {/* Quote text */}
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">
                    {getInitials(t.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{t.detail}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-medium text-brand-600 whitespace-nowrap">
                    → {t.career}
                  </span>
                </div>
              </div>
            </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-slate-100">
          {[
            { value: "2,400+", label: "Students guided" },
            { value: "30+", label: "Career paths" },
            { value: "87%", label: "Found a clear path within a week" },
            { value: "4.8/5", label: "Average student rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
