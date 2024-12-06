import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RoleProvider } from "./context/RoleContext";
import { ApiProvider } from "./context/ApiContext.tsx";

createRoot(document.getElementById("root")!).render(
  <RoleProvider>
  <ApiProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ApiProvider>
  </RoleProvider>
);
