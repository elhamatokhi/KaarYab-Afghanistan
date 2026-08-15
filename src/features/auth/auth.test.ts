import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as registerRoutePost } from "@/app/api/register/route";
import {
  getAdminAuthorizationStatus,
  getRoleInterfacePermissions,
  getUserSavedAuthorizationStatus,
} from "@/features/auth/access-control";
import {
  getDemoAccountsFromEnv,
  getDemoLoginFormValues,
} from "@/features/auth/demo-accounts";
import { hashPassword, verifyPassword } from "@/features/auth/password";
import {
  DuplicateEmailError,
  provisionUser,
  registerUser,
} from "@/features/auth/users";
import {
  loginInputSchema,
  registerInputSchema,
} from "@/features/auth/validation";

const mockPrisma = vi.hoisted(() => ({
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

describe("auth validation", () => {
  it("normalizes registration email addresses", () => {
    const result = registerInputSchema.safeParse({
      name: "Test User",
      email: "  USER@Example.COM ",
      password: "Password123",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects weak registration input", () => {
    const result = registerInputSchema.safeParse({
      name: "A",
      email: "not-an-email",
      password: "password",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes login email addresses", () => {
    const result = loginInputSchema.safeParse({
      email: "  LOGIN@Example.COM ",
      password: "anything",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("login@example.com");
    }
  });
});

describe("password hashing", () => {
  it("hashes and verifies passwords without storing plaintext", async () => {
    const passwordHash = await hashPassword("Password123");

    expect(passwordHash).not.toBe("Password123");
    await expect(verifyPassword("Password123", passwordHash)).resolves.toBe(true);
    await expect(verifyPassword("WrongPassword123", passwordHash)).resolves.toBe(
      false,
    );
  });
});

describe("registration data access", () => {
  beforeEach(() => {
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.user.create.mockReset();
    mockPrisma.user.upsert.mockReset();
  });

  it("creates USER accounts by default", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "USER",
    });

    await expect(
      registerUser({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      }),
    ).resolves.toMatchObject({
      email: "test@example.com",
      role: "USER",
    });

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "test@example.com",
          role: "USER",
        }),
      }),
    );
    expect(mockPrisma.user.create.mock.calls[0]?.[0].data.passwordHash).not.toBe(
      "Password123",
    );
  });

  it("rejects duplicate email addresses safely", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

    await expect(
      registerUser({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      }),
    ).rejects.toBeInstanceOf(DuplicateEmailError);

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it("returns 201 for successful registration requests", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Route User",
      email: "route@example.com",
      role: "USER",
    });

    const response = await registerRoutePost(
      new Request("http://localhost/api/register", {
        method: "POST",
        body: JSON.stringify({
          name: "Route User",
          email: "route@example.com",
          password: "Password123",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data).toMatchObject({
      email: "route@example.com",
      role: "USER",
    });
    expect(JSON.stringify(body)).not.toContain("Password123");
  });

  it("returns 400 for duplicate registration requests", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

    const response = await registerRoutePost(
      new Request("http://localhost/api/register", {
        method: "POST",
        body: JSON.stringify({
          name: "Route User",
          email: "route@example.com",
          password: "Password123",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.not.toContain("existing-user");
  });

  it("provisions demo users idempotently with correct roles", async () => {
    mockPrisma.user.upsert.mockResolvedValueOnce({
      id: "demo-user",
      email: "demo.user@example.com",
      role: "USER",
    });
    mockPrisma.user.upsert.mockResolvedValueOnce({
      id: "demo-admin",
      email: "demo.admin@example.com",
      role: "ADMIN",
    });

    const accounts = getDemoAccountsFromEnv({
      DEMO_USER_NAME: "Demo User",
      DEMO_USER_EMAIL: "DEMO.USER@EXAMPLE.COM",
      DEMO_USER_PASSWORD: "UserPassword123",
      DEMO_ADMIN_NAME: "Demo Admin",
      DEMO_ADMIN_EMAIL: "DEMO.ADMIN@EXAMPLE.COM",
      DEMO_ADMIN_PASSWORD: "AdminPassword123",
    });

    await Promise.all(
      accounts.map((account) =>
        provisionUser({
          name: account.name,
          email: account.email,
          password: account.password,
          role: account.role,
        }),
      ),
    );

    expect(accounts.map((account) => [account.email, account.role])).toEqual([
      ["demo.user@example.com", "USER"],
      ["demo.admin@example.com", "ADMIN"],
    ]);
    expect(mockPrisma.user.upsert).toHaveBeenCalledTimes(2);
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "demo.user@example.com" },
        update: expect.objectContaining({ role: "USER" }),
        create: expect.objectContaining({ role: "USER" }),
      }),
    );
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "demo.admin@example.com" },
        update: expect.objectContaining({ role: "ADMIN" }),
        create: expect.objectContaining({ role: "ADMIN" }),
      }),
    );
  });

  it("maps demo fill buttons to login form values", () => {
    expect(
      getDemoLoginFormValues({
        email: "demo.user@example.com",
        password: "UserPassword123",
      }),
    ).toEqual({
      email: "demo.user@example.com",
      password: "UserPassword123",
    });
  });
});

describe("authorization decisions", () => {
  it("distinguishes unauthenticated, user, and admin sessions", () => {
    expect(getAdminAuthorizationStatus(null)).toBe("unauthenticated");
    expect(
      getAdminAuthorizationStatus({ user: { role: "USER" } }),
    ).toBe("forbidden");
    expect(
      getAdminAuthorizationStatus({ user: { role: "ADMIN" } }),
    ).toBe("authorized");
  });

  it("allows only USER accounts to use saved opportunities", () => {
    expect(getUserSavedAuthorizationStatus(null)).toBe("unauthenticated");
    expect(
      getUserSavedAuthorizationStatus({ user: { role: "ADMIN" } }),
    ).toBe("forbidden");
    expect(
      getUserSavedAuthorizationStatus({ user: { role: "USER" } }),
    ).toBe("authorized");
  });

  it("keeps management and saved controls role-specific", () => {
    expect(getRoleInterfacePermissions(undefined)).toEqual({
      canUseSavedOpportunities: false,
      canManageOpportunities: false,
    });
    expect(getRoleInterfacePermissions("USER")).toEqual({
      canUseSavedOpportunities: true,
      canManageOpportunities: false,
    });
    expect(getRoleInterfacePermissions("ADMIN")).toEqual({
      canUseSavedOpportunities: false,
      canManageOpportunities: true,
    });
  });
});
