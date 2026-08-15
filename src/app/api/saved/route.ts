import { requireUserSavedApi } from "@/features/auth/authorization";
import { jsonInternalError, jsonOk } from "@/features/opportunities/api";
import {
  getSavedOpportunitiesForUser,
  getSavedOpportunityIdsForUser,
} from "@/features/saved/data";

export async function GET() {
  const authorization = await requireUserSavedApi();

  if ("response" in authorization) {
    return authorization.response;
  }

  try {
    const [savedOpportunityIds, opportunities] = await Promise.all([
      getSavedOpportunityIdsForUser(authorization.userId),
      getSavedOpportunitiesForUser(authorization.userId),
    ]);

    return jsonOk({
      savedOpportunityIds,
      opportunities,
    });
  } catch {
    return jsonInternalError();
  }
}
