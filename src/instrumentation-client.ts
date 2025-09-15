// This file was causing duplicate Sentry initialization conflicts.
// Client-side Sentry configuration is now handled in sentry.client.config.ts
//
// Note: This file exists because of Next.js instrumentation setup but we're
// using the standard Sentry Next.js configuration approach instead.

import * as Sentry from "@sentry/nextjs";

// Export router transition helper for use in components if needed
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;