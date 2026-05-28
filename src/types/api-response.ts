import type { UserRole } from "./auth"
import type { MyTicketDetail, MyTicketItem } from "./my-ticket"

export interface ApiMessageResponse {
  message: string
}

export interface ApiSignUpResponse {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone_number: string
    birthdate: string
    gender: string
    profile_image?: string | null
    org_name?: string | null
    role?: string
  }
  auth: {
    id: string
    user_id: string
    email: string
    password: string
  }
}

export interface ApiEvent {
  id: string
  event_name: string
  category: string
  venue: string
  impact_genre: string
  age_restriction: number
  description: unknown
  poster_url: string | null
  thumbnail_url: string | null
  create_by_id: string
  create_by: string
  event_date_entries: Array<{
    id: string
    start_date: string
    end_date: string | null
  }>
  sale_date_entries: Array<{
    id: string
    start_date: string
    end_date: string | null
  }>
  ticket_types: Array<{
    id: string
    name: string
    price: number | string
    quantity: number | string
    detail: string | null
    use_for_event_date_time: string
    sale_ticket_on: string
    is_collapsed: boolean
  }>
  ticket_min_per_order: number | null
  ticket_max_per_order: number | null
  staff_code: string | null
  status:
    | "Scheduled"
    | "OnSale"
    | "SoldOut"
    | "Draft"
    | "Show"
    | "EventEnd"
    | "Cancel"
    | null
}

export interface ApiEventMutationResponse extends ApiMessageResponse {
  event: ApiEvent
}

export interface ApiGenerateStaffCodeResponse extends ApiMessageResponse {
  staffCode: string
}

export interface ApiTicket {
  id: string
  event_id: string
  user_id: string
  type: string
  price: number
  qr_code: string
  status: "Pending" | "Purchased" | "Cancelled"
  is_used: boolean
  created_at: string | null
  updated_at: string | null
}

export interface ApiTicketMutationResponse extends ApiMessageResponse {
  ticket: ApiTicket
}

export type ApiTicketListByUserResponse = MyTicketItem[]
export type ApiTicketDetailByUserEventResponse = MyTicketDetail

export interface ApiUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "user" | "organizer"
  phone_number: string
  birthdate: string
  gender: string
  profile_image: string | null
  org_name: string | null
}

export interface ApiUserUpdateResponse extends ApiMessageResponse {
  user: ApiUser
}

export interface ApiDeleteUserResponse extends ApiMessageResponse {
  user: ApiMessageResponse
  auth: ApiMessageResponse & {
    user?: {
      id: string
      user_id: string
      email: string
      password: string
    }
  }
}

export interface ApiLoginResponse {
  access_token: string
  role: UserRole
  user_id: string
  email?: string
  first_name?: string
  last_name?: string
}
