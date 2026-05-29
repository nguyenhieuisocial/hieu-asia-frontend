'use client';

import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Alert } from '@hieu-asia/ui';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Client-side error boundary. Catches render errors in its subtree and shows a
 * graceful fallback with a retry button. Must remain a class component — React
 * function components cannot implement `getDerivedStateFromError` /
 * `componentDidCatch`.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Surface to console for visibility, then report to Sentry.
    console.error('[ErrorBoundary]', error, errorInfo);
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } },
    });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Alert variant="destructive" className="m-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Đã có lỗi xảy ra</h3>
            <p className="text-sm">
              {this.state.error?.message ?? 'Vui lòng thử lại.'}
            </p>
            <button
              type="button"
              onClick={this.reset}
              className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/90"
            >
              Thử lại
            </button>
          </div>
        </Alert>
      );
    }
    return this.props.children;
  }
}
