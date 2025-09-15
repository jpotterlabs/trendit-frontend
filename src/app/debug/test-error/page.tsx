'use client';

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function TestErrorPage() {
  const [errorType, setErrorType] = useState<string>('client');

  const triggerClientError = () => {
    // Client-side error
    throw new Error("This is a test client-side error for Sentry verification");
  };

  const triggerServerError = async () => {
    // Server-side error via API call
    try {
      const response = await fetch('/api/test-error');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  const triggerManualError = () => {
    // Manually captured error
    const error = new Error("This is a manually captured test error");
    Sentry.captureException(error, {
      tags: {
        component: 'test-page',
        manual: true,
      },
      extra: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    });
    alert("Error manually sent to Sentry");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Sentry Error Testing
          </h1>
          <p className="text-gray-600 mb-8">
            This page is only available in development mode. Use these buttons to test Sentry error reporting.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={triggerClientError}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Trigger Client-Side Error
          </button>

          <button
            onClick={triggerServerError}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Trigger Server-Side Error
          </button>

          <button
            onClick={triggerManualError}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Manually Capture Error
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Environment Variables Needed:
          </h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• NEXT_PUBLIC_SENTRY_DSN (frontend)</li>
            <li>• SENTRY_DSN (backend)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}