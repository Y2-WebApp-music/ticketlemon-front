import { DEFAULT_PHONE_REGION } from "@/constants/phone-region.constant"

/** User roles from API */
export type UserRole = "customer" | "organizer" | "staff" | "admin"

/** Permission string – use for route/page access control (e.g. "events:create", "profile:edit") */
export type Permission = string

/** Expected sign-in API response */
export interface SignInResponse {
  access_token: string
  role: UserRole
  permission: Permission[]
}

export interface RegisterStep1DataForm {
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterStep2DataForm {
  firstName: string
  lastName: string
  phoneCountryCode: string
  phone: string
  dateOfBirth: Date | undefined
  gender: string
  subscribeNewsletter: boolean
  acceptTerms: boolean
}

export type RegisterDataForm = RegisterStep1DataForm & RegisterStep2DataForm

export const initialAuthDataForm: RegisterDataForm = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phoneCountryCode: DEFAULT_PHONE_REGION.dialCode,
  phone: "",
  dateOfBirth: undefined,
  gender: "",
  subscribeNewsletter: false,
  acceptTerms: false,
}

export interface OrganizerRegisterFormPayload {
  organizerName: string
  organizerEmail: string
  password: string
  subscribeNewsletter: boolean
  acceptTerms: boolean
}
