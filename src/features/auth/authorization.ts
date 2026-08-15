import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getAdminAuthorizationStatus,
  getUserSavedAuthorizationStatus,
} from "@/features/auth/access-control";

export {
  getAdminAuthorizationStatus,
  getRoleInterfacePermissions,
  getUserSavedAuthorizationStatus,
  isAdminRole,
  isUserRole,
} from "@/features/auth/access-control";

export async function getCurrentSession() {
  return auth();
}

export async function getCurrentUserRole() {
  const session = await getCurrentSession();
  return session?.user?.role;
}

export async function requireAdminPage(pathname: string) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session;
}

export async function requireAdminMutation() {
  const session = await getCurrentSession();
  const status = getAdminAuthorizationStatus(session);

  if (status === "unauthenticated") {
    return Response.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        },
      },
      { status: 401 },
    );
  }

  if (status === "forbidden") {
    return Response.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Administrator access is required.",
        },
      },
      { status: 403 },
    );
  }

  return null;
}

export async function requireUserSavedApi() {
  const session = await getCurrentSession();
  const status = getUserSavedAuthorizationStatus(session);

  if (status === "unauthenticated") {
    return {
      response: Response.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication is required.",
          },
        },
        { status: 401 },
      ),
    };
  }

  if (status === "forbidden") {
    return {
      response: Response.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Saved opportunities are available for user accounts.",
          },
        },
        { status: 403 },
      ),
    };
  }

  return {
    userId: session?.user?.id ?? "",
  };
}
