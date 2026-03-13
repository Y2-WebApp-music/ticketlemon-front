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
