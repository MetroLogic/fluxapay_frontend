import React from "react";
import { WebhookFilter, WebhookStatus, WebhookEventType } from "../types";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

interface WebhookFiltersProps {
    filters: WebhookFilter;
    onChange: (filters: WebhookFilter) => void;
}

export const WebhookFilters: React.FC<WebhookFiltersProps> = ({ filters, onChange }) => {
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...filters, status: e.target.value as WebhookStatus | "all" });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...filters, eventType: e.target.value as WebhookEventType | "all" });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...filters, search: e.target.value });
    };

    const handleClear = () => {
        onChange({ status: "all", eventType: "all", search: "" });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end bg-background p-4 rounded-lg border border-border">
            <div className="flex-1 w-full md:w-auto">
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Search</label>
                <Input
                    placeholder="Search by ID or Payment ID..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>

            <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Status</label>
                <select
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={filters.status}
                    onChange={handleStatusChange}
                >
                    <option value="all">All Statuses</option>
                    <option value={WebhookStatus.SUCCESS}>Delivered</option>
                    <option value={WebhookStatus.PENDING}>Pending</option>
                    <option value={WebhookStatus.FAILED}>Failed</option>
                </select>
            </div>

            <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Event Type</label>
                <select
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={filters.eventType}
                    onChange={handleTypeChange}
                >
                    <option value="all">All Events</option>
                    <option value="payment.succeeded">Payment Succeeded</option>
                    <option value="payment.failed">Payment Failed</option>
                    <option value="refund.processed">Refund Processed</option>
                    <option value="subscription.created">Subscription Created</option>
                    <option value="subscription.cancelled">Subscription Cancelled</option>
                </select>
            </div>

            <Button variant="outline" onClick={handleClear}>
                Clear Filters
            </Button>
        </div>
    );
};
