import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { PersonalityTool } from '@/components/tools/PersonalityTool';

export default function DiscPage() {
  return (
    <ToolPageShell
      eyebrow="TRẮC NGHIỆM HÀNH VI"
      icon="🧩"
      title={<><GoldAccent>DISC</GoldAccent> &amp; Big Five</>}
      description="Đo 4 phong cách hành vi DISC — Quyết đoán, Ảnh hưởng, Kiên định, Tuân thủ — kèm Big Five trong một bài 36 câu. Hiểu cách bạn làm việc và giao tiếp."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'DISC & Big Five' }]}
    >
      <PersonalityTool primaryFirst="disc" />
      <StickyMobileCta trackId="disc" />
    </ToolPageShell>
  );
}
