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
      <TarotTool />
      <StickyMobileCta trackId="tarot" />
    </ToolPageShell>
  );
}
