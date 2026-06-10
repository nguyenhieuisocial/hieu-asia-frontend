import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { TarotTool } from '@/components/tools/TarotTool';

export default function TarotPage() {
  return (
    <ToolPageShell
      eyebrow="TAROT PHẢN TƯ"
        relatedSlug="/tarot"
      icon="🃏"
      title={<>Rút lá <GoldAccent>Tarot</GoldAccent></>}
      description="Đặt một câu hỏi đang phân vân, rút lá — mỗi lá là một lăng kính để bạn nhìn quyết định từ góc khác. Không bói toán, không tiên đoán: bạn vẫn là người quyết."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tarot' }]}
    >
      <div className="mx-auto mb-6 max-w-3xl">
        <Link
          href="/tarot/hom-nay"
          className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
        >
          <span className="text-foreground/85">🌅 <b className="text-foreground">Lá Tarot hôm nay</b> — mỗi ngày một lá để dừng lại ngẫm</span>
          <span className="shrink-0 text-gold">Xem →</span>
        </Link>
      </div>
      <TarotTool />
      <StickyMobileCta trackId="tarot" />
    </ToolPageShell>
  );
}
