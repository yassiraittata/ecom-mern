import axios, { type AxiosRequestConfig } from "axios";
import type { ApiEnvelop } from "./types";
import { env } from "./env";

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setApiTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

const api = axios.create({
  baseURL: env.backendBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  if (!tokenGetter) return config;

  const token = await tokenGetter();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      "An error occurred"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong!";
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const response = await api.get<ApiEnvelop<T>>(url, config);
    if (response.data.status === "error" || !response.data.data) {
      throw new Error(response.data.errors?.[0].message || "An error occurred");
    }
    return response.data.data;
  } catch (error) {
    console.error("API GET Error:", error);
    throw new Error(getErrorMessage(error), { cause: error });
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig,
) {
  try {
    const response = await api.post<ApiEnvelop<TResponse>>(url, body, config);
    if (response.data.status === "error") {
      throw new Error(response.data.errors?.[0].message || "An error occurred");
    }
    return response.data.data;
  } catch (error) {
    console.error("API GET Error:", error);
    throw new Error(getErrorMessage(error), { cause: error });
  }
}

export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig,
) {
  try {
    const response = await api.put<ApiEnvelop<TResponse>>(url, body, config);
    if (response.data.status === "error") {
      throw new Error(response.data.errors?.[0].message || "An error occurred");
    }
    return response.data.data;
  } catch (error) {
    console.error("API GET Error:", error);
    throw new Error(getErrorMessage(error), { cause: error });
  }
}
