"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@/types";
import { DEFAULT_USERS, signSessionToken } from "@/lib/auth";

const AUTH_COOKIE_NAME = "labvault_session";

/**
 * Server Action to switch active user role and persist signed JWT session cookie.
 */
export async function switchSessionRole(role: UserRole) {
  const user = DEFAULT_USERS[role];
  if (!user) {
    return { success: false, error: "Invalid role specified" };
  }

  const token = await signSessionToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatarUrl: user.avatarUrl,
  });

  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath("/", "layout");
  return { success: true, user, role };
}

/**
 * Server Action to clear session cookie (Logout).
 */
export async function logoutSession() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  revalidatePath("/", "layout");
  return { success: true };
}
