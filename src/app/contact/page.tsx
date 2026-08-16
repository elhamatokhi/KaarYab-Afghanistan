import type { Metadata } from "next";
import { Mail, MessageSquareText, Send } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui";
import { getI18n } from "@/i18n/server";
import { ContactForm } from "./contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    title: `${t("contact.badge")} | KaarYab Afghanistan`,
    description: t("contact.description"),
  };
}

const contactReasons = [
  {
    titleKey: "contact.feedbackTitle",
    descriptionKey: "contact.feedbackDescription",
    icon: MessageSquareText,
  },
  {
    titleKey: "contact.listingsTitle",
    descriptionKey: "contact.listingsDescription",
    icon: Send,
  },
  {
    titleKey: "contact.questionsTitle",
    descriptionKey: "contact.questionsDescription",
    icon: Mail,
  },
] as const;

export default async function ContactPage() {
  const { t } = await getI18n();

  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="space-y-4">
          <PageHeader
            title={t("contact.title")}
            description={t("contact.description")}
          />
        </div>

        <section
          aria-labelledby="contact-reasons-heading"
          className="grid gap-4 md:grid-cols-3"
        >
          <h2 id="contact-reasons-heading" className="sr-only">
            {t("contact.reasons")}
          </h2>
          {contactReasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.titleKey}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-md bg-secondary-action text-secondary-action-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary">
                  {t(reason.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {t(reason.descriptionKey)}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6">
          <ContactForm />

         
        </section>
      </div>
    </PageContainer>
  );
}
