import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is properly configured
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (sentryDsn && sentryDsn !== "https://your-sentry-dsn@sentry.io/project-id") {
  Sentry.init({
    dsn: sentryDsn,

    // Adjust this value in production, or use tracesSampleRate for greater control
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',

    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 0.1 : 0.01,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        // Additional Replay configuration goes in here, for example:
        maskAllText: process.env.NODE_ENV === 'production',
        blockAllMedia: process.env.NODE_ENV === 'production',
      }),
    ],
  });
} else {
  console.log("🔧 Sentry not initialized: DSN not configured or using placeholder value");
}