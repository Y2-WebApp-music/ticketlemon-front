import apiService from "./apiService"
import type { SignInResponse } from "@/types/auth"
import type { ApiSignUpResponse } from "@/types/api-response"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpPayload {
  email: string
  first_name: string
  last_name: string
  phone_number: string
  birthdate: string
  gender: string
  profile_image?: string
  password: string
  org_name?: string
  role?: "customer" | "organizer"
}

export async function signIn(
  credentials: SignInCredentials
): Promise<SignInResponse> {
  const response = await apiService.fetchData<SignInResponse>({
    method: "POST",
    url: "/api/login",
    data: credentials,
  })
  const payload = response.data
  useAuthStore.getState().setAuth(payload)
  useUserStore.getState().setUserFromSignIn(payload)
  return payload
}

export async function signUp(
  payload: SignUpPayload
): Promise<ApiSignUpResponse> {
  const response = await apiService.fetchData<ApiSignUpResponse>({
    method: "POST",
    url: "/api/signup",
    data: payload,
  })

  return response.data
}

/** Notify the gateway and clear auth state. Local state is cleared even if the request fails. */
export async function signOut(): Promise<void> {
  try {
    await apiService.fetchData({
      method: "POST",
      url: "/api/logout",
    })
  } catch {
    // Ignore network/4xx errors — we still want to clear local state below.
  } finally {
    useAuthStore.getState().clearAuth()
    useUserStore.getState().clearUser()
  }
}
