import { ZodError } from "zod";

export type OpportunityApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export type OpportunityApiErrorResponse = {
  error: {
    code: OpportunityApiErrorCode;
    message: string;
    fields?: Record<string, string[]>;
  };
};

export function jsonOk<TData>(data: TData, status = 200) {
  return Response.json({ data }, { status });
}

export function jsonCreated<TData>(data: TData) {
  return jsonOk(data, 201);
}

export function jsonNoContent() {
  return new Response(null, { status: 204 });
}

export function jsonBadRequest(message = "Invalid request.") {
  return jsonError("BAD_REQUEST", message, 400);
}

export function jsonValidationError(error: ZodError) {
  return Response.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        fields: zodErrorToFieldErrors(error),
      },
    } satisfies OpportunityApiErrorResponse,
    { status: 400 },
  );
}

export function jsonNotFound() {
  return jsonError("NOT_FOUND", "Opportunity not found.", 404);
}

export function jsonInternalError() {
  return jsonError(
    "INTERNAL_ERROR",
    "KaarYab could not complete this request right now.",
    500,
  );
}

export async function parseJsonRequest(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function jsonError(
  code: OpportunityApiErrorCode,
  message: string,
  status: number,
) {
  return Response.json(
    {
      error: {
        code,
        message,
      },
    } satisfies OpportunityApiErrorResponse,
    { status },
  );
}

function zodErrorToFieldErrors(error: ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const fieldName = issue.path.join(".") || "request";
    fieldErrors[fieldName] = [...(fieldErrors[fieldName] ?? []), issue.message];
  }

  return fieldErrors;
}
