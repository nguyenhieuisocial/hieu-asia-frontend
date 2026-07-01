/**
 * Địa chi → con vật ("cầm tinh") theo quy ước VIỆT NAM (Mão = Mèo, không phải Thỏ).
 *
 * Vì sao cần: nguồn ZODIAC (hop-tuoi-pairs) lưu `ten` là ĐỊA CHI ("Ngọ", "Mão"),
 * KHÔNG phải con vật. Nên "con ${ten}" ra "con Ngọ" — sai. Tầng trình bày phải
 * đổi sang con vật ("con Ngựa", "con Mèo"). Đây là NGUỒN DUY NHẤT của phép đổi đó
 * để không ai lặp lại lỗi "con {địa chi}".
 */
const CHI_CON_VAT: Record<string, string> = {
  Tý: 'Chuột',
  Sửu: 'Trâu',
  Dần: 'Hổ',
  Mão: 'Mèo',
  Thìn: 'Rồng',
  Tỵ: 'Rắn',
  Ngọ: 'Ngựa',
  Mùi: 'Dê',
  Thân: 'Khỉ',
  Dậu: 'Gà',
  Tuất: 'Chó',
  Hợi: 'Lợn',
};

/** Trả về con vật của một địa chi (VD "Ngọ" → "Ngựa"). Không khớp → trả nguyên. */
export function conVatOf(chi: string): string {
  return CHI_CON_VAT[chi.trim()] ?? chi;
}
