"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactElement } from "react";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <fieldset className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
      <legend className="sr-only">Theme preference</legend>
      <ThemeOption label="Light" value="light" onSelect={setTheme} icon={<Sun />} />
      <ThemeOption label="Dark" value="dark" onSelect={setTheme} icon={<Moon />} />
      <ThemeOption
        label="System"
        value="system"
        onSelect={setTheme}
        icon={<Monitor />}
      />
    </fieldset>
  );
}

type ThemeOptionProps = {
  label: string;
  value: "light" | "dark" | "system";
  onSelect: (theme: string) => void;
  icon: ReactElement;
};

function ThemeOption({ label, value, onSelect, icon }: ThemeOptionProps) {
  return (
    <button
      type="button"
      className="inline-flex min-h-9 items-center gap-2 rounded px-2.5 text-sm font-medium text-muted transition hover:bg-surface-elevated hover:text-primary"
      onClick={() => onSelect(value)}
      aria-label={`Use ${label.toLowerCase()} theme`}
    >
      <span aria-hidden="true" className="[&>svg]:size-4">
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
