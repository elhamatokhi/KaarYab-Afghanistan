import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/features/auth/password";
import type { RegisterInput } from "@/features/auth/validation";
import type { UserRole } from "@/generated/prisma/enums";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Registration could not be completed.");
    this.name = "DuplicateEmailError";
  }
}

export type ProvisionUserInput = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new DuplicateEmailError();
  }

  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error) {
    logSafeUserDataError("create_registration_user", error);

    if (isUniqueConstraintError(error)) {
      throw new DuplicateEmailError();
    }

    throw error;
  }
}

export async function provisionUser(input: ProvisionUserInput) {
  const passwordHash = await hashPassword(input.password);

  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      passwordHash,
      role: input.role,
    },
    create: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

export async function getUserCredentialsByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
    },
  });
}

export function logSafeUserDataError(operation: string, error: unknown) {
  const errorCode = getErrorCode(error);
  console.error(
    `User data operation failed: operation=${operation} code=${errorCode}`,
  );
}

function isUniqueConstraintError(error: unknown) {
  return getErrorCode(error) === "P2002";
}

function getErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return "unknown";
}
