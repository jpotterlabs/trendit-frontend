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
  const { captureException } = await import("@sentry/nextjs");
  captureException(err, {
    tags: {
      source: 'nextjs_request_error',
    },
    extra: {
      url: request.url,
      method: request.method,
    },
  });
}