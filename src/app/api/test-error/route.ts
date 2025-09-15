import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Log for debugging
  console.log("Test error endpoint called - this should appear in Sentry as breadcrumb");

  // Create test exception and explicitly capture it to Sentry before throwing
  const testException = new Error("This is a test server-side error to verify Sentry integration is working correctly");

  Sentry.captureException(testException, {
    tags: {
      source: 'test-endpoint',
      environment: process.env.NODE_ENV,
    },
    extra: {
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    },
  });

  // Throw the error to also trigger global error handling
  throw testException;
}

export async function POST(request: NextRequest) {
  return GET(request);
}