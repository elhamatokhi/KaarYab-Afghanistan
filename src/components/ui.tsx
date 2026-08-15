import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function PageContainer({ children, className }: ContainerProps) {
  return (
    <Container className={cn("py-10 sm:py-14 lg:py-16", className)}>
      {children}
    </Container>
  );
}

type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-normal text-primary sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}

type SectionHeadingProps = {
  title: string;
  description?: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-normal text-primary">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

const buttonVariants = {
  primary:
    "bg-action text-action-foreground hover:bg-action-hover border-transparent",
  secondary:
    "border-border bg-surface text-primary hover:bg-surface-elevated",
  ghost: "border-transparent text-muted hover:bg-surface hover:text-primary",
};

export function LinkButton({
  className,
  href,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
};

const badgeTones = {
  neutral: "border-border bg-surface text-muted",
  accent: "border-accent/30 bg-accent-soft text-accent-foreground",
  success: "border-success/30 bg-success-soft text-success",
  warning: "border-warning/30 bg-warning-soft text-warning-foreground",
  danger: "border-danger/30 bg-danger-soft text-danger",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  );
}
