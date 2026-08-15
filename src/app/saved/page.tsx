import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/ui";
import { getCurrentSession } from "@/features/auth/authorization";
import { getOpportunityTranslations } from "@/features/opportunities/data";
import { localizeDemoOpportunities } from "@/features/opportunities/demo-localization";
import { getSavedOpportunitiesForUser } from "@/features/saved/data";
import { SavedOpportunitiesPage } from "@/features/saved/saved-opportunities-page";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Saved opportunities | KaarYab Afghanistan",
  description:
    "Review opportunities you saved while using KaarYab Afghanistan.",
};

export default async function SavedPage() {
  const session = await getCurrentSession();
  const { locale, t } = await getI18n();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/saved")}`);
  }

  if (session.user.role !== "USER") {
    redirect("/dashboard");
  }

  const opportunities = await getSavedOpportunitiesForUser(session.user.id);
  const storedTranslations =
    locale === "en" ? {} : await getOpportunityTranslations(locale);
  const localizedOpportunities = localizeDemoOpportunities(
    opportunities,
    locale,
    storedTranslations,
  );

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <PageHeader
            title={t("saved.title")}
            description={t("saved.description")}
          />
        </div>

        <SavedOpportunitiesPage
          accountKey={session.user.id}
          opportunities={localizedOpportunities}
        />
      </div>
    </PageContainer>
  );
}
