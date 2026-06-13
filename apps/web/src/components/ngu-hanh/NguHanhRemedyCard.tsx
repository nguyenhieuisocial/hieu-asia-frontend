/**
 * NguHanhRemedyCard — hiển thị gợi ý bổ khuyết ngũ hành từ `fiveElementsClass`.
 *
 * Dùng chung được: tinh-menh-cuc + la-so-tu-vi (+ bất kỳ trang nào có fiveElementsClass).
 * Pattern trình bày copy từ tinh-menh-cuc/form.tsx (NguHanhRemedySection nội tuyến),
 * ở đây tách ra thành component dùng chung, KHÔNG import từ form.tsx.
 *
 * Framing brand: "gợi ý tham khảo, không phải lời phán về số mệnh."
 */

import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { getNguHanhRemedy, type NguHanhRemedy } from '@/lib/ngu-hanh-remedy';

interface Props {
  fiveElementsClass: string;
}

export function NguHanhRemedyCard({ fiveElementsClass }: Props) {
  const remedy: NguHanhRemedy | null = getNguHanhRemedy(fiveElementsClass);
  if (!remedy) return null;

  return (
    <section aria-labelledby="ngu-hanh-remedy-heading">
      <Card className="border-gold/20 bg-card/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden />
            <CardTitle
              id="ngu-hanh-remedy-heading"
              className="font-heading text-xl text-foreground"
            >
              Gợi ý bổ khuyết ngũ hành (tham khảo)
            </CardTitle>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Đây là gợi ý tham khảo theo ngũ hành, không phải lời phán về số mệnh.
            Áp dụng hay không tuỳ bối cảnh cá nhân — hieu.asia không phán, chỉ gợi ý.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <RemedyBlock
            title={`Màu sắc phù hợp với hành ${remedy.hanh}`}
            items={remedy.mauHop}
            hint="Theo Ngũ Hành học, màu tương sinh với hành chủ đạo giúp cân bằng năng lượng."
          />

          <RemedyBlock
            title="Hướng tốt"
            items={remedy.huongTot}
            hint="Hướng bàn làm việc, cửa chính hoặc hướng ngủ theo Phong Thủy Ngũ Hành."
          />

          <RemedyBlock
            title="Nhóm nghề phù hợp"
            items={remedy.ngheHop}
            hint="Ngành nghề cộng hưởng với đặc tính hành chủ đạo — không phải giới hạn, chỉ là xu hướng thuận."
          />

          <RemedyBlock
            title="Vật phẩm & môi trường hỗ trợ"
            items={remedy.vatPham}
            hint="Không cần mua nhiều — chọn 1–2 thứ phù hợp hoàn cảnh, đặt nơi bạn làm việc hoặc nghỉ ngơi."
          />

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Lời khuyên hành động
            </p>
            <ol className="space-y-2">
              {remedy.loiKhuyen.map((lk, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                  <span className="shrink-0 font-mono text-gold-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{lk}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            Nguồn quy tắc: Ngũ Hành học cổ điển (tương sinh/tương khắc chuẩn) + bảng hướng
            Phong Thủy phổ biến tại Việt Nam. Kết quả mang tính gợi ý, không thay thế tư
            vấn chuyên sâu từ chuyên gia Tử Vi có kinh nghiệm.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function RemedyBlock({
  title,
  items,
  hint,
}: {
  title: string;
  items: string[];
  hint: string;
}) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs font-medium text-gold-700"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}
