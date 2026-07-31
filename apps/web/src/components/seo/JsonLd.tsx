import * as React from 'react';
import { serializeJsonLd, type JsonLdNode } from '@/lib/seo/jsonld';

/**
 * Server component that emits a single `<script type="application/ld+json">`.
 *
 * Answer-engine crawlers (ChatGPT/Perplexity/Google AI Overviews) and Google
 * read server-rendered JSON-LD, so this must render on the server (it does — no
 * 'use client'). Renders no visible UI and touches no design tokens.
 *
 * Pass one node, or an array (rendered as separate scripts). Compose a full
 * graph with `siteGraph()` / the builders in `@/lib/seo/jsonld`.
 */
export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const nodes = Array.isArray(data) ? data : [data];
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          // `serializeJsonLd` escape `<`/`>`/`&` — KHÔNG dùng thẳng
          // `JSON.stringify` ở đây: nó không escape `</script>` nên một giá trị
          // JSON-LD lấy từ API/CMS có thể thoát khỏi thẻ script.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
        />
      ))}
    </>
  );
}
