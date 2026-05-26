import type { SignInResponse, UserRole } from "@/types/auth"

/** Mock sign-in responses per role for development / testing */
export const signInMockByRole: Record<UserRole, SignInResponse> = {
  customer: {
    access_token: "mock_jwt_customer_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    role: "customer",
    // permission: [
    //   "events:view",
    //   "events:buy",
    //   "my-tickets:view",
    //   "profile:view",
    //   "profile:edit",
    // ],
  },
  organizer: {
    access_token: "mock_jwt_organizer_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    role: "organizer",
    // permission: [
    //   "events:view",
    //   "events:create",
    //   "events:edit",
    //   "events:delete",
    //   "events:manage",
    //   "profile:view",
    //   "profile:edit",
    // ],
  },
  staff: {
    access_token: "mock_jwt_staff_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    role: "staff",
    // permission: [
    //   "events:view",
    //   "events:scan",
    //   "events:check-in",
    //   "profile:view",
    // ],
  },
  admin: {
    access_token: "mock_jwt_admin_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    role: "admin",
    // permission: [
    //   "events:view",
    //   "events:create",
    //   "events:edit",
    //   "events:delete",
    //   "events:manage",
    //   "events:scan",
    //   "events:check-in",
    //   "my-tickets:view",
    //   "profile:view",
    //   "profile:edit",
    //   "admin:users",
    //   "admin:settings",
    // ],
  },
}

/** Default mock sign-in response (customer) */
export const signInMock: SignInResponse = signInMockByRole.customer
