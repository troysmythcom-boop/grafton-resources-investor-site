import {allowRequest, json, validOrigin} from '../../lib/request.js';
import {validateSubscription} from '../../../server-utils.mjs';

export async function POST({request, clientAddress}) {
  if (!validOrigin(request)) return json({error: 'Invalid origin'}, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error: 'JSON required'}, 415);
  if (!allowRequest(clientAddress)) return json({error: 'Please wait a minute before trying again.'}, 429);
  try {
    const raw = await request.text();
    if (raw.length > 12000) return json({error: 'Request too large'}, 413);
    const data = JSON.parse(raw);
    if (!validateSubscription(data)) return json({error: 'Enter a valid email and confirm consent.'}, 400);
    if (!process.env.SUBSCRIBE_WEBHOOK_URL) return json({error: 'Subscriptions are not connected yet. Please contact csmyth@graftonresources.com.'}, 503);
    const response = await fetch(process.env.SUBSCRIBE_WEBHOOK_URL, {method: 'POST', headers: {'Content-Type': 'application/json', ...(process.env.SUBSCRIBE_WEBHOOK_TOKEN ? {Authorization: `Bearer ${process.env.SUBSCRIBE_WEBHOOK_TOKEN}`} : {})}, body: JSON.stringify({email: data.email, consent: true}), signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('Subscription service unavailable');
    return json({ok: true});
  } catch (error) {
    if (error instanceof SyntaxError) return json({error: 'Invalid JSON'}, 400);
    return json({error: 'Service unavailable. Please try again or contact investor relations.'}, 503);
  }
}
