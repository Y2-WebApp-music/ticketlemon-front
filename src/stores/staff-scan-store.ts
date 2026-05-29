import { create } from "zustand"
import type { ApiCheckInResponse, ApiEvent } from "@/types/api-response"
import type { EventCardItem } from "@/types/event"
import { mapApiEventToEventCardItem } from "@/utils/mapEventCard"

export interface StaffScanState {
  event: EventCardItem | null
  eventDetail: ApiEvent | null
  checkInResult: ApiCheckInResponse | null
  setStaffEvent: (event: ApiEvent) => void
  setCheckInResult: (result: ApiCheckInResponse) => void
  reset: () => void
}

const initialState: Pick<
  StaffScanState,
  "event" | "eventDetail" | "checkInResult"
> = {
  event: null,
  eventDetail: null,
  checkInResult: null,
}

export const useStaffScanStore = create<StaffScanState>()((set) => ({
  ...initialState,
  setStaffEvent: (event) =>
    set({
      event: mapApiEventToEventCardItem(event),
      eventDetail: event,
    }),
  setCheckInResult: (result) => set({ checkInResult: result }),
  reset: () => set(initialState),
}))
