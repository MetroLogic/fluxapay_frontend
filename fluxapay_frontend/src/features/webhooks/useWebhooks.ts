import { useState, useMemo, useEffect, useCallback } from "react";
import { WebhookEvent, WebhookFilter, WebhookStatus, WebhookEventType } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useWebhooks = () => {
    const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<WebhookFilter>({
        status: "all",
        eventType: "all",
        search: "",
    });

    const fetchWebhooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            const queryParams = new URLSearchParams();
            if (filters.status && filters.status !== "all") queryParams.append("status", filters.status);
            if (filters.eventType && filters.eventType !== "all") queryParams.append("eventType", filters.eventType);
            if (filters.search) queryParams.append("search", filters.search);

            const response = await fetch(`${API_BASE_URL}/webhooks?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized: Please log in.");
                throw new Error("Failed to fetch webhooks");
            }

            const data = await response.json();
            const mappedLogs = data.logs.map((log: any) => ({
                id: log.id,
                eventType: log.event_type,
                url: log.url,
                status: log.status,
                payload: log.payload,
                response: log.response,
                createdAt: log.created_at,
                attempts: log.attempts,
                lastAttemptAt: log.last_attempt,
                nextRetryAt: log.next_retry,
            }));
            setWebhooks(mappedLogs);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchWebhooks();
    }, [fetchWebhooks]);

    const resendWebhook = async (id: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            const response = await fetch(`${API_BASE_URL}/webhooks/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Failed to resend webhook");

            await fetchWebhooks();
            alert("Webhook resend triggered successfully.");
            return true;
        } catch (err: any) {
            alert(`Error: ${err.message}`);
            return false;
        }
    };

    const sendTestWebhook = async (eventType: WebhookEventType, url: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            const response = await fetch(`${API_BASE_URL}/webhooks/test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ eventType, url }),
            });

            if (!response.ok) throw new Error("Failed to send test webhook");

            await fetchWebhooks();
            return { success: true, message: "Test webhook sent successfully." };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    };

    return {
        webhooks,
        loading,
        error,
        filters,
        setFilters,
        resendWebhook,
        sendTestWebhook,
        refresh: fetchWebhooks
    };
};
