import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@nfid/identitykit/react/styles.css";

import { IdentityKitProvider } from "@nfid/identitykit/react";
import { NFIDW, Plug } from "@nfid/identitykit";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <IdentityKitProvider
    signers={[ Plug]}
    signerClientOptions={{
      targets: ["nqjwu-oyaaa-aaaac-ae7oa-cai"],
    }}
  >
    <BrowserRouter>
      <App />
      <Toaster />

    </BrowserRouter>
  </IdentityKitProvider>
);
