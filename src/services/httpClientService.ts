import axios, { AxiosError, type AxiosInstance } from "axios"
import { formatError } from "./responseHandlerService"
import type { ErrorResponseProps } from "@/types/responseHandler"
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from "@/configs/app.config"
import { useAuthStore } from "@/stores/auth-store"

const httpClient: AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

httpClient.interceptors.request.use(
  (config) => {
    config.headers["Accept-Language"] = "en-US,en;q=0.9,th;q=0.8"
    const token = useAuthStore.getState().access_token
    if (token) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

httpClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().clearAuth()
    }
    const formatted = await formatError(err)
    return Promise.reject<ErrorResponseProps>(formatted)
  }
)

export default httpClient
