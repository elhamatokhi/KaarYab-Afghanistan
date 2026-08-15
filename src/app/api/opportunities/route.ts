import { revalidatePath } from "next/cache";
import {
  createOpportunity,
  getAllOpportunities,
} from "@/features/opportunities/data";
import { requireAdminMutation } from "@/features/auth/authorization";
import {
  jsonBadRequest,
  jsonCreated,
  jsonInternalError,
  jsonOk,
  jsonValidationError,
  parseJsonRequest,
} from "@/features/opportunities/api";
import { opportunityCreateInputSchema } from "@/features/opportunities/validation";

export async function GET() {
  try {
    const opportunities = await getAllOpportunities();
    return jsonOk(opportunities);
  } catch {
    return jsonInternalError();
  }
}

export async function POST(request: Request) {
  const authorizationError = await requireAdminMutation();

  if (authorizationError) {
    return authorizationError;
  }

  const body = await parseJsonRequest(request);

  if (!body) {
    return jsonBadRequest("Request body must be valid JSON.");
  }

  const result = opportunityCreateInputSchema.safeParse(body);

  if (!result.success) {
    return jsonValidationError(result.error);
  }

  try {
    const opportunity = await createOpportunity(result.data);
    revalidateOpportunityPages(opportunity.id);
    return jsonCreated(opportunity);
  } catch {
    return jsonInternalError();
  }
}

function revalidateOpportunityPages(opportunityId: string) {
  revalidatePath("/");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath("/dashboard");
}
