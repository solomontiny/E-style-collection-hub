import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import ErrorBoundary from "./ErrorBoundary";

import { AuthProvider } from "./hooks/useAuth";
import { CurrencyProvider } from "./hooks/useCurrency";
import { CartProvider } from "./hooks/useCart";

console.log("🚀 App starting...");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);