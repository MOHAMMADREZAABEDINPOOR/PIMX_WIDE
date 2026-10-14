import React from "react";
import { Experience } from "./components/Experience";
import { PreferencesProvider } from "./contexts/Preferences";
import { VaultProvider } from "./contexts/VaultContext";
import { StartupReady } from "./components/AppLoader";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/900.css";
import "./index.css";
import "./experience.css";
import "./components/refinements.css";
import "./components/redesign.css";
import "./components/polish.css";
import "./components/languages.css";
export default function App() {
  return (
    <PreferencesProvider>
      <VaultProvider>
        <StartupReady />
        <Experience />
      </VaultProvider>
    </PreferencesProvider>
  );
}
