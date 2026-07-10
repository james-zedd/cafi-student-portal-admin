import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/constants";

export async function getAuthToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value;
}
