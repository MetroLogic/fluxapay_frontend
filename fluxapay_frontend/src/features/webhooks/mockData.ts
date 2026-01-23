import { WebhookEvent, WebhookStatus } from "./types";

export const mockWebhooks: WebhookEvent[] = [
    {
        id: "wh_1234567890",
        eventType: "payment.succeeded",
        url: "https://api.merchant.com/webhooks/payments",
        status: WebhookStatus.SUCCESS,
        payload: {
            id: "pay_987654321",
            amount: 5000,
            currency: "USD",
            status: "succeeded",
            customer: "cus_123abc"
        },
        response: {
            status: 200,
            body: '{"received": true}',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        attempts: 1,
        lastAttemptAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: "wh_2234567891",
        eventType: "payment.failed",
        url: "https://api.merchant.com/webhooks/payments",
        status: WebhookStatus.FAILED,
        payload: {
            id: "pay_887654321",
            amount: 12000,
            currency: "USD",
            status: "failed",
            reason: "insufficient_funds",
            customer: "cus_456def"
        },
        response: {
            status: 500,
            body: '{"error": "Internal Server Error"}',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        attempts: 3,
        lastAttemptAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        nextRetryAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
    },
    {
        id: "wh_3234567892",
        eventType: "subscription.created",
        url: "https://app.merchant.io/hooks/subs",
        status: WebhookStatus.PENDING,
        payload: {
            id: "sub_11223344",
            plan: "pro_monthly",
            status: "active",
            customer: "cus_789ghi"
        },
        createdAt: new Date(Date.now() - 1000 * 30).toISOString(), // 30 seconds ago
        attempts: 0,
    },
    {
        id: "wh_4234567893",
        eventType: "refund.processed",
        url: "https://api.merchant.com/webhooks/refunds",
        status: WebhookStatus.SUCCESS,
        payload: {
            id: "ref_55667788",
            payment_id: "pay_987654321",
            amount: 5000,
            status: "succeeded"
        },
        response: {
            status: 200,
            body: '{"status": "ok"}',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        attempts: 1,
        lastAttemptAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: "wh_5234567894",
        eventType: "payment.succeeded",
        url: "https://legacy-api.merchant.com/callbacks",
        status: WebhookStatus.FAILED,
        payload: {
            id: "pay_33445566",
            amount: 2500,
            currency: "EUR",
            status: "succeeded"
        },
        response: {
            status: 404,
            body: 'Not Found',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        attempts: 2,
        lastAttemptAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        nextRetryAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    }
];
