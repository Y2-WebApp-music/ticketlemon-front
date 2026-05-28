import apiService from "./apiService"
import type {
  ApiEvent,
  ApiEventMutationResponse,
  ApiGenerateStaffCodeResponse,
  ApiMessageResponse,
} from "@/types/api-response"
import type {
  EventSellingQueryParams,
  SellingTableResponse,
} from "@/types/organizer"

export interface EventDateEntryRequest {
  id: string
  start_date: string
  end_date: string | null
}

export interface SaleDateEntryRequest {
  id: string
  start_date: string
  end_date: string | null
}

export interface EventTicketTypeRequest {
  id: string
  name: string
  price: string
  quantity: string
  detail: string | null
  use_for_event_date_time: string
  sale_ticket_on: string
  is_collapsed: boolean
}

export interface EventRequestPayload {
  event_name: string
  category: string
  venue: string
  impact_genre: string
  age_restriction: number | string
  description: unknown
  poster_url?: File | Blob | string
  thumbnail_url?: File | Blob | string
  event_date_entries: EventDateEntryRequest[]
  sale_date_entries: SaleDateEntryRequest[]
  ticket_types: EventTicketTypeRequest[]
  ticket_min_per_order?: string
  ticket_max_per_order?: string
  staff_code: string
  /** Creator fields (optional) */
  create_by_id?: string
  create_by?: string
}

type EventUpdatePayload = Partial<EventRequestPayload>

function toFormData<T extends object>(payload: T): FormData {
  const formData = new FormData()

  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value)
      return
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value))
      return
    }

    formData.append(key, String(value))
  })

  return formData
}

export async function getAllEvents(): Promise<ApiEvent[]> {
  const response = await apiService.fetchData<ApiEvent[]>({
    method: "GET",
    url: "/api/event",
  })

  return response.data
}

export async function getEventById(id: string): Promise<ApiEvent> {
  const response = await apiService.fetchData<ApiEvent>({
    method: "GET",
    url: `/api/event/${id}`,
  })

  return response.data
}

export async function createEvent(
  payload: EventRequestPayload
): Promise<ApiEventMutationResponse> {
  const response = await apiService.fetchData<ApiEventMutationResponse>({
    method: "POST",
    url: "/api/event",
    data: toFormData(payload),
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response.data
}

export async function updateEvent(
  id: string,
  payload: EventUpdatePayload
): Promise<ApiEventMutationResponse> {
  const response = await apiService.fetchData<ApiEventMutationResponse>({
    method: "PATCH",
    url: `/api/event/${id}`,
    data: toFormData(payload),
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response.data
}

export async function deleteEvent(id: string): Promise<ApiMessageResponse> {
  const response = await apiService.fetchData<ApiMessageResponse>({
    method: "DELETE",
    url: `/api/event/${id}`,
  })

  return response.data
}

export async function generateStaffCode(
  id: string
): Promise<ApiGenerateStaffCodeResponse> {
  const response = await apiService.fetchData<ApiGenerateStaffCodeResponse>({
    method: "PATCH",
    url: `/api/event/${id}/generate-staff-code`,
  })

  return response.data
}

export async function staffSignIn(payload: {
  staff_code: string
}): Promise<ApiMessageResponse> {
  const response = await apiService.fetchData<ApiMessageResponse>({
    method: "POST",
    url: "/api/event/staff-signin",
    data: payload,
  })

  return response.data
}

export async function searchEvents(keyword: string): Promise<ApiEvent[]> {
  const response = await apiService.fetchData<ApiEvent[]>({
    method: "GET",
    url: "/api/event/search",
    params: { keyword },
  })

  return response.data
}

export async function getEventsByCreateById(
  create_by_id: string
): Promise<ApiEvent[]> {
  const response = await apiService.fetchData<ApiEvent[]>({
    method: "GET",
    url: `/api/event/create-by/${create_by_id}`,
  })

  return response.data
}

export async function getEventSelling(
  eventId: string,
  params?: EventSellingQueryParams
): Promise<SellingTableResponse> {
  const response = await apiService.fetchData<SellingTableResponse>({
    method: "GET",
    url: `/api/event/${eventId}/selling`,
    params,
  })

  return response.data
}
