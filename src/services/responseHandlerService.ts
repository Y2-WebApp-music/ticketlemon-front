import type {
  ErrorResponseProps,
  SuccessResponse,
} from "@/types/responseHandler"
import axios, { type AxiosResponse } from "axios"

export const formatError = async (
  err: unknown
): Promise<ErrorResponseProps> => {
  if (axios.isAxiosError(err)) {
    const response = err.response
    const payload = response?.data

    if (
      payload &&
      typeof payload === "object" &&
      Object.keys(payload).length > 0
    ) {
      return {
        status: payload.status,
        code: payload.code,
        message: payload.message,
        title: payload.title,
      }
    } else if (payload && payload instanceof Blob) {
      const json = await new Response(payload).json()
      return {
        status: json?.status ?? 0,
        code: json?.code ?? "000000",
        message: json?.message ?? "An unknown error occurred.",
        title: json?.title ?? "",
      }
    } else {
      const fallbackStatus = response?.status ?? err.status ?? 0
      const fallbackCode = err.code ?? "000000"
      const fallbackMessage =
        response?.statusText ?? err.message ?? "Unexpected error"
      const fallbackTitle = ""

      return {
        status: fallbackStatus,
        code: fallbackCode,
        message: fallbackMessage,
        title: fallbackTitle,
      }
    }
  } else {
    return {
      status: 0,
      code: "000000",
      message: "Unexpected error",
      title: "",
    }
  }
}

const isAxiosResponse = <T = unknown>(res: unknown): res is AxiosResponse<T> =>
  typeof res === "object" &&
  res !== null &&
  "status" in res &&
  "data" in res &&
  "statusText" in res

export const formatResponse = <T>(res: unknown): SuccessResponse<T> => {
  if (isAxiosResponse<T>(res)) {
    const payload = res.data as T

    if (res.headers["content-disposition"]) {
      return {
        data: payload,
        status: res.status,
        message: res.statusText,
        headers: {
          "content-disposition": res.headers["content-disposition"] as
            | string
            | undefined,
        },
      }
    } else {
      return {
        data: payload,
        status: res.status,
        message: res.statusText,
      }
    }
  }

  throw {
    status: 0,
    code: "000000",
    message: "Unexpected response",
    title: "",
  }
}
