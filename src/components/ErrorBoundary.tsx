import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { showFriendlyError, isMobileDevice } from "@/utils/SafetyUtils";
import { toast } from "sonner";
import DOMPurify from "dompurify";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the app
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console with detailed info
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Call the optional onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Check for common React errors to provide more helpful messages
    const errorMessage = error.message || "";
    let friendlyMessage = "An unexpected error occurred";

    if (
      errorMessage.includes(
        "Rendered more hooks than during the previous render"
      )
    ) {
      friendlyMessage =
        "React hooks error detected. This is often caused by conditional hook calls.";
    } else if (errorMessage.includes("Invalid hook call")) {
      friendlyMessage =
        "Invalid React hook usage detected. Hooks must be used consistently.";
    } else if (errorMessage.includes("Maximum update depth exceeded")) {
      friendlyMessage =
        "Infinite update loop detected. Check effect dependencies.";
    }

    // Show a user-friendly error message
    showFriendlyError(error, friendlyMessage);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    // Show feedback that we're trying to recover
    toast.info("Attempting to recover from error...");
  };

  // Safely sanitize error messages to prevent XSS
  sanitizeErrorMessage = (message: string): string => {
    try {
      // Remove potential script tags and limit length
      const sanitized = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] });
      return sanitized.length > 500
        ? sanitized.substring(0, 500) + "..."
        : sanitized;
    } catch (error) {
      console.error("Error sanitizing error message:", error);
      return "Error details unavailable";
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Show different UI for mobile devices
      const isMobile = isMobileDevice();

      // Default fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
          <div className="max-w-md w-full mx-auto bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">
              Something went wrong
            </h2>
            <p className="text-slate-300 mb-6">
              {isMobile
                ? "We've encountered an error on your mobile device. Try refreshing the page or switching to WiFi if you're using mobile data."
                : "We've encountered an unexpected error. Please try refreshing the page or contact support if the problem persists."}
            </p>
            {process.env.NODE_ENV !== "production" && (
              <div className="text-slate-400 bg-slate-900 p-4 rounded-md mb-6 overflow-auto max-h-48 text-sm">
                <p className="mb-2 font-semibold text-orange-400">
                  Error Details (Debug Only):
                </p>
                <code>
                  {this.sanitizeErrorMessage(
                    this.state.error?.message || "Unknown error"
                  )}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={this.resetError}
                className="bg-slate-700 hover:bg-slate-600"
              >
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Go to Home Page
              </Button>
              {process.env.NODE_ENV !== "production" && (
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Error: ${this.state.error?.message || "Unknown"}\n\n` +
                        `Stack: ${this.state.error?.stack || "Not available"}`
                    );
                    toast.success("Error details copied to clipboard");
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Copy Error Details
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
