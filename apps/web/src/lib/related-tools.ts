/**
 * Sổ đăng ký "công cụ liên quan" — nguồn duy nhất để thiết kế cross-link giữa
 * các trang công cụ. Gom theo nhóm chủ đề; mỗi công cụ trỏ tới 3–4 công cụ
 * cùng/cận nhóm. RelatedTools tự thêm link về hub /cong-cu.
 *
 * Key = đường dẫn route của trang công cụ.
 */

export interface RelatedLink {
  href: string;
  label: string;
}

// Nhãn dùng lại cho gọn.
const L = {
  tuvi: { href: '/tu-vi', label: 'Tử Vi' },
  bangchung: { href: '/bang-chung', label: 'Bằng Chứng (kiểm chứng lá số)' },
  laso: { href: '/la-so-tu-vi', label: 'Xem lá số Tử Vi' },
  battu: { href: '/bat-tu', label: 'Bát Tự' },
  thanso: { href: '/than-so-hoc', label: 'Thần số học' },
  canxuong: { href: '/can-xuong', label: 'Cân xương' },
  menhcuc: { href: '/tinh-menh-cuc', label: 'Tính Mệnh Cục' },
  mbti: { href: '/mbti', label: 'MBTI' },
  bigfive: { href: '/big-five', label: 'Big Five' },
  disc: { href: '/disc', label: 'DISC' },
  enneagram: { href: '/enneagram', label: 'Enneagram' },
  gieoque: { href: '/gieo-que', label: 'Gieo quẻ Kinh Dịch' },
  tarot: { href: '/tarot', label: 'Tarot' },
  xemtuong: { href: '/xem-tuong', label: 'Xem tướng' },
  lichvannien: { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
  xemngay: { href: '/xem-ngay', label: 'Xem ngày tốt' },
  saohan: { href: '/sao-han', label: 'Xem sao hạn' },
  giohoangdao: { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
  ngaykiengky: { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
  datten: { href: '/dat-ten-ngu-hanh', label: 'Đặt tên ngũ hành' },
  hoptuoi: { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
  hopnhom: { href: '/xem-hop-nhom', label: 'Hợp nhóm' },
  compat: { href: '/compatibility', label: 'Hợp đôi' },
  careerfit: { href: '/career-fit', label: 'Nghề phù hợp' },
  thuocloban: { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban' },
  sosanh: { href: '/so-sanh', label: 'So sánh lăng kính' },
  hoidap: { href: '/hoi-dap', label: 'Hỏi đáp' },
  tuvi2026: { href: '/tu-vi-2026', label: 'Tử Vi 2026' },
  tuvi2027: { href: '/tu-vi-2027', label: 'Tử Vi 2027' },
  tuvihomnay: { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
  tuvinghe: { href: '/tu-vi-nghe-nghiep', label: 'Tử Vi sự nghiệp' },
  tuvitinhyeu: { href: '/tu-vi-tinh-yeu', label: 'Tử Vi tình yêu' },
  tuvitaichinh: { href: '/tu-vi-tai-chinh', label: 'Tử Vi tài chính' },
  // 2026-06-22: bổ sung để bật "Công cụ liên quan" cho 16 trang còn thiếu.
  banDoSao: { href: '/ban-do-sao', label: 'Bản đồ sao' },
  cungHoangDao: { href: '/cung-hoang-dao', label: 'Cung hoàng đạo' },
  laSoBatTu: { href: '/la-so-bat-tu', label: 'Xem lá số Bát Tự' },
  banMenh: { href: '/ban-menh', label: 'Ngũ hành bản mệnh' },
  daiVan: { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
  xuatHanh: { href: '/xuat-hanh', label: 'Hướng & giờ xuất hành' },
  sinhCon: { href: '/sinh-con', label: 'Sinh con theo năm' },
  xemTuoiCuoi: { href: '/xem-tuoi-cuoi', label: 'Xem tuổi cưới' },
  xemTuoiLamNha: { href: '/xem-tuoi-lam-nha', label: 'Xem tuổi làm nhà' },
  khaiTruong: { href: '/khai-truong', label: 'Xem tuổi khai trương' },
  xongDat: { href: '/xong-dat', label: 'Tuổi xông đất' },
  huongNha: { href: '/huong-nha', label: 'Xem hướng nhà' },
  familyProfiles: { href: '/family-profiles', label: 'Hồ sơ gia đình' },
  decisionSim: { href: '/decision-simulator', label: 'Mô phỏng quyết định' },
  timelineL: { href: '/timeline', label: 'Timeline đại vận' },
  tamTai: { href: '/tam-tai', label: 'Tam Tai' },
  kimLau: { href: '/kim-lau', label: 'Kim Lâu (tuổi cưới)' },
} as const;

export const RELATED_TOOLS: Record<string, RelatedLink[]> = {
  // Tử Vi / mệnh lý Á Đông
  '/tu-vi': [L.tuvi2027, L.battu, L.thanso, L.menhcuc, L.lichvannien, L.bangchung],
  '/bang-chung': [L.laso, L.tuvi, L.battu],
  '/bat-tu': [L.tuvi, L.thanso, L.canxuong, L.datten],
  '/than-so-hoc': [L.tuvi, L.battu, L.mbti, L.canxuong],
  '/can-xuong': [L.tuvi, L.battu, L.thanso, L.saohan],
  '/tinh-menh-cuc': [L.tuvi, L.battu, L.thanso, L.bangchung],
  '/tu-vi-2026': [L.tuvi, L.tuvi2027, L.saohan, L.tuvihomnay, L.bangchung],
  '/tu-vi-2027': [L.tuvi, L.saohan, L.tuvihomnay, L.tuvi2026, L.lichvannien],
  '/tu-vi-hom-nay': [L.tuvi, L.tuvi2026, L.tuvi2027, L.lichvannien],
  '/tu-vi-nghe-nghiep': [L.tuvi, L.careerfit, L.battu],
  '/tu-vi-tinh-yeu': [L.tuvi, L.hoptuoi, L.compat],
  '/tu-vi-tai-chinh': [L.tuvi, L.battu, L.tuvinghe],
  // Tâm lý học
  '/mbti': [L.bigfive, L.disc, L.enneagram, L.sosanh],
  '/big-five': [L.mbti, L.disc, L.enneagram, L.sosanh],
  '/disc': [L.mbti, L.bigfive, L.enneagram, L.careerfit],
  '/enneagram': [L.mbti, L.bigfive, L.disc, L.sosanh],
  // Chiêm nghiệm / phản tư
  '/gieo-que': [L.tarot, L.xemtuong, L.tuvi],
  '/tarot': [L.gieoque, L.xemtuong, L.mbti],
  '/xem-tuong': [L.tuvi, L.gieoque, L.thanso],
  // Lịch & ngày giờ
  '/lich-van-nien': [L.xemngay, L.giohoangdao, L.ngaykiengky, L.saohan],
  // Tương hợp
  '/hop-tuoi': [L.hopnhom, L.compat, L.datten, L.saohan],
  '/xem-hop-nhom': [L.hoptuoi, L.compat, L.mbti],
  '/compatibility': [L.hoptuoi, L.hopnhom, L.mbti],
  // Khác
  '/career-fit': [L.mbti, L.disc, L.tuvinghe],
  '/thuoc-lo-ban': [L.lichvannien, L.giohoangdao, L.xemngay],
  '/so-sanh': [L.mbti, L.bigfive, L.disc],
  '/hoi-dap': [L.tuvi, L.mbti, L.gieoque],
  // 2026-06-22: 16 map mới (suy theo 7 nhóm /cong-cu — cùng nhóm = liên quan).
  // Lá số
  '/la-so-tu-vi': [L.laSoBatTu, L.tuvi, L.menhcuc, L.bangchung],
  '/la-so-bat-tu': [L.laso, L.battu, L.banMenh, L.menhcuc],
  // Hiểu bản thân (chiêm tinh Tây)
  '/ban-do-sao': [L.cungHoangDao, L.mbti, L.bigfive, L.xemtuong],
  // Vận trình & thời gian
  '/sao-han': [L.tuvihomnay, L.tuvi2026, L.daiVan, L.lichvannien],
  // Xem ngày – giờ
  '/xem-ngay': [L.lichvannien, L.giohoangdao, L.ngaykiengky, L.xuatHanh],
  '/gio-hoang-dao': [L.xemngay, L.ngaykiengky, L.xuatHanh, L.lichvannien],
  '/ngay-kieng-ky': [L.xemngay, L.giohoangdao, L.lichvannien, L.xuatHanh],
  '/xuat-hanh': [L.giohoangdao, L.xemngay, L.ngaykiengky, L.lichvannien],
  // Xem tuổi việc lớn
  '/xem-tuoi-cuoi': [L.kimLau, L.tamTai, L.hoptuoi, L.xemngay, L.xemTuoiLamNha],
  '/xem-tuoi-lam-nha': [L.tamTai, L.huongNha, L.xemngay, L.thuocloban, L.xemTuoiCuoi],
  '/khai-truong': [L.tamTai, L.xemngay, L.xemTuoiCuoi, L.hoptuoi, L.saohan],
  '/xong-dat': [L.hoptuoi, L.xemTuoiCuoi, L.tuvi2027, L.xemngay],
  '/huong-nha': [L.xemTuoiLamNha, L.thuocloban, L.xemngay, L.banMenh],
  '/tam-tai': [L.xemTuoiCuoi, L.kimLau, L.saohan, L.hoptuoi],
  '/kim-lau': [L.xemTuoiCuoi, L.tamTai, L.xemngay, L.hoptuoi],
  // Quan hệ & gia đình
  '/sinh-con': [L.datten, L.hoptuoi, L.banMenh, L.xemTuoiCuoi],
  '/dat-ten-ngu-hanh': [L.sinhCon, L.banMenh, L.battu],
  // Khám phá & tự kiểm
  '/tu-kiem': [L.sosanh, L.hoidap, L.gieoque, L.tarot],
  // 2026-06-22 wave 2: 4 trang hero-riêng còn thiếu (tinh-menh-cuc đã có map sẵn).
  '/dai-van-hien-tai': [L.timelineL, L.tuvihomnay, L.saohan, L.tuvi2027],
  '/timeline': [L.daiVan, L.tuvi2027, L.saohan, L.tuvihomnay],
  '/family-profiles': [L.hopnhom, L.compat, L.hoptuoi, L.sinhCon],
  '/decision-simulator': [L.sosanh, L.careerfit, L.mbti, L.gieoque],
};
