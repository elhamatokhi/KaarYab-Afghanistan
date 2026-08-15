import type { Metadata } from "next";
import { Mail, MessageSquareText, Send, ShieldCheck } from "lucide-react";
import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact KaarYab Afghanistan | Project inquiries",
  description:
    "Contact the KaarYab Afghanistan capstone project team with feedback, partnership ideas, demo questions, and future opportunity-submission inquiries.",
};

const contactReasons = [
  {
    title: "Share feedback",
    description:
      "Suggest improvements to the demo experience, content structure, or accessibility.",
    icon: MessageSquareText,
  },
  {
    title: "Discuss future listings",
    description:
      "Ask how real opportunities could be submitted once database workflows exist.",
    icon: Send,
  },
  {
    title: "Ask project questions",
    description:
      "Contact the capstone team about scope, roadmap, or current demo limitations.",
    icon: Mail,
  },
];

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="space-y-4">
          <Badge tone="accent">Contact KaarYab</Badge>
          <PageHeader
            title="Send questions, feedback, or future collaboration ideas."
            description="KaarYab is still a capstone MVP using fictional demo opportunities. This contact page provides a professional local form experience before any real email service is connected."
          />
        </div>

        <section
          aria-labelledby="contact-reasons-heading"
          className="grid gap-4 md:grid-cols-3"
        >
          <h2 id="contact-reasons-heading" className="sr-only">
            Reasons to contact KaarYab
          </h2>
          {contactReasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-md bg-secondary-action text-secondary-action-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ContactForm />

          <aside className="space-y-4 rounded-lg border border-border bg-surface-elevated p-5">
            <div className="inline-flex size-10 items-center justify-center rounded-md bg-success-soft text-success">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <h2 className="text-xl font-semibold text-primary">
              Demo contact status
            </h2>
            <p className="text-sm leading-6 text-muted">
              Submissions are simulated locally. KaarYab does not send email,
              store messages, or create support tickets in this phase.
            </p>
            <p className="text-sm leading-6 text-muted">
              A real contact workflow can be added later after the project has a
              verified email service and clear data-handling requirements.
            </p>
          </aside>
        </section>
      </div>
    </PageContainer>
  );
}
