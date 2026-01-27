import { createController } from "../helpers/controller.helper";
import {
    getWebhooksService,
    resendWebhookService,
    sendTestWebhookService,
} from "../services/webhook.service";

export const getWebhooks = createController(getWebhooksService);
export const resendWebhook = createController(resendWebhookService);
export const sendTestWebhook = createController(sendTestWebhookService);
