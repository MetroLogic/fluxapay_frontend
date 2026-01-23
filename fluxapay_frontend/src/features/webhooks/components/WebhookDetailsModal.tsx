import React, { useState } from "react";
import { WebhookEvent, WebhookStatus } from "../types";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { WebhookStatusBadge } from "./WebhookStatusBadge";

interface WebhookDetailsModalProps {
    webhook: WebhookEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onResend: (id: string) => Promise<boolean>;
}

export const WebhookDetailsModal: React.FC<WebhookDetailsModalProps> = ({
    webhook,
    isOpen,
    onClose,
    onResend
}) => {
    const [activeTab, setActiveTab] = useState<"payload" | "response">("payload");
    const [isResending, setIsResending] = useState(false);

    if (!webhook) return null;

    const handleResend = async () => {
        setIsResending(true);
        await onResend(webhook.id);
        setIsResending(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Webhook Details">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col gap-2 pb-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-muted-foreground">{webhook.id}</span>
                        <WebhookStatusBadge status={webhook.status} />
                    </div>
                    <div className="text-lg font-semibold">{webhook.eventType}</div>
                    <div className="text-sm font-mono bg-muted p-2 rounded break-all">
                        {webhook.url}
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                        <span>Time: {new Date(webhook.createdAt).toLocaleString()}</span>
                        <span>Attempts: {webhook.attempts}</span>
                    </div>
                </div>

                {/* Payload / Response Tabs */}
                <div>
                    <div className="flex border-b border-border mb-4">
                        <button
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'payload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('payload')}
                        >
                            Request Payload
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'response' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('response')}
                        >
                            Response Body
                        </button>
                    </div>

                    <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto max-h-[300px] text-xs font-mono">
                        <pre>
                            {activeTab === 'payload'
                                ? JSON.stringify(webhook.payload, null, 2)
                                : (webhook.response ?
                                    `Status: ${webhook.response.status}\n\nBody:\n${JSON.stringify(JSON.parse(webhook.response.body || '{}'), null, 2)}`
                                    : 'No response recorded')
                            }
                        </pre>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                        onClick={handleResend}
                        disabled={isResending}
                        variant="outline"
                    >
                        {isResending ? "Resending..." : "Resend Webhook"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
