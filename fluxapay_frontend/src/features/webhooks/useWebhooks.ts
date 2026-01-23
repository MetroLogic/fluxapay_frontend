import { useState, useMemo } from "react";
import { WebhookEvent, WebhookFilter, WebhookStatus, WebhookEventType } from "./types";
import { mockWebhooks } from "./mockData";

export const useWebhooks = () => {
    const [webhooks, setWebhooks] = useState<WebhookEvent[]>(mockWebhooks);
    const [filters, setFilters] = useState<WebhookFilter>({
        status: "all",
        eventType: "all",
        search: "",
    });

    const filteredWebhooks = useMemo(() => {
        return webhooks.filter((webhook) => {
            // Filter by status
            if (filters.status && filters.status !== "all" && webhook.status !== filters.status) {
                return false;
            }

            // Filter by event type
            if (filters.eventType && filters.eventType !== "all" && webhook.eventType !== filters.eventType) {
                return false;
            }

            // Filter by search (id or payload content - simple version)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesId = webhook.id.toLowerCase().includes(searchLower);
                // Deep search in payload could be expensive, keeping it simple for now:
                // const matchesPayload = JSON.stringify(webhook.payload).toLowerCase().includes(searchLower);

                // Also check payload id often used like payment_id
                const payloadId = webhook.payload.id || "";
                const matchesPayloadId = payloadId.toLowerCase().includes(searchLower);

                if (!matchesId && !matchesPayloadId) {
                    return false;
                }
            }

            // Filter by date range (if implemented)
            if (filters.dateRange) {
                const date = new Date(webhook.createdAt);
                if (date < filters.dateRange.start || date > filters.dateRange.end) {
                    return false;
                }
            }

            return true;
        });
    }, [webhooks, filters]);

    // Sort by date desc
    const sortedWebhooks = useMemo(() => {
        return [...filteredWebhooks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [filteredWebhooks]);

    const resendWebhook = async (id: string) => {
        // Mock API call
        console.log(`Resending webhook ${id}...`);
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                alert(`Webhook ${id} resent successfully!`);
                resolve(true);
            }, 1000);
        });
    };

    const sendTestWebhook = async (eventType: WebhookEventType, url: string) => {
        console.log(`Sending test webhook ${eventType} to ${url}...`);
        return new Promise<{ success: boolean; message: string }>((resolve) => {
            setTimeout(() => {
                // Random success/fail for demo
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    resolve({ success: true, message: "Test webhook sent successfully." });
                    // Optional: Add to list
                    const newMock: WebhookEvent = {
                        id: `wh_test_${Date.now()}`,
                        eventType,
                        url,
                        status: WebhookStatus.SUCCESS,
                        payload: { test: true, timestamp: Date.now() },
                        response: { status: 200, body: '{"ok": true}' },
                        createdAt: new Date().toISOString(),
                        attempts: 1,
                        lastAttemptAt: new Date().toISOString(),
                    };
                    setWebhooks(prev => [newMock, ...prev]);
                } else {
                    resolve({ success: false, message: "Failed to connect to endpoint." });
                }
            }, 1500);
        });
    };

    return {
        webhooks: sortedWebhooks,
        filters,
        setFilters,
        resendWebhook,
        sendTestWebhook
    };
};
