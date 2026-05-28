import { create } from "zustand"
import type { EventCardItem } from "@/types/event"

export interface StaffScanState {
  event: EventCardItem | null
  setEvent: (event: EventCardItem | null) => void
  reset: () => void
}

const initialState: Pick<StaffScanState, "event"> = {
  event: null,
}

export const useStaffScanStore = create<StaffScanState>()((set) => ({
  ...initialState,
  setEvent: (event) => set({ event }),
  reset: () => set(initialState),
}))
