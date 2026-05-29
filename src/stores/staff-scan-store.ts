import { create } from "zustand"
import type { ApiEvent } from "@/types/api-response"
import type { EventCardItem } from "@/types/event"
import { mapApiEventToEventCardItem } from "@/utils/mapEventCard"

export interface StaffScanState {
  event: EventCardItem | null
  eventDetail: ApiEvent | null
  setStaffEvent: (event: ApiEvent) => void
  reset: () => void
}

const initialState: Pick<StaffScanState, "event" | "eventDetail"> = {
  event: null,
  eventDetail: null,
}

export const useStaffScanStore = create<StaffScanState>()((set) => ({
  ...initialState,
  setStaffEvent: (event) =>
    set({
      event: mapApiEventToEventCardItem(event),
      eventDetail: event,
    }),
  reset: () => set(initialState),
}))
