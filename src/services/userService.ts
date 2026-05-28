import apiService from "./apiService"
import type { UserProfile } from "@/types/profile"
import { DEFAULT_PHONE_REGION } from "@/constants/phone-region.constant"

interface ApiUser {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  profile_image?: string | null
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const response = await apiService.fetchData<ApiUser>({
    method: "GET",
    url: `/api/user/${userId}`,
  })

  const data = response.data
  const dialCode = DEFAULT_PHONE_REGION.dialCode
  const rawPhone = data.phone_number ?? ""
  const phone = rawPhone.startsWith(dialCode)
    ? rawPhone.slice(dialCode.length)
    : rawPhone

  return {
    image_url: data.profile_image ?? "",
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone_country_code: dialCode,
    phone,
    bio: "",
  }
}
