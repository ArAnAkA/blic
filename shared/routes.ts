import { z } from "zod";
import { insertUserSchema } from "./schema";

// API is minimal since the app is client-side static mostly
export const api = {
  health: {
    method: "GET" as const,
    path: "/api/health" as const,
    responses: {
      200: z.object({ status: z.string() }),
    },
  },
};

// Helper to build URLs (required by template)
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
