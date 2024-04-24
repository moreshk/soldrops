import { withSentryConfig } from "@sentry/nextjs";
const nextConfig = {};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "sol-drops",
    project: "soldrop-claim-ui",
    url: "https://glitchtip.soldrops.xyz/",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
