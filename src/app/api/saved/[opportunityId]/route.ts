import { requireUserSavedApi } from "@/features/auth/authorization";
import {
  jsonInternalError,
  jsonNotFound,
  jsonOk,
} from "@/features/opportunities/api";
import {
  removeSavedOpportunityForUser,
  saveOpportunityForUser,
} from "@/features/saved/data";

type SavedOpportunityRouteContext = {
  params: Promise<{ opportunityId: string }>;
};

export async function POST(
  _request: Request,
  { params }: SavedOpportunityRouteContext,
) {
  const authorization = await requireUserSavedApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  const { opportunityId } = await params;

  try {
    const result = await saveOpportunityForUser(
      authorization.userId,
      opportunityId,
    );

    if (result.status === "missing-opportunity") {
      return jsonNotFound();
    }

    return jsonOk({ savedOpportunityIds: result.savedOpportunityIds });
  } catch {
    return jsonInternalError();
  }
}

export async function DELETE(
  _request: Request,
  { params }: SavedOpportunityRouteContext,
) {
  const authorization = await requireUserSavedApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  const { opportunityId } = await params;

  try {
    const result = await removeSavedOpportunityForUser(
      authorization.userId,
      opportunityId,
    );

    if (result.status === "missing-opportunity") {
      return jsonNotFound();
    }

    return jsonOk({ savedOpportunityIds: result.savedOpportunityIds });
  } catch {
    return jsonInternalError();
  }
}
