import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { PortalProvider } from "./PortalHook";

ReactDOM.render(
  <React.StrictMode>
    <PortalProvider>
      <App />
    </PortalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
