"use client";

import React from "react";
import { useWebhooks } from "./useWebhooks";
import { WebhookFilters } from "./components/WebhookFilters";
import { WebhookTable } from "./components/WebhookTable";
import { WebhookTestTool } from "./components/WebhookTestTool";
import { Button } from "@/components/Button";
import { RotateCw } from "lucide-react";

export default function WebhookPage() {
    const { webhooks, loading, error, filters, setFilters, resendWebhook, sendTestWebhook, refresh } = useWebhooks();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Webhook Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and debug real-time webhook events sent to your endpoints.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refresh()}
                        disabled={loading}
                        className="hidden md:flex items-center gap-2"
                    >
                        <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <WebhookTestTool onSendTest={sendTestWebhook} />
                </div>
            </div>

            <div className="space-y-4">
                <WebhookFilters filters={filters} onChange={setFilters} />

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                        Error: {error}
                    </div>
                )}

                {loading && webhooks.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <WebhookTable webhooks={webhooks} onResend={resendWebhook} />
                )}
            </div>
        </div>
    );
}
