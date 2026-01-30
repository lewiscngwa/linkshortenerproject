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
    // Listen for theme changes by observing the html element's class
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      const newTheme = isDark ? "dark" : "light";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
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
