import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@mantine/core/styles.css";
import { AuthProvider } from './context/AuthContext';
import { MantineProvider } from '@mantine/core';
import { useState } from "react";

const lightTheme = {
  colors: {
    primary: ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"],
    heading: ["#1f2937", "#111827", "#030712"],
  },
  primaryColor: "primary",
  other: {
    "--color-primary": "#6366f1",
    "--color-heading": "#1f2937",
  },
};

const darkTheme = {
  colors: {
    primary: ["#818cf8", "#6366f1", "#4f46e5"],
    heading: ["#e5e7eb", "#d1d5db", "#9ca3af"],
  },
  primaryColor: "primary",
  other: {
    "--color-primary": "#818cf8",
    "--color-heading": "#e5e7eb",
  },
};

function Root() {
  const [themeMode, setThemeMode] = useState("light");

  const theme = createTheme(themeMode === "light" ? lightTheme : darkTheme);

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <ThemeToggler onThemeChange={setThemeMode} />
        <App />
      </BrowserRouter>
    </MantineProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>  
    </StrictMode>
    
  </AuthProvider>
)
