import { create } from "zustand"
import type { StaffEvent } from "@/types/staff"

export interface StaffScanState {
  event: StaffEvent | null
  setEvent: (event: StaffEvent | null) => void
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
