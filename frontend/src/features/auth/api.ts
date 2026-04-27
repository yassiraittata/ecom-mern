import { apiGet, apiPost } from "@/lib/api";
import type { syncResponse } from "./types";

export function syncUser() {
  return apiPost<syncResponse>("/auth/sync", {});
}

export function getUser() {
  return apiGet<syncResponse>("/auth/me");
}
