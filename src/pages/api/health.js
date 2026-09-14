import {json} from '../../lib/request.js';
export function GET() {
  return json({ok: true, aiConfigured: !!process.env.OPENAI_API_KEY, subscriptionConfigured: !!process.env.SUBSCRIBE_WEBHOOK_URL});
}
