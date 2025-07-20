"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn, getIsClient } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const themes = [
  { value: "light" as Theme, icon: "light_mode", label: "Light" },
  { value: "dark" as Theme, icon: "dark_mode", label: "Dark" },
  { value: "system" as Theme, icon: "computer", label: "System" },
];

export const useColorTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (getIsClient()) {
      return localStorage.getItem("theme") as Theme || "system";
    }
    return "system";
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemIsDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    setTheme(newTheme);
    if (getIsClient()) {
      localStorage.setItem("theme", newTheme);
    }
  }, []);

  useEffect(() => {
    if (!getIsClient()) return;
    
    const localTheme = localStorage.getItem("theme") as Theme || "system";
    const matchDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");

    const isSystem = localTheme === "system";

    if (isSystem) {
      const colorScheme = matchDarkMedia.matches ? "dark" : "light";
      applyTheme(colorScheme);
    } else {
      applyTheme(localTheme);
    }

    const handleChange = (event: MediaQueryListEvent) => {
      const colorScheme = event.matches ? "dark" : "light";
      applyTheme(colorScheme);
    };

    matchDarkMedia.addEventListener("change", handleChange);

    return () => {
      matchDarkMedia.removeEventListener("change", handleChange);
    };
  }, [applyTheme]);

  return [theme, applyTheme] as const;
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useColorTheme();
  const [isMounted, setIsMounted] = useState(false);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex rounded-lg border border-border bg-background animate-fade-scale">
      {themes.map((themeOption, index) => (
        <Button
          key={themeOption.value}
          variant={theme === themeOption.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => changeTheme(themeOption.value)}
          className={cn(
            "h-8 px-3 flex-1 transition-all duration-200",
            index === 0 && "rounded-r-none border-r",
            index === 1 && "rounded-none border-r",
            index === 2 && "rounded-l-none",
            theme !== themeOption.value && "hover:bg-blue/10"
          )}
          title={themeOption.label}
        >
          <Icon name={themeOption.icon} size={14} />
        </Button>
      ))}
    </div>
  );
}; 