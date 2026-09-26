import { timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import type { Config } from '@netlify/functions';
import { initialDocuments, type RAGDocument } from '../../server/initialData.js';

const allowedOrigins = new Set([
  'https://dedipyaaag.netlify.app',
  'https://dedipya001.github.io',
]);

function response(body: unknown, status: number, origin: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
  if (origin && allowedOrigins.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Admin-Token';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function authorized(request: Request) {
  const expected = Netlify.env.get('PORTFOLIO_ADMIN_TOKEN');
  const supplied = request.headers.get('X-Admin-Token');
  if (!expected || !supplied) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async (request: Request) => {
  const origin = request.headers.get('Origin');
  if (origin && !allowedOrigins.has(origin)) return response({ error: 'Forbidden origin' }, 403, origin);
  if (request.method === 'OPTIONS') return response({}, 200, origin);
  if (!authorized(request)) return response({ error: 'Admin key required' }, 401, origin);

  const store = getStore({ name: 'portfolio-documents', consistency: 'strong' });
  const documents = (await store.get('documents', { type: 'json' }) as RAGDocument[] | null) ?? initialDocuments;
  const url = new URL(request.url);
  const id = url.pathname.startsWith('/api/admin/documents/')
    ? decodeURIComponent(url.pathname.slice('/api/admin/documents/'.length))
    : null;

  if (request.method === 'GET' && !id) return response(documents, 200, origin);

  if (request.method === 'POST' && !id) {
    let input: Partial<RAGDocument>;
    try { input = await request.json(); }
    catch { return response({ error: 'Invalid JSON' }, 400, origin); }
    const title = typeof input.title === 'string' ? input.title.trim() : '';
    const content = typeof input.content === 'string' ? input.content.trim() : '';
    const validCategories: RAGDocument['category'][] = [
      'bio', 'projects', 'experience', 'skills', 'achievements', 'education', 'other',
    ];
    const category = input.category;
    if (!title || !content || !category || !validCategories.includes(category) || title.length > 200 || content.length > 100000) {
      return response({ error: 'Title, content, or category is invalid' }, 400, origin);
    }
    const doc: RAGDocument = {
      id: `doc-${crypto.randomUUID()}`,
      title,
      content,
      category,
      tags: Array.isArray(input.tags) ? input.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 25) : [],
      source: typeof input.source === 'string' ? input.source.slice(0, 200) : 'admin_manual_upload.txt',
    };
    await store.setJSON('documents', [...documents, doc]);
    return response(doc, 201, origin);
  }

  if (request.method === 'DELETE' && id) {
    const filtered = documents.filter(doc => doc.id !== id);
    if (filtered.length === documents.length) return response({ error: 'Document not found' }, 404, origin);
    await store.setJSON('documents', filtered);
    return response({ success: true }, 200, origin);
  }
  return response({ error: 'Method not allowed' }, 405, origin);
};

export const config: Config = {
  path: ['/api/admin/documents', '/api/admin/documents/:id'],
};
