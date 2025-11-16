import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router";
import { Toaster } from "sonner";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Toaster richColors />
      <App />
    </Router>
  </StrictMode>
);
