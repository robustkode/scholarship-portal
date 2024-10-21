import { verifyPassword } from "@/lib/utils";
import {
  LoginError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
} from "./errors";
import {
  createModeratorToken,
  createUser,
  deleteModerator,
  fetchModerators,
  getSignInTokenByEmail,
  getUserByEmail,
  updatePassword,
} from "@/data-access/users";
import { adminRole, applicationName } from "@/config";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { sendEmail } from "@/lib/email";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "@/data-access/reset-tokens";
import { createTransaction } from "@/data-access/utils";
import { assertAdmin } from "./authorization";
import { ModeratorSignUpEmail } from "@/emails/moderator-signup";

export async function signInUsecase(email, password) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new LoginError();
  }

  const isCorrectPassword = await verifyPassword(
    user.passwordHash,
    user.salt,
    password
  );

  if (!isCorrectPassword) {
    throw new LoginError();
  }

  return { id: user.id };
}

export async function signUpUseCase({ email, password, token }) {
  const signUpToken = await getSignInTokenByEmail(email);
  if (!signUpToken) {
    throw new NotFoundError("The token doesn't exist.");
  }
  const { role, token: t } = signUpToken;
  if (t !== token) {
    throw new NotFoundError("The token doesn't exist.");
  }
  await createUser(email, password, role);
}

export async function resetPasswordUseCase(email) {
  const user = await getUserByEmail(email);

  //? public error
  if (!user) {
    throw new AuthenticationError();
  }

  const token = await createPasswordResetToken(user.id);
  await sendEmail(
    email,
    `Your password reset link for ${applicationName}`,
    <ResetPasswordEmail token={token} />
  );
}

export async function changePasswordUseCase(token, password) {
  const tokenEntry = await getPasswordResetToken(token);

  if (!tokenEntry) {
    throw new AuthenticationError();
  }

  const userId = tokenEntry.userId;

  await createTransaction(async (trx) => {
    await deletePasswordResetToken(token, trx);
    await updatePassword(userId, password, trx);
  });
}

export async function createModeratorTokenUseCase({ userId, email }) {
  await assertAdmin();
  const { token, email: inviteEmail } = await createModeratorToken(email);
  await sendEmail(
    inviteEmail,
    `Sign up as a moderator,  ${applicationName}`,
    <ModeratorSignUpEmail token={token} />
  );
}

export async function fireModeratorUseCase({ email }) {
  await assertAdmin();
  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFoundError("No moderator by this email");
  }

  if (user.role === adminRole) {
    throw new AuthorizationError("Not Authrozed to take this action");
  }

  await deleteModerator(email);
}

export async function fetchModeratorsUseCase() {
  await assertAdmin();
  return await fetchModerators();
}
