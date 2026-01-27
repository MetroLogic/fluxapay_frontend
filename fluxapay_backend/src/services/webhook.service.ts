import { PrismaClient } from "../generated/client/client";
import { AuthRequest } from "../types/express";
import { validateUserId } from "../helpers/request.helper";

const prisma = new PrismaClient();

export async function getWebhooksService(data: {
    status?: string;
    eventType?: string;
    search?: string;
    page?: number;
    limit?: number;
}, req: AuthRequest) {
    const merchantId = await validateUserId(req);
    const { status, eventType, search, page = 1, limit = 10 } = data;

    const where: any = {
        merchantId,
    };

    if (status && status !== "all") {
        where.status = status;
    }

    if (eventType && eventType !== "all") {
        where.event_type = eventType;
    }

    if (search) {
        where.OR = [
            { id: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [logs, total] = await Promise.all([
        prisma.webhookLog.findMany({
            where,
            orderBy: { created_at: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.webhookLog.count({ where }),
    ]);

    return {
        logs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function resendWebhookService(data: { id: string }, req: AuthRequest) {
    const merchantId = await validateUserId(req);
    const { id } = data;

    const log = await prisma.webhookLog.findFirst({
        where: { id, merchantId },
    });

    if (!log) throw { status: 404, message: "Webhook log not found" };

    // In a real app, this would trigger a background job.
    // For this exercise, we'll simulate a retry and update the log.

    const updatedLog = await prisma.webhookLog.update({
        where: { id },
        data: {
            attempts: log.attempts + 1,
            last_attempt: new Date(),
            status: "pending", // Reset to pending for the "retry"
        },
    });

    return { message: "Webhook retry triggered", log: updatedLog };
}

export async function sendTestWebhookService(data: { eventType: string; url: string }, req: AuthRequest) {
    const merchantId = await validateUserId(req);
    const { eventType, url } = data;

    // Create a mock payload based on event type
    const payload = {
        id: `evt_${Math.random().toString(36).substr(2, 9)}`,
        type: eventType,
        created: Math.floor(Date.now() / 1000),
        data: {
            object: {
                id: `obj_${Math.random().toString(36).substr(2, 9)}`,
                status: "succeeded",
                amount: 5000,
                currency: "USD",
            }
        }
    };

    // Create the log entry
    const log = await prisma.webhookLog.create({
        data: {
            merchantId,
            event_type: eventType,
            url,
            status: "success", // Assume success for test
            payload: payload as any,
            attempts: 1,
            last_attempt: new Date(),
            response: { status: 200, body: '{"received": true}' } as any,
        },
    });

    return { message: "Test webhook sent successfully", log };
}
