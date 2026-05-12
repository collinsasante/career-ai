import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — PathWise",
  description:
    "Full technical documentation for the PathWise AI-powered career guidance platform, including system architecture, implementation details, and API reference.",
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
