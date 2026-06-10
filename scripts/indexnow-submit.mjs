#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing / Yandex / Naver / Seznam — also feeds AI search engines).
 *
 * The key is NOT a secret: the protocol requires it to be publicly hosted at
 * https://hieu.asia/<key>.txt (see apps/web/public/). Run after deploying new
 * SEO landing pages so non-Google engines pick them up without waiting for a crawl.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                          # submit toàn bộ sitemap
 *   node scripts/indexnow-submit.mjs https://hieu.asia/tarot  # submit vài URL cụ thể
 */
const HOST = 'hieu.asia';
const KEY = 'f638dc2b1c81e6fbf8c3c99785ec9e0de894d6a3ca42d34223a35f9f7384e276';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function getSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; indexnow-submit)' },
  });
  if (!res.ok) throw new Error(`sitemap.xml HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const urlList = process.argv.length > 2 ? process.argv.slice(2) : await getSitemapUrls();
if (urlList.length === 0) throw new Error('No URLs to submit');

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = OK, 202 = accepted (key validation pending) — both are success.
console.log(`IndexNow: HTTP ${res.status} ${res.statusText} — submitted ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
