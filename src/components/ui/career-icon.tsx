import {
  TrendingUp,
  Megaphone,
  ClipboardList,
  Palette,
  BarChart2,
  Users,
  PenLine,
  Briefcase,
  Heart,
  Layers,
  Video,
  Code2,
  MousePointer2,
  Shield,
  FlaskConical,
  Server,
  Smartphone,
  Brain,
  Share2,
  Calculator,
  DollarSign,
  Database,
  Gamepad2,
  Cloud,
  FileText,
  GraduationCap,
  Compass,
  type LucideProps,
} from "lucide-react";

// Maps career ID to a Lucide icon component
const CAREER_ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  "financial-analyst":       TrendingUp,
  "digital-marketer":        Megaphone,
  "project-manager":         ClipboardList,
  "graphic-designer":        Palette,
  "data-analyst":            BarChart2,
  "hr-specialist":           Users,
  "content-writer":          PenLine,
  "business-analyst":        Briefcase,
  "healthcare-professional": Heart,
  "product-manager":         Layers,
  "video-producer":          Video,
  "software-engineer":       Code2,
  "ux-ui-designer":          MousePointer2,
  "cybersecurity-analyst":   Shield,
  "data-scientist":          FlaskConical,
  "devops-engineer":         Server,
  "mobile-developer":        Smartphone,
  "ml-engineer":             Brain,
  "social-media-manager":    Share2,
  "accountant":              Calculator,
  "sales-executive":         DollarSign,
  "data-engineer":           Database,
  "game-developer":          Gamepad2,
  "cloud-architect":         Cloud,
  "technical-writer":        FileText,
  "teacher-educator":        GraduationCap,
};

interface CareerIconProps extends LucideProps {
  careerId: string;
}

/** Renders the appropriate Lucide icon for a given career ID. Falls back to Compass. */
export function CareerIcon({ careerId, ...props }: CareerIconProps) {
  const Icon = CAREER_ICON_MAP[careerId] ?? Compass;
  return <Icon {...props} />;
}
