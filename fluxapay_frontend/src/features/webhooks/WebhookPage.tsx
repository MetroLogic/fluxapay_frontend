"use client";

import React from "react";
import { useWebhooks } from "./useWebhooks";
import { WebhookFilters } from "./components/WebhookFilters";
import { WebhookTable } from "./components/WebhookTable";
import { WebhookTestTool } from "./components/WebhookTestTool";

export default function WebhookPage() {
    const { webhooks, filters, setFilters, resendWebhook, sendTestWebhook } = useWebhooks();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Webhook Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and debug real-time webhook events sent to your endpoints.
                    </p>
                </div>
                <WebhookTestTool onSendTest={sendTestWebhook} />
            </div>

            <div className="space-y-4">
                <WebhookFilters filters={filters} onChange={setFilters} />
                <WebhookTable webhooks={webhooks} onResend={resendWebhook} />
            </div>
        </div>
    );
}
