"use client";

import Link from "next/link";
import { LogIn, LogOut, Menu, Plus, UserPlus, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/i18n/client";
import type { MessageKey } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export const publicNavItems = [
  { href: "/opportunities", labelKey: "common.opportunities" },
  { href: "/about", labelKey: "common.about" },
  { href: "/contact", labelKey: "common.contact" },
] as const satisfies readonly { href: string; labelKey: MessageKey }[];

export function getPublicNavItemsForRole() {
  return publicNavItems;
}

export function SiteNavigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isAdmin = session?.user?.role === "ADMIN";
  const isUser = session?.user?.role === "USER";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const navLinks = (
    <>
      {getPublicNavItemsForRole().map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={t(item.labelKey)}
          active={isActivePath(pathname, item.href)}
          onClick={() => setIsOpen(false)}
        />
      ))}
      {isUser ? (
        <NavLink
          href="/saved"
          label={t("common.saved")}
          active={isActivePath(pathname, "/saved")}
          onClick={() => setIsOpen(false)}
        />
      ) : null}
      {isAdmin ? (
        <NavLink
          href="/dashboard"
          label={t("common.dashboard")}
          active={isActivePath(pathname, "/dashboard")}
          onClick={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );

  return (
    <div className="flex items-center gap-3">
      <nav aria-label={t("nav.main")} className="hidden items-center gap-1 lg:flex">
        {navLinks}
      </nav>
      <div className="hidden items-center gap-3 sm:flex">
        {isAdmin ? <AddOpportunityLink /> : null}
        <LanguageSelector />
        <AuthLinks
          isAuthenticated={isAuthenticated}
          onNavigate={() => setIsOpen(false)}
        />
        <ThemeToggle />
      </div>
      <button
        ref={menuButtonRef}
        type="button"
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated lg:hidden"
        aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {isOpen ? (
          <X aria-hidden="true" className="size-4" />
        ) : (
          <Menu aria-hidden="true" className="size-4" />
        )}
        {t("nav.menu")}
      </button>
      {isOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface shadow-sm lg:hidden"
        >
          <nav
            aria-label={t("nav.mobile")}
            className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8"
          >
            {navLinks}
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4 sm:hidden">
              {isAdmin ? <AddOpportunityLink onClick={() => setIsOpen(false)} /> : null}
              <LanguageSelector />
              <AuthLinks
                isAuthenticated={isAuthenticated}
                onNavigate={() => setIsOpen(false)}
              />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

function AuthLinks({
  isAuthenticated,
  onNavigate,
}: {
  isAuthenticated: boolean;
  onNavigate: () => void;
}) {
  const { t } = useI18n();

  if (isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => {
          onNavigate();
          void signOut({ callbackUrl: "/" });
        }}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
      >
        <LogOut aria-hidden="true" className="size-4" />
        {t("common.logout")}
      </button>
    );
  }

  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
      >
        <LogIn aria-hidden="true" className="size-4" />
        {t("common.login")}
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-secondary-action px-4 py-2 text-sm font-semibold text-secondary-action-foreground transition hover:opacity-90"
      >
        <UserPlus aria-hidden="true" className="size-4" />
        {t("common.register")}
      </Link>
    </>
  );
}

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
};

function NavLink({ href, label, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-secondary-action text-secondary-action-foreground"
          : "text-muted hover:bg-surface-elevated hover:text-primary",
      )}
    >
      {label}
    </Link>
  );
}

function AddOpportunityLink({ onClick }: { onClick?: () => void }) {
  const { t } = useI18n();

  return (
    <Link
      href="/add-opportunity"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
    >
      <Plus aria-hidden="true" className="size-4" />
      {t("common.addOpportunity")}
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
