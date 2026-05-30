import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { PersonalityTool } from '@/components/tools/PersonalityTool';

export default function BigFivePage() {
  return (
    <ToolPageShell
      eyebrow="TRẮC NGHIỆM TÍNH CÁCH"
      icon="🧭"
      title={<>Big Five &amp; <GoldAccent>DISC</GoldAccent></>}
      description="Một bài 36 câu — đo 5 chiều tính cách Big Five và 4 phong cách hành vi DISC. Khoa học, rõ ràng, không định mệnh: đây là cách bạn vận hành, không phải số phận."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Big Five & DISC' }]}
    >
      <PersonalityTool primaryFirst="big-five" />
      <StickyMobileCta trackId="big-five" />
    </ToolPageShell>
  );
}
