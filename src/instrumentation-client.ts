// Client-side instrumentation utilities for Sentry.
// Main client-side Sentry configuration is handled in sentry.client.config.ts
//
// This file provides instrumentation helpers for router transitions and other
// client-side events that need to be captured by Sentry.

import * as Sentry from "@sentry/nextjs";

// Export router transition helper for use in components if needed
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;