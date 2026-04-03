import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

export default withSentryConfig(nextConfig, {
  org: "webcassa",
  project: "javascript-nextjs",

  // Suppress build output noise in local dev
  silent: !process.env.CI,

  // Upload source maps in production so stack traces show real code
  widenClientFileUpload: true,

  webpack: {
    // Tree-shake Sentry debug logging out of production bundles
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});
