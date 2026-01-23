import React from "react";
import { WebhookStatus } from "../types";
import { cn } from "@/lib/utils";

interface WebhookStatusBadgeProps {
    status: WebhookStatus;
}

export const WebhookStatusBadge: React.FC<WebhookStatusBadgeProps> = ({ status }) => {
    const styles = {
        [WebhookStatus.SUCCESS]: "bg-green-100 text-green-700 border-green-200",
        [WebhookStatus.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
        [WebhookStatus.FAILED]: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
        [WebhookStatus.SUCCESS]: "Delivered",
        [WebhookStatus.PENDING]: "Pending",
        [WebhookStatus.FAILED]: "Failed",
    };

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
            {labels[status]}
        </span>
    );
};
