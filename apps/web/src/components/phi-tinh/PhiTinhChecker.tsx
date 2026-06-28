'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hieu-asia/ui';
import {
  computeFlyingStarChart,
  MOUNTAINS,
  type FlyingStarChart,
  type PalaceStars,
} from '@/lib/phi-tinh';
import { track } from '@/lib/analytics';

// Bản chất 9 sao (tri thức cổ điển — mô tả NGẮN, xu hướng tham khảo, không phán hung cát tuyệt đối).
const STAR_NATURE: Record<number, { name: string; element: string; note: string }> = {
  1: { name: 'Nhất Bạch', element: 'Thủy', note: 'Văn chương, công danh, đào hoa; đương vận chủ trí tuệ, thăng tiến.' },
  2: { name: 'Nhị Hắc', element: 'Thổ', note: 'Bệnh phù; đương vận chủ điền sản, mất vận dễ bệnh tật, lo âu.' },
  3: { name: 'Tam Bích', element: 'Mộc', note: 'Tranh đấu, thị phi; đương vận chủ khai sáng, mất vận dễ kiện tụng.' },
  4: { name: 'Tứ Lục', element: 'Mộc', note: 'Văn xương, học hành, quan hệ; lợi thi cử, sáng tạo.' },
  5: { name: 'Ngũ Hoàng', element: 'Thổ', note: 'Sao mạnh nhất, dễ thành hung khi động; nên TĨNH, kỵ tu sửa nơi sao tới.' },
  6: { name: 'Lục Bạch', element: 'Kim', note: 'Quyền uy, võ quý, chính tài; đương vận chủ địa vị, lộc.' },
  7: { name: 'Thất Xích', element: 'Kim', note: 'Khẩu tài, thiên tài; mất vận (hiện đã thoái) dễ thị phi, hao tài.' },
  8: { name: 'Bát Bạch', element: 'Thổ', note: 'TÀI TINH đương vận trước (đến 2023); chủ phú quý, vượng tài đinh.' },
  9: { name: 'Cửu Tử', element: 'Hỏa', note: 'Sao ĐƯƠNG VẬN (2024–2043); chủ hỷ khánh, văn chương, thăng hoa.' },
};

const PATTERN_NOTE: Record<string, string> = {
  'vuong-son-vuong-huong':
    'Cách tốt: sao đương vận tới cả tọa lẫn hướng — hợp thì đinh (người) và tài (của) đều vượng, cần phối địa hình (tọa thực hướng không).',
  'thuong-son-ha-thuy':
    'Cách cần lưu ý: sao đương vận đảo vị — nếu địa hình ngược (sau thấp/trống, trước cao/bịt) dễ bất lợi; phối đúng địa hình thì hóa giải được.',
  'song-tinh-dao-huong':
    'Hai sao đương vận đều tới hướng: lợi về TÀI, phía trước nên thoáng/có thủy; phần đinh hơi yếu cần bù.',
  'song-tinh-dao-toa':
    'Hai sao đương vận đều tới tọa: lợi về ĐINH (người, sức khỏe); phía sau nên có điểm tựa/thủy để thu khí.',
  'thong-thuong': 'Không thuộc bốn cách chính; luận theo tổ hợp sao từng cung và phối hợp địa hình.',
  'ngu-van': 'Ngũ vận không có chính quái; mười năm đầu ký Nhị Hắc, mười năm sau ký Bát Bạch nhập trung.',
};

// Lưới hiển thị theo bàn Huyền Không (trên Nam, dưới Bắc) — map grid → vị trí ô lưới hiển thị.
// PALACES grid: 0=Tốn(SE) 1=Ly(S) 2=Khôn(SW) 3=Chấn(E) 4=Trung 5=Đoài(W) 6=Cấn(NE) 7=Khảm(N) 8=Càn(NW)
// Lưới muốn: hàng1 SE,S,SW = grid 0,1,2 ; hàng2 E,Trung,W = grid 3,4,5 ; hàng3 NE,N,NW = grid 6,7,8
const GRID_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const VAN_OPTIONS = [
  { v: 9, label: 'Cửu vận (2024–2043) · đang đương vận' },
  { v: 8, label: 'Bát vận (2004–2023)' },
  { v: 7, label: 'Thất vận (1984–2003)' },
  { v: 6, label: 'Lục vận (1964–1983)' },
  { v: 5, label: 'Ngũ vận (1944–1963)' },
  { v: 4, label: 'Tứ vận (1924–1943)' },
  { v: 3, label: 'Tam vận (1904–1923)' },
  { v: 2, label: 'Nhị vận (1884–1903)' },
  { v: 1, label: 'Nhất vận (1864–1883)' },
];

function PalaceCell({ ps, isSitting, isFacing }: { ps: PalaceStars; isSitting: boolean; isFacing: boolean }) {
  const border = isSitting
    ? 'border-primary ring-1 ring-primary/40'
    : isFacing
      ? 'border-gold/60 ring-1 ring-gold/30'
      : 'border-border';
  return (
    <div className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border ${border} bg-card p-1.5 text-center`}>
      <div className="absolute left-1.5 top-1.5 text-xs font-semibold text-primary" title="Sơn tinh">
        {ps.son}
      </div>
      <div className="absolute right-1.5 top-1.5 text-xs font-semibold text-gold-700" title="Hướng tinh">
        {ps.huong}
      </div>
      <div className="font-editorial-display text-2xl font-medium text-foreground" title="Vận tinh">
        {ps.van}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {ps.palace.gua}
        {ps.palace.grid !== 4 ? ` · ${ps.palace.dir}` : ''}
      </div>
      {isSitting && <div className="absolute bottom-1 text-[9px] font-semibold text-primary">TỌA</div>}
      {isFacing && <div className="absolute bottom-1 text-[9px] font-semibold text-gold-700">HƯỚNG</div>}
    </div>
  );
}

export function PhiTinhChecker() {
  const [yun, setYun] = React.useState(9);
  const [sitting, setSitting] = React.useState('Tý');
  const [chart, setChart] = React.useState<FlyingStarChart | null>(null);

  const onView = React.useCallback(() => {
    const c = computeFlyingStarChart(yun, sitting);
    setChart(c);
    track('phi_tinh_chart', { yun, sitting, pattern: c.pattern });
  }, [yun, sitting]);

  const sitGrid = chart ? chart.palaces.findIndex((p) => p.palace.gua === chart.sitting.gua) : -1;
  const faceGrid = chart ? chart.palaces.findIndex((p) => p.palace.gua === chart.facing.gua) : -1;

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Lập bàn Phi Tinh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nguyên vận (theo năm xây/sửa lớn)</Label>
              <Select value={String(yun)} onValueChange={(v) => setYun(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VAN_OPTIONS.map((o) => (
                    <SelectItem key={o.v} value={String(o.v)}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sơn tọa (lưng nhà quay về)</Label>
              <Select value={sitting} onValueChange={setSitting}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOUNTAINS.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.name} ({m.han}) · {m.centerDeg}° · {m.gua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            onClick={onView}
            className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            ✦ Lập bàn Phi Tinh
          </button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Phi Tinh cần <strong>hướng nhà chính xác</strong> (1 trong 24 sơn, mỗi sơn 15°). Sơn tọa là hướng
            lưng nhà; hướng nhà = đối diện. Nếu chưa rõ, đo la bàn mặt tiền rồi tra sơn tương ứng.
          </p>
        </CardContent>
      </Card>

      {chart && (
        <>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">
                {VAN_OPTIONS.find((o) => o.v === chart.yun)?.label.split(' ·')[0]} · Tọa {chart.sitting.name} ({chart.sitting.han}) — Hướng {chart.facing.name} ({chart.facing.han})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
                {GRID_ORDER.map((g) => {
                  const ps = chart.palaces[g]!;
                  return (
                    <PalaceCell
                      key={g}
                      ps={ps}
                      isSitting={g === sitGrid}
                      isFacing={g === faceGrid}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span><span className="font-semibold text-primary">●</span> Sơn tinh (góc trái)</span>
                <span><span className="font-semibold text-foreground">●</span> Vận tinh (giữa)</span>
                <span><span className="font-semibold text-gold-700">●</span> Hướng tinh (góc phải)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">
                Cách cục: <span className="text-primary">{chart.patternLabel}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-foreground/85">{PATTERN_NOTE[chart.pattern]}</p>
              {chart.notes.length > 0 && (
                <ul className="space-y-1.5">
                  {chart.notes.map((n, i) => (
                    <li key={i} className="text-sm leading-relaxed text-foreground/85">• {n}</li>
                  ))}
                </ul>
              )}
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Bản chất 9 sao (tham khảo)
                </p>
                <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                  {Object.entries(STAR_NATURE).map(([num, s]) => (
                    <li key={num}>
                      <strong className="text-foreground/80">{num} {s.name}</strong> ({s.element}) — {s.note}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Bàn Phi Tinh là <strong>số liệu xác định</strong> (an theo vận + hướng); luận giải là{' '}
                <strong>xu hướng tham khảo</strong> để bố trí không gian, không phải lời phán định mệnh. Cần
                phối với địa hình/loan đầu thực tế — bài này chỉ dựng lý khí.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
