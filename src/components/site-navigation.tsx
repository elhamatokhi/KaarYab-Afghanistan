"use client";

import Link from "next/link";
import { Menu, Plus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/saved", label: "Saved" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          active={isActivePath(pathname, item.href)}
          onClick={() => setIsOpen(false)}
        />
      ))}
    </>
  );

  return (
    <div className="flex items-center gap-3">
      <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
        {navLinks}
      </nav>
      <div className="hidden items-center gap-3 sm:flex">
        <AddOpportunityLink />
        <ThemeToggle />
      </div>
      <button
        ref={menuButtonRef}
        type="button"
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated lg:hidden"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {isOpen ? (
          <X aria-hidden="true" className="size-4" />
        ) : (
          <Menu aria-hidden="true" className="size-4" />
        )}
        Menu
      </button>
      {isOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface shadow-sm lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8"
          >
            {navLinks}
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4 sm:hidden">
              <AddOpportunityLink onClick={() => setIsOpen(false)} />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
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
  return (
    <Link
      href="/add-opportunity"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
    >
      <Plus aria-hidden="true" className="size-4" />
      Add opportunity
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
