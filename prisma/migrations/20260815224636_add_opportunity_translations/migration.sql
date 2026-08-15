-- CreateTable
CREATE TABLE "OpportunityTranslation" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpportunityTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpportunityTranslation_locale_idx" ON "OpportunityTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityTranslation_opportunityId_locale_key" ON "OpportunityTranslation"("opportunityId", "locale");

-- AddForeignKey
ALTER TABLE "OpportunityTranslation" ADD CONSTRAINT "OpportunityTranslation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
