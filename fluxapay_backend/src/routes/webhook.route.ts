import { Router } from "express";
import {
    getWebhooks,
    resendWebhook,
    sendTestWebhook,
} from "../controllers/webhook.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import * as webhookSchema from "../schemas/webhook.schema";

const router = Router();

/**
 * @swagger
 * /api/webhooks:
 *   get:
 *     summary: Get webhook logs for the logged-in merchant
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, success, pending, failed]
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of webhook logs
 */
router.get("/", authenticateToken, validate(webhookSchema.getWebhooksSchema), getWebhooks);

/**
 * @swagger
 * /api/webhooks/resend:
 *   post:
 *     summary: Resend a webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook resend triggered
 */
router.post("/resend", authenticateToken, validate(webhookSchema.resendWebhookSchema), resendWebhook);

/**
 * @swagger
 * /api/webhooks/test:
 *   post:
 *     summary: Send a test webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventType
 *               - url
 *             properties:
 *               eventType:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test webhook sent
 */
router.post("/test", authenticateToken, validate(webhookSchema.sendTestWebhookSchema), sendTestWebhook);

export default router;
