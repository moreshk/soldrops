import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DNS,
  tracesSampleRate: 1,
  debug: false,
});
