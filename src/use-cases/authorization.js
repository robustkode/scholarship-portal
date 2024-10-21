import { adminRole, moderatorRole } from "@/config";
import { getCurrentUser } from "@/lib/session";
import { AuthorizationError, NotFoundError } from "@/use-cases/errors";

export async function assertAdmin() {
  if (!(await isAdmin())) {
    throw new AuthorizationError();
  }
}

export async function assertModerator() {
  if (!(await isModerator())) {
    throw new AuthorizationError();
  }
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === adminRole;
}

export async function isModerator() {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === moderatorRole || user.role === adminRole;
}
