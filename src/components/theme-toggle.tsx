"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactElement } from "react";
import { useI18n } from "@/i18n/client";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <fieldset className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
      <legend className="sr-only">{t("theme.preference")}</legend>
      <ThemeOption
        label={t("theme.light")}
        value="light"
        onSelect={setTheme}
        icon={<Sun />}
        ariaLabel={t("theme.use", { theme: t("theme.light") })}
      />
      <ThemeOption
        label={t("theme.dark")}
        value="dark"
        onSelect={setTheme}
        icon={<Moon />}
        ariaLabel={t("theme.use", { theme: t("theme.dark") })}
      />
      <ThemeOption
        label={t("theme.system")}
        value="system"
        onSelect={setTheme}
        icon={<Monitor />}
        ariaLabel={t("theme.use", { theme: t("theme.system") })}
      />
    </fieldset>
  );
}

type ThemeOptionProps = {
  label: string;
  value: "light" | "dark" | "system";
  onSelect: (theme: string) => void;
  icon: ReactElement;
  ariaLabel?: string;
};

function ThemeOption({ ariaLabel, label, value, onSelect, icon }: ThemeOptionProps) {
  return (
    <button
      type="button"
      className="inline-flex min-h-9 items-center gap-2 rounded px-2.5 text-sm font-medium text-muted transition hover:bg-surface-elevated hover:text-primary"
      onClick={() => onSelect(value)}
      aria-label={ariaLabel ?? label}
    >
      <span aria-hidden="true" className="[&>svg]:size-4">
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
