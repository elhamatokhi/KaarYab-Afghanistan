import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import { Suspense } from "react";
import { SiteNavigation } from "@/components/site-navigation";
import { Container } from "@/components/ui";
import { getI18n } from "@/i18n/server";

export async function SiteHeader() {
  const { t } = await getI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <Container className="relative flex min-h-16 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-md text-primary"
          aria-label={t("nav.homeAria")}
        >
          <span className="flex size-10 items-center justify-center rounded-md bg-action text-action-foreground">
            <BriefcaseBusiness aria-hidden="true" className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold sm:text-lg">
              KaarYab
            </span>
            <span className="block text-xs font-medium text-muted">
              {t("app.country")}
            </span>
          </span>
        </Link>
        <Suspense fallback={null}>
          <SiteNavigation />
        </Suspense>
      </Container>
    </header>
  );
}
