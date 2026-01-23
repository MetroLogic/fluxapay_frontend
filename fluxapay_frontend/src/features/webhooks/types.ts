export enum WebhookStatus {
  SUCCESS = "success",
  PENDING = "pending",
  FAILED = "failed",
}

export type WebhookEventType = 
  | "payment.succeeded" 
  | "payment.failed" 
  | "refund.processed" 
  | "subscription.created"
  | "subscription.cancelled";

export interface WebhookEvent {
  id: string;
  eventType: WebhookEventType;
  url: string;
  status: WebhookStatus;
  payload: Record<string, any>;
  response?: {
    status: number;
    body: string;
    headers?: Record<string, string>;
  };
  createdAt: string; // ISO date string
  attempts: number;
  lastAttemptAt?: string;
  nextRetryAt?: string;
}

export interface WebhookFilter {
  status?: WebhookStatus | "all";
  eventType?: WebhookEventType | "all";
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}
