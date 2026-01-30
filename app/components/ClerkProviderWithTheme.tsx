"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export default function ClerkProviderWithTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Listen for theme changes
    const handleStorageChange = () => {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      }
    };

    // Listen for storage events (from other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Poll for changes since localStorage events don't fire in the same tab
    const interval = setInterval(() => {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored && stored !== theme) {
        setTheme(stored);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [theme]);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
