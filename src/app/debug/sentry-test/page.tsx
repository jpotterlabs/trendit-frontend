'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  const testClientError = () => {
    console.log("Testing client-side error - this should appear in Sentry");
    throw new Error("This is a test client-side error for Sentry verification");
  };

  const testServerError = async () => {
    try {
      console.log("Testing server-side error via API call");
      const response = await fetch('/api/debug/test-error');
      if (!response.ok) {
        throw new Error('Server error test failed');
      }
    } catch (error) {
      console.error('Expected server error for testing:', error);
    }
  };

  const testManualCapture = () => {
    console.log("Testing manual Sentry capture");
    Sentry.captureMessage("Manual test message from frontend", "info");
    Sentry.captureException(new Error("Manual test exception from frontend"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">
              ⚠️ Sentry Error Testing Page
            </CardTitle>
            <p className="text-muted-foreground">
              This page is for testing Sentry integration. <strong>REMOVE IN PRODUCTION!</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Before testing:</strong> Make sure NEXT_PUBLIC_SENTRY_DSN is configured in your .env.local file.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={testClientError}
                variant="destructive"
                className="h-auto p-4"
              >
                <div className="text-center">
                  <div className="font-semibold">Test Client Error</div>
                  <div className="text-xs mt-1">Throws client-side exception</div>
                </div>
              </Button>

              <Button
                onClick={testServerError}
                variant="outline"
                className="h-auto p-4 border-orange-200 hover:bg-orange-50"
              >
                <div className="text-center">
                  <div className="font-semibold">Test Server Error</div>
                  <div className="text-xs mt-1">Calls backend error endpoint</div>
                </div>
              </Button>

              <Button
                onClick={testManualCapture}
                variant="secondary"
                className="h-auto p-4"
              >
                <div className="text-center">
                  <div className="font-semibold">Test Manual Capture</div>
                  <div className="text-xs mt-1">Manually sends to Sentry</div>
                </div>
              </Button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Configure your Sentry DSN in both frontend and backend</li>
                <li>2. Test each button and check your Sentry dashboard</li>
                <li>3. Verify error grouping, breadcrumbs, and stack traces</li>
                <li>4. <strong>Remove this page before production deployment</strong></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}