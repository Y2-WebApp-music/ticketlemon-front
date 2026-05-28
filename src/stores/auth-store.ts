import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Permission, UserRole } from "@/types/auth"
import { AUTH_STORAGE_KEY } from "@/constants/auth-storage.constant"

export interface AuthState {
  access_token: string | null
  role: UserRole | null
  permission: Permission[]
  setAuth: (data: { access_token: string; role: UserRole }) => void
  clearAuth: () => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
}

const initialState = {
  access_token: null as string | null,
  role: null as UserRole | null,
  permission: [] as Permission[],
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setAuth: (data) =>
        set({
          access_token: data.access_token,
          role: data.role,
          // permission: data.permission ?? [],
        }),
      clearAuth: () => set(initialState),
      hasPermission: (permission) => {
        const { permission: userPermissions } = get()
        return userPermissions.includes(permission)
      },
      hasAnyPermission: (permissions) => {
        const { permission: userPermissions } = get()
        return permissions.some((p) => userPermissions.includes(p))
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        access_token: state.access_token,
        role: state.role,
        permission: state.permission,
      }),
    }
  )
)

/** Selector: true if user has a valid access_token */
export const selectIsAuthenticated = (state: AuthState) =>
  Boolean(state.access_token)

/** Selector: current role */
export const selectRole = (state: AuthState) => state.role
