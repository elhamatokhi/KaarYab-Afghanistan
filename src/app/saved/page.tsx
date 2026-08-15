import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { getCurrentSession } from "@/features/auth/authorization";
import { getSavedOpportunitiesForUser } from "@/features/saved/data";
import { SavedOpportunitiesPage } from "@/features/saved/saved-opportunities-page";

export const metadata: Metadata = {
  title: "Saved opportunities | KaarYab Afghanistan",
  description:
    "Review opportunities you saved while using KaarYab Afghanistan.",
};

export default async function SavedPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/saved")}`);
  }

  if (session.user.role !== "USER") {
    redirect("/dashboard");
  }

  const opportunities = await getSavedOpportunitiesForUser(session.user.id);

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <Badge tone="accent">Saved list</Badge>
          <PageHeader
            eyebrow="Saved opportunities"
            title="Review opportunities you saved."
            description="Keep track of opportunities you want to revisit while browsing KaarYab."
          />
        </div>

        <SavedOpportunitiesPage
          accountKey={session.user.id}
          opportunities={opportunities}
        />
      </div>
    </PageContainer>
  );
}
