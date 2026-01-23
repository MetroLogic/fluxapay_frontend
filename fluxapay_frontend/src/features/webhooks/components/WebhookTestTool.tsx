import React, { useState } from "react";
import { WebhookEventType } from "../types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface WebhookTestToolProps {
    onSendTest: (eventType: WebhookEventType, url: string) => Promise<{ success: boolean; message: string }>;
}

export const WebhookTestTool: React.FC<WebhookTestToolProps> = ({ onSendTest }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [eventType, setEventType] = useState<WebhookEventType>("payment.succeeded");
    const [url, setUrl] = useState("https://httpbin.org/post");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSend = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const res = await onSendTest(eventType, url);
            setResult(res);
        } catch (e) {
            setResult({ success: false, message: "An unexpected error occurred." });
        }
        setIsLoading(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setResult(null);
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
                <Send className="h-4 w-4" />
                Test Webhook
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} title="Test Webhook Delivery">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Send a sample webhook payload to any URL to verify connectivity and payload format.
                    </p>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Event Type</label>
                        <select
                            className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-ring"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value as WebhookEventType)}
                        >
                            <option value="payment.succeeded">payment.succeeded</option>
                            <option value="payment.failed">payment.failed</option>
                            <option value="refund.processed">refund.processed</option>
                            <option value="subscription.created">subscription.created</option>
                            <option value="subscription.cancelled">subscription.cancelled</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target URL</label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://your-api.com/webhooks"
                        />
                    </div>

                    {/* Preview Payload (Static for now based on event type could be dynamic) */}
                    <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono text-muted-foreground">
                        Preview: {`{ "type": "${eventType}", "data": { ... } }`}
                    </div>

                    {result && (
                        <div className={`p-3 rounded-md text-sm flex items-start gap-2 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {result.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                            <span>{result.message}</span>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSend} disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? "Sending..." : "Send Test Webhook"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
