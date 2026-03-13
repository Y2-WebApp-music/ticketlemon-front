import type { AxiosRequestConfig, AxiosResponse } from "axios";
import httpClient from "./httpClientService";
import { formatResponse } from "./responseHandlerService";
import type { SuccessResponse } from "@/types/responseHandler";

const apiService = {
  async fetchData<Response>(param: AxiosRequestConfig): Promise<SuccessResponse<Response>> {
    const response: AxiosResponse<Response> = await httpClient.request<Response>(param);

    return formatResponse<Response>(response);
  },
};

export default apiService;
