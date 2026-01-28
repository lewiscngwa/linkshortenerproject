"use client";

import React, { useEffect, useState } from "react";

const THEME_KEY = "theme";

export default function ThemeToggleClient() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme]);

  return (
    <button
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="h-10 w-10 rounded-full flex items-center justify-center border border-solid border-black/[.08]"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
