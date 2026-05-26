import apiService from "./apiService"
import type {
  ApiDeleteUserResponse,
  ApiMessageResponse,
  ApiUser,
  ApiUserUpdateResponse,
} from "@/types/api-response"

export interface StaffSignInPayload {
  staff_code: string
}

export interface UserUpdatePayload {
  email?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  birthdate?: string
  gender?: string
  profile_image?: string
}

export async function staffSignIn(
  payload: StaffSignInPayload
): Promise<ApiMessageResponse> {
  const response = await apiService.fetchData<ApiMessageResponse>({
    method: "POST",
    url: "/api/event/staff-signin",
    data: payload,
  })

  return response.data
}

export async function getAllUsers(): Promise<ApiUser[]> {
  const response = await apiService.fetchData<ApiUser[]>({
    method: "GET",
    url: "/api/user",
  })

  return response.data
}

export async function getUserById(id: string): Promise<ApiUser> {
  const response = await apiService.fetchData<ApiUser>({
    method: "GET",
    url: `/api/user/${id}`,
  })

  return response.data
}

export async function updateUser(
  id: string,
  payload: UserUpdatePayload
): Promise<ApiUserUpdateResponse> {
  const response = await apiService.fetchData<ApiUserUpdateResponse>({
    method: "PATCH",
    url: `/api/user/${id}`,
    data: payload,
  })

  return response.data
}

export async function deleteUser(id: string): Promise<ApiDeleteUserResponse> {
  const response = await apiService.fetchData<ApiDeleteUserResponse>({
    method: "DELETE",
    url: `/api/user/${id}`,
  })

  return response.data
}
