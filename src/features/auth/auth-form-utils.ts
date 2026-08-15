import type { FieldErrors } from "react-hook-form";
import type { z } from "zod";

export function zodToHookFormErrors<TValues extends Record<string, unknown>>(
  error: z.ZodError,
  isField: (fieldName: string) => fieldName is Extract<keyof TValues, string>,
) {
  const fieldErrors = error.flatten().fieldErrors;

  return Object.entries(fieldErrors).reduce<FieldErrors<TValues>>(
    (errors, [fieldName, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : undefined;

      if (message && isField(fieldName)) {
        const typedErrors = errors as Record<string, { type: string; message: string }>;
        typedErrors[fieldName] = {
          type: "validation",
          message,
        };
      }

      return errors;
    },
    {},
  );
}
