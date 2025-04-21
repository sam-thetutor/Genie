import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
 import "./index.css";
import App from "./App.jsx";
import "@nfid/identitykit/react/styles.css";

import { IdentityKitProvider } from "@nfid/identitykit/react";
import { InternetIdentity, NFIDW} from "@nfid/identitykit";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <IdentityKitProvider
    signers={[NFIDW,InternetIdentity]}
  >
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </IdentityKitProvider>
);
