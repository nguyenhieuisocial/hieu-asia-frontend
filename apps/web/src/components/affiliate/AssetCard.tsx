/**
 * AssetCard — banner / video / text / qr preview with copy + download actions.
 */

'use client';

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';

export type AssetType = 'banner' | 'video' | 'text' | 'qr' | 'logo';

export interface ResolvedAsset {
  id: string;
  type: AssetType;
  title: string;
  caption: string;
  url?: string;
  content?: string;
  resolved_content?: string;
  resolved_qr?: string;
  platforms?: string[];
  dimensions?: string;
  duration_sec?: number;
  share_url: string;
}

interface Props {
  asset: ResolvedAsset;
}

const TYPE_LABEL: Record<AssetType, string> = {
  banner: 'Banner',
  video: 'Video',
  text: 'Caption',
  qr: 'QR code',
  logo: 'Logo',
};

export function AssetCard({ asset }: Props) {
  const [copied, setCopied] = React.useState(false);

  function copy() {
    const text = asset.resolved_content ?? asset.url ?? asset.share_url;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="overflow-hidden border-border">
      <div className="aspect-video bg-muted/[0.04] flex items-center justify-center text-xs text-muted-foreground">
        {asset.type === 'qr' && asset.resolved_qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.resolved_qr} alt="QR" className="h-full w-full object-contain bg-white p-3" />
        ) : asset.type === 'banner' && asset.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={asset.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : asset.type === 'video' ? (
          <span>▶ Video {asset.duration_sec}s</span>
        ) : (
          <span>{TYPE_LABEL[asset.type]}</span>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold">{asset.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{asset.caption}</div>
          </div>
          <span className="shrink-0 rounded bg-gold/10 px-2 py-0.5 text-[12px] uppercase text-gold">
            {TYPE_LABEL[asset.type]}
          </span>
        </div>

        {asset.platforms && (
          <div className="flex flex-wrap gap-1">
            {asset.platforms.map((p) => (
              <span key={p} className="rounded bg-muted/5 px-2 py-0.5 text-[12px] text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
        )}

        {asset.resolved_content && (
          <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded bg-muted/[0.04] p-2 text-xs text-foreground/80">
            {asset.resolved_content}
          </pre>
        )}

        <div className="flex flex-wrap gap-2">
          {(asset.type === 'text' || asset.type === 'qr') && (
            <Button size="sm" onClick={copy}>
              {copied ? 'Đã copy' : asset.type === 'text' ? 'Copy caption' : 'Copy QR URL'}
            </Button>
          )}
          {asset.url && asset.type !== 'text' && (
            <a
              href={asset.url}
              download
              className="inline-flex items-center rounded bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/25"
            >
              Tải về
            </a>
          )}
          {asset.type === 'qr' && asset.resolved_qr && (
            <a
              href={asset.resolved_qr}
              download={`hieu-asia-qr.png`}
              className="inline-flex items-center rounded bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/25"
            >
              Tải QR PNG
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
