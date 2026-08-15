import { DuplicateEmailError, registerUser } from "@/features/auth/users";
import { registerInputSchema } from "@/features/auth/validation";
import {
  jsonBadRequest,
  jsonCreated,
  jsonInternalError,
  jsonValidationError,
  parseJsonRequest,
} from "@/features/opportunities/api";

export async function POST(request: Request) {
  const body = await parseJsonRequest(request);

  if (!body) {
    return jsonBadRequest("Request body must be valid JSON.");
  }

  const result = registerInputSchema.safeParse(body);

  if (!result.success) {
    return jsonValidationError(result.error);
  }

  try {
    const user = await registerUser(result.data);
    return jsonCreated(user);
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return jsonBadRequest("Registration could not be completed.");
    }

    return jsonInternalError();
  }
}
