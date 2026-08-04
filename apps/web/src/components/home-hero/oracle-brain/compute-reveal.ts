import type { Bazi, Lens, Reveal } from './types';

/**
 * Soi thử đa lăng kính (demo sống) — phần TÍNH THUẦN của "Soi thử", tách khỏi
 * OracleBrain để component chỉ còn lo UI/timing. Validate ngày sinh + thông
 * báo lỗi giữ NGUYÊN như bản gốc; xem OracleBrain.tsx (onSoi) cho phần
 * reducedRef/timerRef (700ms delay vs show ngay) vẫn ở component.
 */
export async function computeReveal({
  birthDate,
  birthTime,
}: {
  birthDate: string;
  birthTime: string;
}): Promise<{ result: Reveal } | { error: string }> {
  const m = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    return { error: 'Chọn ngày sinh dương lịch của bạn.' };
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  try {
    const [banMenh, cung, conGiap, baziMod, conGiapData, nguHanh] = await Promise.all([
      import('@/lib/ban-menh-data'),
      import('@/lib/cung-hoang-dao-data'),
      import('@/lib/con-giap-animal'),
      import('@/lib/bazi'),
      import('@/lib/con-giap-data'),
      import('@/lib/ngu-hanh-remedy'),
    ]);
    const hm = birthTime.match(/^(\d{1,2}):(\d{2})$/);
    const hour = hm ? Number(hm[1]) : 12;
    const hasTime = hm != null && hour >= 0 && hour <= 23;
    // Tính Bát Tự TRƯỚC — engine đã xử lý ranh giới LẬP XUÂN (meta.solarYearForPillar
    // = năm âm chuẩn mệnh học). Lăng kính Cổ học tra 60 Giáp Tý theo ĐÚNG năm này
    // → người sinh tháng 1–đầu tháng 2 (trước Lập Xuân) không còn bị gán nhầm
    // con giáp/can chi/mệnh, và 2 lăng kính Đông + Bát Tự luôn khớp nhau.
    // asOf = hôm nay (tính tại thời điểm bấm — event handler, không đụng SSR)
    // để engine trả LƯU NIÊN (vận năm nay). Đại vận cần giới tính → teaser bỏ qua.
    const now = new Date();
    const asOf = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')}`;
    const chart = baziMod.calculateBazi({
      birthSolarDate: birthDate,
      birthHour: hasTime ? hour : 12,
      asOf,
    });
    const lunarYear = chart.meta.solarYearForPillar;
    const dong = banMenh.buildBanMenh(lunarYear);
    if (!dong) {
      return { error: 'Năm sinh cần trong khoảng 1950–2026.' };
    }
    // Tầng chiều sâu — TOÀN dữ liệu chuẩn từ engine sẵn có (không bịa):
    // tính cách tuổi (con-giap-data), hướng tốt + lời khuyên (ngu-hanh-remedy),
    // chi tiết cung (buildCung: chủ quản/điểm mạnh/công việc/cung đối).
    const cgd = conGiapData.buildConGiap(dong.zodiac.slug);
    const remedy = nguHanh.getNguHanhRemedy(dong.elementName);
    const sun = cung.sunSignFromDate(y, mo, d);
    const found = cung.listCung().find((c) => c.slug === sun.slug);
    const detail = cung.buildCung(sun.slug);
    const tay: Lens | null =
      found && detail
        ? {
            name: found.name,
            symbol: found.symbol,
            tagline: found.tagline,
            element: found.element,
            quality: found.quality,
            rulingPlanet: detail.extra.rulingPlanet,
            strengths: detail.extra.strengths.slice(0, 2),
            growthEdge: detail.extra.growthEdges[0] ?? null,
            love: detail.extra.love,
            work: detail.extra.work,
            opposite: detail.opposite.name,
          }
        : null;
    const bazi: Bazi = {
      dayCan: chart.dayMaster.can,
      dayEl: chart.dayMaster.element,
      dayYang: chart.dayMaster.yang,
      yearPillar: `${chart.year.can} ${chart.year.chi}`,
      monthPillar: `${chart.month.can} ${chart.month.chi}`,
      dayPillar: `${chart.day.can} ${chart.day.chi}`,
      monthTenGod: chart.month.tenGod,
      hourPillar: hasTime ? `${chart.hour.can} ${chart.hour.chi}` : null,
      strongest: hasTime ? chart.strongest : null,
      missing: hasTime ? chart.missing : [],
      hourTenGod: hasTime ? chart.hour.tenGod : null,
      elementCount: hasTime ? chart.elementCount : null,
      thanSat: hasTime
        ? chart.thanSat.slice(0, 2).map((t) => ({ name: t.name, meaning: t.meaning }))
        : [],
      relations: hasTime
        ? chart.relations.slice(0, 2).map((r) => ({ type: r.type, chi: r.chi, detail: r.detail }))
        : [],
      namNay:
        hasTime && chart.luuNien
          ? {
              label: `${chart.luuNien.year} (${chart.luuNien.can} ${chart.luuNien.chi})`,
              tenGod: chart.luuNien.tenGod,
            }
          : null,
    };
    const result: Reveal = {
      dong,
      conVat: conGiap.conVatOf(dong.zodiac.ten),
      cg: cgd
        ? {
            tagline: cgd.extra.tagline,
            strengths: cgd.extra.strengths.slice(0, 2),
            growthEdge: cgd.extra.growthEdges[0] ?? null,
            love: cgd.extra.love,
          }
        : null,
      huongTot: remedy?.huongTot ?? [],
      vatPham: remedy?.vatPham?.slice(0, 2) ?? [],
      loiKhuyen: remedy?.loiKhuyen?.[0] ?? null,
      tay,
      nearCusp: sun.nearCusp,
      bazi,
      lunarAdjusted: lunarYear !== y,
    };
    return { result };
  } catch {
    return { error: 'Chưa soi được, thử lại nhé.' };
  }
}
