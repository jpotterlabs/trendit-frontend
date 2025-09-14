export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Handle Next.js request errors for Sentry
export async function onRequestError(err: unknown, request: { url?: string; method?: string }) {
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request);
}