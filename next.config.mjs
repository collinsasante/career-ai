import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Firebase signInWithPopup requires the opener to allow popup messaging.
        // "same-origin-allow-popups" keeps COOP protection but permits cross-origin
        // popup windows (like Firebase's auth.google.com popup) to send postMessage.
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
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
