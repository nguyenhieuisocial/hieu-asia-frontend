import { RectifyClient, type BtrQuestion } from './rectify-client';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

// Fallback questions (mirror of backend BTR_QUESTIONS) so SSR never returns
// an empty page if the worker is down. Kept minimal — only enough for the form
// to render. Real source of truth is the worker module.
const FALLBACK_QUESTIONS: BtrQuestion[] = [];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tử Vi', item: 'https://hieu.asia/tu-vi' },
    { '@type': 'ListItem', position: 3, name: 'Hồi cứu giờ sinh', item: 'https://hieu.asia/tu-vi/rectify' },
  ],
};

async function fetchQuestions(): Promise<BtrQuestion[]> {
  try {
    const res = await fetch(`${API_BASE}/tools/birth-time/rectify/questions`, {
      // 6h Next ISR aligns with worker s-maxage.
      next: { revalidate: 21600 },
    });
    if (!res.ok) return FALLBACK_QUESTIONS;
    const ct = res.headers.get('content-type') ?? '';
    if (!/json/i.test(ct)) return FALLBACK_QUESTIONS;
    const data = (await res.json()) as { ok: boolean; questions?: BtrQuestion[] };
    if (!data.ok || !Array.isArray(data.questions)) return FALLBACK_QUESTIONS;
    return data.questions;
  } catch {
    return FALLBACK_QUESTIONS;
  }
}

export default async function RectifyPage() {
  const questions = await fetchQuestions();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <RectifyClient initialQuestions={questions} apiBase={API_BASE} />
    </>
  );
}
