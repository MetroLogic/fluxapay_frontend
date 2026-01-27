import React, { useState } from "react";
import { WebhookEvent } from "../types";
import { WebhookStatusBadge } from "./WebhookStatusBadge";
import { Button } from "@/components/Button";
import { Eye, RotateCw } from "lucide-react";
import { WebhookDetailsModal } from "./WebhookDetailsModal";

interface WebhookTableProps {
    webhooks: WebhookEvent[];
    onResend: (id: string) => Promise<boolean>;
}

export const WebhookTable: React.FC<WebhookTableProps> = ({ webhooks, onResend }) => {
    const [selectedWebhook, setSelectedWebhook] = useState<WebhookEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (webhook: WebhookEvent) => {
        setSelectedWebhook(webhook);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWebhook(null);
    };

    if (webhooks.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No webhooks found matching your filters.
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Event Type</th>
                                <th className="px-6 py-4">Endpoint</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {webhooks.map((webhook) => (
                                <tr key={webhook.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <WebhookStatusBadge status={webhook.status} />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        <div className="flex flex-col">
                                            <span>{webhook.eventType}</span>
                                            <span className="text-xs text-muted-foreground font-mono mt-0.5">{webhook.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-[200px] truncate text-muted-foreground" title={webhook.url}>
                                        {webhook.url}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                        {new Date(webhook.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewDetails(webhook)}
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {/* Quick action: Resend (optional in table, available in details) */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <WebhookDetailsModal
                webhook={selectedWebhook}
                isOpen={isModalOpen}
                onClose={closeModal}
                onResend={onResend}
            />
        </>
    );
};
