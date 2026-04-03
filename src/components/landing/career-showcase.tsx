import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSalary } from "@/lib/utils";
import { AnimateOnScroll } from "./animate-on-scroll";

const showcaseCareers = [
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    category: "Finance",
    salaryMin: 42000,
    salaryMax: 85000,
    demand: "High",
    demandColor: "blue" as const,
    timeToReady: "4-9 months",
    tags: ["Excel", "Financial Modelling", "Accounting", "Budgeting"],
    description:
      "Analyse financial data, build models, and produce insights that inform investment and business decisions.",
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    category: "Media & Marketing",
    salaryMin: 28000,
    salaryMax: 62000,
    demand: "High",
    demandColor: "blue" as const,
    timeToReady: "3-6 months",
    tags: ["SEO", "Social Media", "Email Marketing", "Google Ads"],
    description:
      "Drive online growth through content, paid campaigns, and social media strategies that reach real audiences.",
  },
  {
    id: "healthcare-professional",
    title: "Healthcare Professional",
    category: "Healthcare",
    salaryMin: 32000,
    salaryMax: 85000,
    demand: "Very High",
    demandColor: "emerald" as const,
    timeToReady: "Varies by role",
    tags: ["Research", "Patient Care", "Public Health", "Data Analysis"],
    description:
      "Make a direct impact on people's lives across clinical, research, and administrative healthcare roles.",
  },
  {
    id: "project-manager",
    title: "Project Manager",
    category: "Management",
    salaryMin: 42000,
    salaryMax: 80000,
    demand: "High",
    demandColor: "blue" as const,
    timeToReady: "3-6 months",
    tags: ["Planning", "Agile", "Team Leadership", "Stakeholder Management"],
    description:
      "Keep complex initiatives on track across construction, consulting, government, healthcare, and more.",
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    category: "Design & Creative",
    salaryMin: 28000,
    salaryMax: 55000,
    demand: "Moderate",
    demandColor: "blue" as const,
    timeToReady: "3-6 months",
    tags: ["Photoshop", "Illustrator", "Brand Identity", "Typography"],
    description:
      "Shape how organisations present themselves through logos, campaigns, and visual identities.",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & Analytics",
    salaryMin: 38000,
    salaryMax: 70000,
    demand: "High",
    demandColor: "blue" as const,
    timeToReady: "4-8 months",
    tags: ["SQL", "Excel", "Power BI", "Tableau"],
    description:
      "Transform raw data into business insights that drive better decisions across every industry.",
  },
];

export function CareerShowcase() {
  return (
    <section id="careers" className="section bg-white">
      <div className="container-page">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                Career Pathways
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                Explore 30+ curated career paths
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                From finance to healthcare, marketing to design, creative to consulting. Every path includes real salary data, job demand insights, and a full learning roadmap.
              </p>
            </div>
            <Link href="/careers">
              <Button variant="outline" rightIcon={<ArrowRight size={15} />}>
                View All Careers
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Career grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {showcaseCareers.map((career, i) => (
            <AnimateOnScroll key={career.id} animation="fade-up" delay={i * 70}>
            <Link
              href={`/careers/${career.id}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Category + demand */}
              <div className="flex items-center justify-between">
                <Badge variant="slate" size="sm">
                  {career.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <TrendingUp size={11} className="text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">
                    {career.demand}
                  </span>
                </div>
              </div>

              {/* Title + description */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors">
                  {career.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {career.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {career.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Salary + time */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Avg. Salary</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatSalary(career.salaryMin, career.salaryMax)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Time to Ready</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {career.timeToReady}
                  </p>
                </div>
              </div>
            </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
