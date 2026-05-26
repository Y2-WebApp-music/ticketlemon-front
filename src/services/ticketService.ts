import apiService from "./apiService"
import type {
  ApiMessageResponse,
  ApiTicket,
  ApiTicketDetailByUserEventResponse,
  ApiTicketListByUserResponse,
  ApiTicketMutationResponse,
} from "@/types/api-response"

export type TicketStatus = "Pending" | "Purchased" | "Cancelled"

export interface TicketRequestPayload {
  event_id: string
  user_id: string
  ticket_type_id: string
  qr_code?: string
  status?: TicketStatus
}

export type TicketUpdatePayload = Partial<TicketRequestPayload>

export async function getAllTickets(): Promise<ApiTicket[]> {
  const response = await apiService.fetchData<ApiTicket[]>({
    method: "GET",
    url: "/api/ticket",
  })

  return response.data
}

export async function getTicketById(id: string): Promise<ApiTicket> {
  const response = await apiService.fetchData<ApiTicket>({
    method: "GET",
    url: `/api/ticket/${id}`,
  })

  return response.data
}

export async function createTicket(
  payload: TicketRequestPayload
): Promise<ApiTicketMutationResponse> {
  const response = await apiService.fetchData<ApiTicketMutationResponse>({
    method: "POST",
    url: "/api/ticket",
    data: payload,
  })

  return response.data
}

export async function updateTicket(
  id: string,
  payload: TicketUpdatePayload
): Promise<ApiTicketMutationResponse> {
  const response = await apiService.fetchData<ApiTicketMutationResponse>({
    method: "PATCH",
    url: `/api/ticket/${id}`,
    data: payload,
  })

  return response.data
}

export async function deleteTicket(id: string): Promise<ApiMessageResponse> {
  const response = await apiService.fetchData<ApiMessageResponse>({
    method: "DELETE",
    url: `/api/ticket/${id}`,
  })

  return response.data
}

export async function checkInTicket(
  id: string
): Promise<ApiTicketMutationResponse> {
  const response = await apiService.fetchData<ApiTicketMutationResponse>({
    method: "POST",
    url: `/api/ticket/${id}/check-in`,
  })

  return response.data
}

export async function getTicketsByUserId(
  user_id: string
): Promise<ApiTicketListByUserResponse> {
  const response = await apiService.fetchData<ApiTicketListByUserResponse>({
    method: "GET",
    url: `/api/ticket/user/${user_id}`,
  })

  return response.data
}

export async function getTicketsByUserIdAndEventId(
  user_id: string,
  event_id: string
): Promise<ApiTicketDetailByUserEventResponse> {
  const response =
    await apiService.fetchData<ApiTicketDetailByUserEventResponse>({
      method: "GET",
      url: `/api/ticket/user/${user_id}/${event_id}`,
    })

  return response.data
}
