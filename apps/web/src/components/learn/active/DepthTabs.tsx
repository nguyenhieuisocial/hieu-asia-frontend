'use client';

/**
 * DepthTabs — cùng một khái niệm, giải thích ở nhiều tầng độ sâu
 * (ELI5 → ELI14 → Chuyên gia). Vận hành hoá "điều chỉnh độ sâu" trong khung học
 * của founder: người mới đọc tầng cạn, người sâu chọn tầng chuyên gia.
 *
 * Nội dung MỖI TẦNG do trang cung cấp, pre-author tĩnh (KHÔNG gọi LLM) → 0 chi
 * phí, 0 rủi ro bịa, cả 3 tầng đều nằm trong HTML (tốt cho SEO). Mặc định mở
 * tầng giữa để hợp số đông.
 */

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

export interface DepthLevel {
  /** id ổn định, duy nhất trong khối (vd "eli5"). */
  id: string;
  /** nhãn nút (vd "Trẻ 5 tuổi"). */
  label: string;
  /** nội dung tầng này. */
  content: React.ReactNode;
}

export interface DepthTabsProps {
  /** chủ đề bài học (vd "bat-tu") — để gắn nhãn sự kiện đo lường. */
  topicId: string;
  /** tiêu đề khái niệm đang được giải thích (vd "Nhật Chủ vượng / nhược"). */
  concept: React.ReactNode;
  /** các tầng độ sâu, từ cạn đến sâu. */
  levels: DepthLevel[];
  /** id tầng mở mặc định; mặc định = tầng giữa. */
  defaultLevelId?: string;
}

export function DepthTabs({ topicId, concept, levels, defaultLevelId }: DepthTabsProps) {
  const fallback = levels[Math.floor(levels.length / 2)]?.id ?? levels[0]?.id;
  const initial = defaultLevelId ?? fallback;

  if (levels.length === 0) return null;

  return (
    <div className="rounded-card-editorial border border-border bg-card/40 p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">
          Cùng một ý · ba độ sâu
        </p>
        <p className="font-heading text-base text-foreground sm:text-lg">{concept}</p>
        <p className="text-xs text-muted-foreground">
          Chọn tầng giải thích hợp với bạn. Cùng một sự thật, chỉ khác cách nói.
        </p>
      </div>

      <Tabs
        defaultValue={initial}
        onValueChange={(level) => track('learn_depth_changed', { topic: topicId, level })}
      >
        <TabsList className="flex h-auto flex-wrap gap-1">
          {levels.map((lvl) => (
            <TabsTrigger key={lvl.id} value={lvl.id} className="text-xs sm:text-sm">
              {lvl.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map((lvl) => (
          // forceMount: cả 3 tầng đều nằm trong HTML server-render (tầng không
          // active được Radix gắn `hidden`) → mọi độ sâu đều INDEX được cho SEO,
          // không chỉ tầng mặc định.
          <TabsContent key={lvl.id} value={lvl.id} forceMount className="data-[state=inactive]:hidden">
            <div className="space-y-3 pt-2 text-sm leading-relaxed text-muted-foreground">
              {lvl.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
