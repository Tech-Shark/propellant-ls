import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { OTPContextProvider } from "@/context/OTPContext.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/Routes.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ReactQueryProvider } from "./lib/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import { checkAndClearOldVersion } from "./utils/VersionManager";

// Check version and clear old data if needed (before any other initialization)
checkAndClearOldVersion();

// Setup global error handling
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);

  // Clear potentially corrupted auth state on critical errors
  if (event.error?.message?.includes("Maximum update depth exceeded")) {
    console.warn(
      "Detected maximum update depth exceeded error, clearing problematic state"
    );
    sessionStorage.removeItem("wasAuthenticated");
  }
});

// Add this code to handle React errors
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      // Re-enabled StrictMode now that hooks issues are fixed
      <React.StrictMode>
        <ErrorBoundary>
          <ReactQueryProvider>
            <OTPContextProvider>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
            </OTPContextProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render React application:", error);
  }
}
