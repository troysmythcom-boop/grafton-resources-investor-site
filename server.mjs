import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
export const routes = ['/', '/projects', '/investors', '/company', '/news', '/contact'];
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp' };
export function createServer() {
  return http.createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/\/$/, '') || '/';
      if (pathname === '/health') { res.writeHead(200, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); return res.end(req.method === 'HEAD' ? undefined : '{"status":"ok"}'); }
      const file = routes.includes(pathname) ? 'index.html' : pathname.replace(/^\/+/, '');
      const absolute = path.resolve(root, file);
      if (!absolute.startsWith(root) || !types[path.extname(absolute)]) { res.writeHead(404); return res.end('Not found'); }
      const data = await readFile(absolute);
      res.writeHead(200, { 'Content-Type': types[path.extname(absolute)], 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Cache-Control':'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createServer().listen(port, '0.0.0.0', () => console.log(`Grafton server listening on port ${port}`));
}
