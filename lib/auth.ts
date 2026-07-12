import { cookies } from "next/headers";
import { AUTH_COOKIE, USER_COOKIE } from "@/lib/constants";
import type { AuthUser } from "@/lib/types/user";

export async function getAuthToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
