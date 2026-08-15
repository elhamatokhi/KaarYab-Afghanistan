import Link from "next/link";
import { Container } from "@/components/ui";
import { formatLocalizedNumber } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import type { MessageKey } from "@/i18n/messages";

const footerSections = [
  {
    titleKey: "footer.navigate",
    links: [
      { href: "/", labelKey: "common.home" },
      { href: "/opportunities", labelKey: "common.opportunities" },
    ],
  },
  {
    titleKey: "footer.opportunities",
    links: [{ href: "/opportunities", labelKey: "footer.browse" }],
  },
  {
    titleKey: "footer.project",
    links: [
      { href: "/about", labelKey: "common.about" },
      { href: "/contact", labelKey: "common.contact" },
    ],
  },
] as const satisfies readonly {
  titleKey: MessageKey;
  links: readonly { href: string; labelKey: MessageKey }[];
}[];

export async function SiteFooter() {
  const { locale, t } = await getI18n();
  const year = formatLocalizedNumber(new Date().getFullYear(), locale);

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="text-base font-semibold text-primary">
            {t("app.name")}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            {t("footer.description")}
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.titleKey}>
            <h2 className="text-sm font-semibold text-primary">
              {t(section.titleKey)}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition hover:text-primary"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {t("footer.copyright")}
          </p>
          <p>{t("footer.tagline")}</p>
        </Container>
      </div>
    </footer>
  );
}
