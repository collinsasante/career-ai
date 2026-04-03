import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PathWise : Discover Your Career Path",
    template: "%s | PathWise",
  },
  description:
    "PathWise helps students discover the right career path based on their skills, interests, and goals : with personalized learning roadmaps and expert guidance.",
  keywords: [
    "career guidance",
    "career path",
    "student career planning",
    "learning roadmap",
    "career recommendation",
    "university career",
  ],
  authors: [{ name: "PathWise" }],
  creator: "PathWise",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "PathWise : Discover Your Career Path",
    description:
      "Smart career path recommendations for students, powered by your unique profile.",
    siteName: "PathWise",
  },
  twitter: {
    card: "summary_large_image",
    title: "PathWise : Discover Your Career Path",
    description:
      "Smart career path recommendations for students, powered by your unique profile.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
