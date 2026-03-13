import httpClient from "./httpClientService"
import { formatResponse } from "./responseHandlerService"
import type { SignInResponse } from "@/types/auth"
import { useAuthStore } from "@/stores/auth-store"

export interface SignInCredentials {
  email: string
  password: string
}

/**
 * Sign in with email and password.
 * On success, stores access_token, role, and permission in the auth store (and localStorage via persist).
 * Expects API to return body shape { access_token, role, permission } or { data: { access_token, role, permission } }.
 * @throws Error or formatted API error on failure
 */
export async function signIn(credentials: SignInCredentials): Promise<SignInResponse> {
  const res = await httpClient.request({
    method: "POST",
    url: "/auth/sign-in",
    data: credentials,
  })
  const response = formatResponse<SignInResponse>(res)
  const payload = response.data
  useAuthStore.getState().setAuth({
    access_token: payload.access_token,
    role: payload.role,
    permission: payload.permission ?? [],
  })
  return payload
}

/** Clear auth state (e.g. on sign out). */
export function signOut(): void {
  useAuthStore.getState().clearAuth()
}
