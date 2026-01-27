import { z } from "zod";

export const getWebhooksSchema = z.object({
  status: z.enum(["all", "success", "pending", "failed"]).optional(),
  eventType: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export const resendWebhookSchema = z.object({
  id: z.string(),
});

export const sendTestWebhookSchema = z.object({
  eventType: z.string(),
  url: z.string().url(),
});
