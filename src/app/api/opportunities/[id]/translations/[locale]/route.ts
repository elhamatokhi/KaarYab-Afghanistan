import { revalidatePath } from "next/cache";
import { requireAdminMutation } from "@/features/auth/authorization";
import {
  getOpportunityById,
  updateOpportunityCanonicalSharedFields,
  upsertOpportunityTranslation,
} from "@/features/opportunities/data";
import {
  jsonBadRequest,
  jsonInternalError,
  jsonNotFound,
  jsonOk,
  jsonValidationError,
  parseJsonRequest,
} from "@/features/opportunities/api";
import { opportunityCreateInputSchema } from "@/features/opportunities/validation";
import { isSupportedLocale, type Locale } from "@/i18n/config";

type OpportunityTranslationRouteContext = {
  params: Promise<{ id: string; locale: string }>;
};

export async function PATCH(
  request: Request,
  { params }: OpportunityTranslationRouteContext,
) {
  const authorizationError = await requireAdminMutation();

  if (authorizationError) {
    return authorizationError;
  }

  const { id, locale: localeParam } = await params;

  if (!isSupportedLocale(localeParam) || localeParam === "en") {
    return jsonBadRequest("Unsupported translation locale.");
  }

  const body = await parseJsonRequest(request);

  if (!body) {
    return jsonBadRequest("Request body must be valid JSON.");
  }

  const result = opportunityCreateInputSchema.safeParse(body);

  if (!result.success) {
    return jsonValidationError(result.error);
  }

  const input = result.data;

  try {
    const existingOpportunity = await getOpportunityById(id);

    if (!existingOpportunity) {
      return jsonNotFound();
    }

    const opportunity = await updateOpportunityCanonicalSharedFields(id, {
      applyLink: input.applyLink,
      category: input.category,
      deadline: input.deadline,
      employmentType: input.employmentType,
      featured: input.featured,
      workMode: input.workMode,
    });

    if (!opportunity) {
      return jsonNotFound();
    }

    const translation = await upsertOpportunityTranslation({
      opportunityId: id,
      locale: localeParam as Locale,
      input: {
        country: input.country,
        description: input.description,
        location: input.location,
        organization: input.organization,
        requirements: input.requirements,
        tags: input.tags,
        title: input.title,
      },
    });

    if (!translation) {
      return jsonNotFound();
    }

    revalidateOpportunityPages(id);
    return jsonOk({ ...opportunity, ...translation });
  } catch {
    return jsonInternalError();
  }
}

function revalidateOpportunityPages(opportunityId: string) {
  revalidatePath("/");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath(`/opportunities/${opportunityId}/edit`);
  revalidatePath("/dashboard");
}
