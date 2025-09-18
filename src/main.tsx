import { createRoot } from "react-dom/client";
import "./index.css";
import { OTPContextProvider } from "@/context/OTPContext.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/Routes.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { StrictMode } from "react";
import { ReactQueryProvider } from "./lib/react-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <OTPContextProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </OTPContextProvider>
    </ReactQueryProvider>
  </StrictMode>
);
