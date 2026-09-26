import { getStore } from '@netlify/blobs';
import type { Config } from '@netlify/functions';
import { initialDocuments, type RAGDocument } from '../../server/initialData.js';
import { VectorEngine } from '../../server/vectorEngine.js';

const origins = new Set(['https://dedipyaaag.netlify.app', 'https://dedipya001.github.io']);

export default async (request: Request) => {
  const origin = request.headers.get('Origin');
  const headers: Record<string, string> = { 'Cache-Control': 'no-store', Vary: 'Origin' };
  if (origin && !origins.has(origin)) return new Response('Forbidden origin', { status: 403 });
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers });

  let body: { message?: unknown };
  try { body = await request.json(); }
  catch { return new Response('Invalid JSON', { status: 400, headers }); }
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 500) return new Response('Invalid message', { status: 400, headers });

  const store = getStore({ name: 'portfolio-documents', consistency: 'strong' });
  const docs = (await store.get('documents', { type: 'json' }) as RAGDocument[] | null) ?? initialDocuments;
  const matches = new VectorEngine(docs).search(message, 3);
  const citations = matches.map(({ doc, score }) => ({
    id: doc.id, title: doc.title, source: doc.source, category: doc.category, confidence: score,
  }));
  const content = matches.length
    ? matches.map(({ doc }) => `**${doc.title}**\n${doc.content}`).join('\n\n')
    : 'I could not find a matching memory. Try asking about a project, experience, or skill.';
  const payload = [
    { type: 'meta', confidence: Math.min(Math.round((matches[0]?.score ?? 0) * 100), 100), citations },
    { type: 'content', content },
    { type: 'done' },
  ].map(item => `data: ${JSON.stringify(item)}\n\n`).join('');
  return new Response(payload, { status: 200, headers: { ...headers, 'Content-Type': 'text/event-stream; charset=utf-8' } });
};

export const config: Config = { path: '/api/chat' };
