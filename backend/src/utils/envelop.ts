export type ApiEnvelope<T> = {
  success: "success" | "error";
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: Array<{ message: string; code?: string }>;
};

export function ok<T>(
  data: T,
  meta: Record<string, unknown> = {},
): ApiEnvelope<T> {
  return {
    success: "success",
    data,
    meta,
  };
}

export function fail(message: string, code?: string): ApiEnvelope<null> {
  return {
    success: "error",
    data: null,
    errors: [{ message, code }],
  };
}
