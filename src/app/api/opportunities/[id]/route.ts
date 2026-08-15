import { revalidatePath } from "next/cache";
import {
  deleteOpportunity,
  getOpportunityById,
  updateOpportunity,
} from "@/features/opportunities/data";
import {
  jsonBadRequest,
  jsonInternalError,
  jsonNoContent,
  jsonNotFound,
  jsonOk,
  jsonValidationError,
  parseJsonRequest,
} from "@/features/opportunities/api";
import { opportunityUpdateInputSchema } from "@/features/opportunities/validation";

type OpportunityRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: OpportunityRouteContext,
) {
  const { id } = await params;

  try {
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      return jsonNotFound();
    }

    return jsonOk(opportunity);
  } catch {
    return jsonInternalError();
  }
}

// Capstone MVP note: mutation endpoints are intentionally unprotected until
// authentication and authorization are added in a later phase.
export async function PATCH(
  request: Request,
  { params }: OpportunityRouteContext,
) {
  const { id } = await params;
  const body = await parseJsonRequest(request);

  if (!body) {
    return jsonBadRequest("Request body must be valid JSON.");
  }

  const result = opportunityUpdateInputSchema.safeParse(body);

  if (!result.success) {
    return jsonValidationError(result.error);
  }

  try {
    const opportunity = await updateOpportunity(id, result.data);

    if (!opportunity) {
      return jsonNotFound();
    }

    revalidateOpportunityPages(id);
    return jsonOk(opportunity);
  } catch {
    return jsonInternalError();
  }
}

// Capstone MVP note: mutation endpoints are intentionally unprotected until
// authentication and authorization are added in a later phase.
export async function DELETE(
  _request: Request,
  { params }: OpportunityRouteContext,
) {
  const { id } = await params;

  try {
    const deleted = await deleteOpportunity(id);

    if (!deleted) {
      return jsonNotFound();
    }

    revalidateOpportunityPages(id);
    return jsonNoContent();
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
