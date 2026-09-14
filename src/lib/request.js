const limits = new Map();

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin'}});
}

export function validOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || new URL(origin).host === new URL(request.url).host;
}

export function allowRequest(address = 'unknown') {
  const now = Date.now();
  let rate = limits.get(address);
  if (!rate || rate.until < now) {
    rate = {count: 0, until: now + 60000};
    limits.set(address, rate);
  }
  return ++rate.count <= 20;
}
