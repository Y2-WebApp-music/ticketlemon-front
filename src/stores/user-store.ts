import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { SignInResponse } from "@/types/auth"

const USER_STORAGE_KEY = "ticketlemon_user"

export interface UserState {
  user_id: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  org_name: string | null
  setUserFromSignIn: (payload: SignInResponse) => void
  patchUser: (
    fields: Partial<
      Pick<UserState, "email" | "first_name" | "last_name" | "org_name">
    >
  ) => void
  clearUser: () => void
}

const initialState = {
  user_id: null as string | null,
  email: null as string | null,
  first_name: null as string | null,
  last_name: null as string | null,
  org_name: null as string | null,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserFromSignIn: (payload) =>
        set({
          user_id: payload.user_id ?? null,
          email: payload.email ?? null,
          first_name: payload.first_name ?? null,
          last_name: payload.last_name ?? null,
          org_name: payload.org_name ?? null,
        }),
      patchUser: (fields) => set((state) => ({ ...state, ...fields })),
      clearUser: () => set(initialState),
    }),
    {
      name: USER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user_id: state.user_id,
        email: state.email,
        first_name: state.first_name,
        last_name: state.last_name,
        org_name: state.org_name,
      }),
    }
  )
)
