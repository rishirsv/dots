import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="light" accentColor="blue" grayColor="sand" radius="small" scaling="90%" panelBackground="solid">
      <App />
    </Theme>
  </StrictMode>,
);
