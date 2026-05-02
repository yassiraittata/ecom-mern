import { apiGet, apiPost } from "@/lib/api";
import type { SyncResponse, UserResponse } from "./types";

export function syncUser() {
  return apiPost<SyncResponse>("/auth/sync", {});
}

export function getUser() {
  return apiGet<UserResponse>("/auth/me");
}
