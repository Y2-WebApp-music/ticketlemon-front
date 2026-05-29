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
import type { EventTicketType } from "@/types/event"

export interface EventSoldTicketCountResponse {
  count: number
  by_ticket_type: Record<string, number>
}

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
  user_id?: string
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

export interface EventsByUserQueryParams {
  search?: string
  status?: string
}

export async function getEventsByCreateById(
  userId: string,
  params?: EventsByUserQueryParams
): Promise<ApiEvent[]> {
  const response = await apiService.fetchData<ApiEvent[]>({
    method: "GET",
    url: `/api/event/create-by/${encodeURIComponent(userId)}`,
    params: {
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.status ? { status: params.status } : {}),
    },
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

export async function getEventSoldTicketCount(
  eventId: string
): Promise<EventSoldTicketCountResponse> {
  const response = await apiService.fetchData<EventSoldTicketCountResponse>({
    method: "GET",
    url: `/api/event/${eventId}/count-ticket`,
  })

  return response.data
}

export function mapApiEventToTicketTypes(
  apiEvent: ApiEvent,
  soldByType: Record<string, number> = {}
): EventTicketType[] {
  const eventDateMap = new Map(
    apiEvent.event_date_entries.map((entry) => [entry.id, entry.start_date])
  )
  const saleDateMap = new Map(
    apiEvent.sale_date_entries.map((entry) => [entry.id, entry.start_date])
  )

  return apiEvent.ticket_types.map((ticket) => {
    const total = Number(ticket.quantity) || 0
    const sold = soldByType[ticket.name] ?? 0

    return {
      id: ticket.id,
      title: ticket.name,
      description: ticket.detail ?? undefined,
      price: String(ticket.price),
      total,
      remaining: Math.max(0, total - sold),
      start_sale_date:
        saleDateMap.get(ticket.sale_ticket_on) ??
        apiEvent.sale_date_entries[0]?.start_date ??
        "",
      end_sale_date: null,
      event_date:
        eventDateMap.get(ticket.use_for_event_date_time) ??
        apiEvent.event_date_entries[0]?.start_date ??
        "",
      sold_out_date: null,
    }
  })
}
