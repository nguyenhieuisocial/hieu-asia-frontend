/**
 * Sinh ảnh splash iOS vào `public/splash/`.
 *
 * Chạy: `pnpm --filter web gen:splash`
 *
 * Chạy thẳng bằng `node`, KHÔNG cần `tsx`: Node 22.18+ tự bóc chú thích kiểu
 * cho file `.ts`. Vì vậy import bên dưới phải ghi rõ đuôi `.ts` (Node ESM đòi
 * đuôi đầy đủ). `tsc --noEmit` không đụng tới file này — `tsconfig.json` chỉ
 * `include` thư mục `src/` — nên đuôi `.ts` trong import không gây lỗi kiểu.
 *
 * Ảnh sinh ra ĐƯỢC COMMIT vào repo (không sinh lúc build): chúng chỉ đổi khi
 * logo hoặc danh sách máy đổi, mà cả hai đều hiếm. Sinh lúc build thì mỗi lần
 * dựng lại tốn thêm ~18 lần xử lý ảnh cho một thứ đứng yên.
 *
 * Nguồn danh sách máy + hằng số: `src/lib/pwa/apple-splash-screens.ts`.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  APPLE_SPLASH_SCREENS,
  SPLASH_BACKGROUND,
  SPLASH_LOGO_RATIO,
  SPLASH_LOGO_SOURCE,
  tenFileSplash,
} from '../src/lib/pwa/apple-splash-screens.ts';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NGUON_LOGO = path.join(GOC, 'public', SPLASH_LOGO_SOURCE);
const THU_MUC_RA = path.join(GOC, 'public', 'splash');

/** '#0a0a0c' → [10, 10, 12] */
function docHex(hex: string): [number, number, number] {
  const s = hex.replace('#', '');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

type HinhHocO = {
  /** Hộp bao ô logo trong ảnh nguồn. */
  readonly left: number;
  readonly top: number;
  readonly canh: number;
  /** Bán kính bo góc, tính theo cạnh của hộp (0 = không cần cắt góc). */
  readonly banKinh: number;
};

/**
 * Dò hình học ô logo trong ảnh nguồn — và đây là chỗ sửa TẬN GỐC một lỗi thật
 * của bộ ảnh thương hiệu, không phải phòng xa.
 *
 * ĐÃ ĐO 10/08/2026 trên `icon-maskable-512.png`: viền ngoài 20% đúng là nền tối
 * #0a0a0c, NHƯNG ô logo bên trong (51,51)→(459,459) lại mang theo NỀN TRẮNG của
 * ảnh gốc ở 4 góc — tức bản "maskable" được tạo bằng cách dán `icon-512.png`
 * (nền trắng) vào giữa một khung tối. Dán thẳng ô đó lên nền tối ⇒ hiện 4 mảng
 * trắng quanh ô bo tròn. Bản nháp đầu của script này đã sinh ra đúng 18 ảnh hỏng
 * như vậy; chỉ nhìn ảnh thật mới thấy — mọi phép đo màu ở 4 GÓC ẢNH đều "xanh"
 * vì chúng rơi vào phần viền tối.
 *
 * Cách xử lý: cắt lấy đúng ô logo rồi áp mặt nạ bo góc ⇒ 4 góc trắng thành
 * trong suốt, nền splash lộ ra, ô logo hiện đúng dáng app tile.
 * Đã kiểm: **0** pixel trắng nằm ngoài vùng 4 góc, nên cắt góc là sạch hoàn toàn.
 *
 * Dò động chứ không ghim số: hôm nào bộ icon được làm lại cho đúng (nền tối
 * tràn viền, hoặc có alpha thật) thì hàm này không thấy pixel trắng nào và tự
 * bỏ qua bước cắt — không phải sửa script.
 */
async function doHinhHocO(): Promise<HinhHocO | null> {
  const { data, info } = await sharp(NGUON_LOGO)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const trang = (x: number, y: number) => {
    const i = (y * w + x) * 3;
    return data[i]! > 200 && data[i + 1]! > 200 && data[i + 2]! > 200;
  };

  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!trang(x, y)) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null; // Không có vệt trắng nào ⇒ ảnh nguồn đã sạch.

  const canh = maxX - minX + 1;
  if (canh !== maxY - minY + 1) {
    throw new Error(
      `Vùng trắng trong ${SPLASH_LOGO_SOURCE} không vuông ` +
        `(${canh}×${maxY - minY + 1}) — không đoán được dáng ô logo. Kiểm ảnh bằng mắt.`,
    );
  }

  // Bán kính = số pixel trắng liên tiếp tính từ mép trên-trái của ô.
  let banKinh = 0;
  while (banKinh < canh && trang(minX + banKinh, minY)) banKinh++;

  // Chốt: mọi pixel trắng phải nằm gọn trong 4 góc, nếu không thì cắt góc
  // KHÔNG đủ và sẽ còn trắng sót lại — dừng thay vì sinh ảnh hỏng.
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!trang(x, y)) continue;
      const dx = Math.min(x - minX, maxX - x);
      const dy = Math.min(y - minY, maxY - y);
      if (dx > banKinh || dy > banKinh) {
        throw new Error(
          `${SPLASH_LOGO_SOURCE} có pixel trắng ở (${x},${y}) — NGOÀI vùng 4 góc bo tròn. ` +
            `Cắt bo góc sẽ không xoá hết trắng. Cần làm lại ảnh nguồn.`,
        );
      }
    }
  }

  return { left: minX, top: minY, canh, banKinh };
}

/** Kiểm nền ngoài của ảnh nguồn có khớp nền splash không (để ghép liền mạch). */
async function kiemNenLogo() {
  const { data, info } = await sharp(NGUON_LOGO).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const diem = (x: number, y: number) => {
    const i = (y * w + x) * c;
    return [data[i]!, data[i + 1]!, data[i + 2]!] as [number, number, number];
  };
  const goc = [diem(1, 1), diem(w - 2, 1), diem(1, h - 2), diem(w - 2, h - 2)];
  const mong = docHex(SPLASH_BACKGROUND);

  const lech = goc.filter((g) => g.some((v, i) => Math.abs(v - mong[i]!) > 1));
  if (lech.length > 0) {
    const thay = goc.map((g) => `rgb(${g.join(',')})`).join(' · ');
    throw new Error(
      `Nền của ${SPLASH_LOGO_SOURCE} KHÔNG khớp SPLASH_BACKGROUND (${SPLASH_BACKGROUND}).\n` +
        `  4 góc đo được: ${thay}\n` +
        `  Sửa: đổi SPLASH_BACKGROUND cho khớp ảnh, hoặc dùng ảnh nguồn có nền đúng màu.`,
    );
  }
}

/**
 * Dựng ảnh logo (đã bo góc, nền trong suốt) ở đúng cỡ yêu cầu.
 *
 * ⚠️ THỨ TỰ QUAN TRỌNG — cắt góc TRƯỚC, thu nhỏ SAU. Làm ngược lại (thu nhỏ
 * rồi mới cắt) thì phép thu nhỏ đã kịp trộn màu trắng ở 4 góc vào các pixel
 * rìa ô logo, cắt xong vẫn còn một VIỀN SÁNG mảnh chạy quanh ô — đã sinh ra
 * đúng lỗi đó một lần và chỉ nhìn ảnh thật mới phát hiện.
 * Cắt trước thì phần trắng biến thành trong suốt ngay khi ảnh còn nguyên độ
 * phân giải; sharp thu nhỏ ảnh có alpha theo kiểu premultiplied nên rìa hoà
 * vào nền chứ không hoà vào trắng.
 *
 * `NEP_TRONG` ăn thêm vài pixel vào trong để nuốt luôn dải khử răng cưa giữa
 * trắng và ô logo — dải đó không trắng hẳn nên phép dò ở trên không bắt.
 *
 * Vì sao 4 chứ không phải 1–2: góc ô logo là dáng "squircle" (siêu elip kiểu
 * icon iOS) chứ không phải cung tròn, nên mặt nạ bo-góc-tròn cắt hơi chệch và
 * để sót vệt sáng mảnh ĐÚNG TRÊN CUNG GÓC — cạnh thẳng thì sạch. Đã đo thử
 * nếp 2/4/6/8/10, đếm pixel sáng còn sót trong 4 góc: nếp 2 còn 163 pixel,
 * từ nếp 4 trở lên là 0. Lấy 4 — nhỏ nhất mà sạch (ăn vào 1% cạnh ô, không
 * nhìn ra được).
 */
const NEP_TRONG = 4;

async function dungLogo(o: HinhHocO | null, canhDich: number): Promise<Buffer> {
  if (!o) return sharp(NGUON_LOGO).resize(canhDich, canhDich).png().toBuffer();

  const canh = o.canh - NEP_TRONG * 2;
  const r = Math.max(0, o.banKinh - NEP_TRONG);
  const oLogo = await sharp(NGUON_LOGO)
    .extract({ left: o.left + NEP_TRONG, top: o.top + NEP_TRONG, width: canh, height: canh })
    .ensureAlpha()
    .png()
    .toBuffer();

  const matNa = Buffer.from(
    `<svg width="${canh}" height="${canh}">` +
      `<rect width="${canh}" height="${canh}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
  );

  // ⚠️ PHẢI tách hai lần `sharp(...)`. Trong một pipeline, sharp luôn chạy
  // `resize` TRƯỚC `composite` bất kể mình gọi theo thứ tự nào — gộp chung thì
  // ảnh nền bị thu nhỏ trước rồi mặt nạ cỡ gốc đắp lên, sharp báo
  // "Image to composite must have same dimensions or smaller". Ghi lại vì lỗi
  // này đọc như lỗi tính toán cỡ, trong khi thật ra là thứ tự pipeline.
  const daBoGoc = await sharp(oLogo)
    .composite([{ input: matNa, blend: 'dest-in' }])
    .png()
    .toBuffer();

  return sharp(daBoGoc).resize(canhDich, canhDich).png().toBuffer();
}

async function main() {
  await kiemNenLogo();
  const o = await doHinhHocO();
  console.log(
    o
      ? `Ô logo: (${o.left},${o.top}) cạnh ${o.canh}, bo góc r=${o.banKinh} — sẽ cắt & bo để bỏ 4 góc trắng.`
      : 'Ảnh nguồn không có vệt trắng nào — dùng nguyên ảnh, không cắt.',
  );

  await mkdir(THU_MUC_RA, { recursive: true });

  let tongByte = 0;
  for (const man of APPLE_SPLASH_SCREENS) {
    const rongPx = man.width * man.dpr;
    const caoPx = man.height * man.dpr;
    const canhLogo = Math.round(Math.min(rongPx, caoPx) * SPLASH_LOGO_RATIO);

    const logo = await dungLogo(o, canhLogo);

    const anh = await sharp({
      create: { width: rongPx, height: caoPx, channels: 4, background: SPLASH_BACKGROUND },
    })
      // `gravity: 'centre'` — sharp tự canh giữa, không tự tính toạ độ nên
      // không lệch một pixel ở cỡ lẻ.
      .composite([{ input: logo, gravity: 'centre' }])
      // `palette: true` giảm một nửa dung lượng (2048×2732: 419 KB → 200 KB).
      // Đã đo sai lệch so với bản đủ màu: trung bình 0.016/255, chỉ 0.09% số
      // kênh lệch quá 2 — nằm ở rìa dải màu của logo, mắt không thấy. Ảnh này
      // hiện chưa tới một giây lúc mở app nên đánh đổi quá hời.
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();

    const duongRa = path.join(THU_MUC_RA, tenFileSplash(man));
    await writeFile(duongRa, anh);
    tongByte += anh.length;
    console.log(
      `✓ ${tenFileSplash(man).padEnd(30)} ${rongPx}×${caoPx}` +
        `  ${(anh.length / 1024).toFixed(0).padStart(4)} KB  — ${man.may}`,
    );
  }

  console.log(
    `\nXong: ${APPLE_SPLASH_SCREENS.length} ảnh, tổng ${(tongByte / 1024 / 1024).toFixed(1)} MB ` +
      `trong public/splash/`,
  );
}

main().catch((e) => {
  console.error(`\ngen-apple-splash THẤT BẠI:\n${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
