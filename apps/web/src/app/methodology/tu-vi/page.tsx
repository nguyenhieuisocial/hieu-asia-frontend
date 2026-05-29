import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Star,
  Database,
  Brain,
  Shield,
  Cpu,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  // Wave 54 BUG-034: rename "Methodology" → "Phương pháp" for VN consistency
  // (matches Wave 52.1 + 52 close-out sublink renames). Template appends
  // " · hieu.asia" automatically from root layout, so don't include it here.
  title:
    'Phương pháp Tử Vi — Trường phái, an sao, đại vận, lưu niên',
  description:
    'Chi tiết phương pháp Tử Vi Bắc phái dùng tại hieu.asia: 114 sao chính/phụ, cách an Mệnh-Thân-Cục, đại vận, lưu niên, và đường phân định engine vs AI.',
  alternates: { canonical: 'https://hieu.asia/methodology/tu-vi' },
  openGraph: {
    title: 'Phương pháp Tử Vi',
    description:
      'Tử Vi Bắc phái: cách an sao, đại vận, lưu niên — và lằn ranh engine deterministic vs AI/LLM.',
    url: 'https://hieu.asia/methodology/tu-vi',
    type: 'article',
  },
};

const CHINH_TINH: { name: string; slug: string }[] = [
  { name: 'Tử Vi', slug: 'tu-vi' },
  { name: 'Thiên Cơ', slug: 'thien-co' },
  { name: 'Thái Dương', slug: 'thai-duong' },
  { name: 'Vũ Khúc', slug: 'vu-khuc' },
  { name: 'Thiên Đồng', slug: 'thien-dong' },
  { name: 'Liêm Trinh', slug: 'liem-trinh' },
  { name: 'Thiên Phủ', slug: 'thien-phu' },
  { name: 'Thái Âm', slug: 'thai-am' },
  { name: 'Tham Lang', slug: 'tham-lang' },
  { name: 'Cự Môn', slug: 'cu-mon' },
  { name: 'Thiên Tướng', slug: 'thien-tuong' },
  { name: 'Thiên Lương', slug: 'thien-luong' },
  { name: 'Thất Sát', slug: 'that-sat' },
  { name: 'Phá Quân', slug: 'pha-quan' },
];

const PHU_TINH: { name: string; slug: string }[] = [
  { name: 'Tả Phụ', slug: 'ta-phu' },
  { name: 'Hữu Bật', slug: 'huu-bat' },
  { name: 'Văn Xương', slug: 'van-xuong' },
  { name: 'Văn Khúc', slug: 'van-khuc' },
  { name: 'Khôi Việt', slug: 'khoi-viet' },
  { name: 'Lộc Tồn', slug: 'loc-ton' },
  { name: 'Kình Đà', slug: 'kinh-da' },
  { name: 'Hỏa Linh', slug: 'hoa-linh' },
  { name: 'Hoá Lộc', slug: 'hoa-loc' },
  { name: 'Hoá Kỵ', slug: 'hoa-ky' },
];

const SAO_NHO: string[] = [
  'Thiên Mã',
  'Long Trì',
  'Phượng Các',
  'Thiên Hỉ',
  'Hồng Loan',
  'Đào Hoa',
  'Thiên Khốc',
  'Thiên Hư',
  'Cô Thần',
  'Quả Tú',
  'Phục Binh',
  'Quan Phù',
  'Thanh Long',
  'Tiểu Hao',
  'Đại Hao',
  'Tử Phù',
  'Tang Môn',
  'Bạch Hổ',
  'Thiên Đức',
  'Nguyệt Đức',
  'Giải Thần',
  'Thiên Khôi',
  'Thiên Việt',
  'Thiên Quan',
  'Thiên Phúc',
  'Thai Phụ',
  'Phong Cáo',
  'Tam Thai',
  'Bát Toạ',
  'Ân Quang',
  'Thiên Quý',
  'Long Đức',
  'Nguyệt Đức quý nhân',
  'Hoa Cái',
  'Kiếp Sát',
  'Đại Sát',
  'Phi Liêm',
  'Hỉ Thần',
  'Bệnh Phù',
  'Điếu Khách',
  'Trực Phù',
  'Lưu Hà',
  'Thiên Không',
  'Địa Không',
  'Địa Kiếp',
  'Thiên Hình',
  'Thiên Diêu',
  'Đẩu Quân',
  'Tướng Quân',
  'Tấu Thư',
];

// §5.1 — Full 114-star list with metadata
type StarRow = {
  name: string;
  group: string;
  basis: string;
  defaultShow: string;
  note?: string;
};

const STARS_114: StarRow[] = [
  // 14 chính tinh
  { name: 'Tử Vi', group: 'Chính tinh', basis: 'Cục + ngày âm', defaultShow: 'Có', note: 'Đế tinh — gốc an sao' },
  { name: 'Thiên Cơ', group: 'Chính tinh', basis: 'Vị trí Tử Vi', defaultShow: 'Có' },
  { name: 'Thái Dương', group: 'Chính tinh', basis: 'Vị trí Tử Vi', defaultShow: 'Có' },
  { name: 'Vũ Khúc', group: 'Chính tinh', basis: 'Vị trí Tử Vi', defaultShow: 'Có' },
  { name: 'Thiên Đồng', group: 'Chính tinh', basis: 'Vị trí Tử Vi', defaultShow: 'Có' },
  { name: 'Liêm Trinh', group: 'Chính tinh', basis: 'Vị trí Tử Vi', defaultShow: 'Có' },
  { name: 'Thiên Phủ', group: 'Chính tinh', basis: 'Đối xứng Tử Vi qua Dần-Thân', defaultShow: 'Có' },
  { name: 'Thái Âm', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },
  { name: 'Tham Lang', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },
  { name: 'Cự Môn', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },
  { name: 'Thiên Tướng', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },
  { name: 'Thiên Lương', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },
  { name: 'Thất Sát', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },
  { name: 'Phá Quân', group: 'Chính tinh', basis: 'Vị trí Thiên Phủ', defaultShow: 'Có' },

  // 10 phụ tinh chính
  { name: 'Tả Phụ', group: 'Phụ tinh chính', basis: 'Tháng âm', defaultShow: 'Có' },
  { name: 'Hữu Bật', group: 'Phụ tinh chính', basis: 'Tháng âm', defaultShow: 'Có' },
  { name: 'Văn Xương', group: 'Phụ tinh chính', basis: 'Giờ sinh', defaultShow: 'Có' },
  { name: 'Văn Khúc', group: 'Phụ tinh chính', basis: 'Giờ sinh', defaultShow: 'Có' },
  { name: 'Thiên Khôi', group: 'Phụ tinh chính', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Thiên Việt', group: 'Phụ tinh chính', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Lộc Tồn', group: 'Phụ tinh chính', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Kình Dương', group: 'Phụ tinh chính', basis: 'Can năm (cạnh Lộc Tồn)', defaultShow: 'Có' },
  { name: 'Đà La', group: 'Phụ tinh chính', basis: 'Can năm (cạnh Lộc Tồn)', defaultShow: 'Có' },
  { name: 'Hoả Tinh', group: 'Phụ tinh chính', basis: 'Chi năm + giờ', defaultShow: 'Có' },
  { name: 'Linh Tinh', group: 'Phụ tinh chính', basis: 'Chi năm + giờ', defaultShow: 'Có' },

  // 4 Tứ Hoá
  { name: 'Hoá Lộc', group: 'Tứ Hoá', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Hoá Quyền', group: 'Tứ Hoá', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Hoá Khoa', group: 'Tứ Hoá', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Hoá Kỵ', group: 'Tứ Hoá', basis: 'Can năm', defaultShow: 'Có' },

  // ~12 sao cát phụ
  { name: 'Thiên Mã', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Long Trì', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Phượng Các', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Thiên Hỉ', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Hồng Loan', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Đào Hoa', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Hoa Cái', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Thiên Đức', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Nguyệt Đức', group: 'Sao cát/sao phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Giải Thần', group: 'Sao cát/sao phụ', basis: 'Tháng âm', defaultShow: 'Ẩn' },
  { name: 'Thiên Hình', group: 'Sao cát/sao phụ', basis: 'Tháng âm', defaultShow: 'Ẩn' },
  { name: 'Thiên Diêu', group: 'Sao cát/sao phụ', basis: 'Tháng âm', defaultShow: 'Ẩn' },

  // ~10 sao hung phụ
  { name: 'Cô Thần', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Quả Tú', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Thiên Khốc', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Thiên Hư', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Có' },
  { name: 'Tuần', group: 'Sao hung phụ', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Triệt', group: 'Sao hung phụ', basis: 'Can năm', defaultShow: 'Có' },
  { name: 'Kiếp Sát', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Ẩn' },
  { name: 'Đại Hao', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Ẩn' },
  { name: 'Tiểu Hao', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Ẩn' },
  { name: 'Phá Toái', group: 'Sao hung phụ', basis: 'Chi năm', defaultShow: 'Ẩn' },

  // 64 sao nhỏ + lưu sao
  { name: 'Phục Binh', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Quan Phù', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Lực Sĩ', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Thanh Long', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Thiếu Âm', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Thiếu Dương', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Tử Phù', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Bệnh Phù', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Tuế Phá', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Lưu Hà', group: 'Sao nhỏ/lưu sao', basis: 'Can năm', defaultShow: 'Ẩn' },
  { name: 'Phỉ Liêm', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Hỉ Thần', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Hoa Cái Lưu', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên', defaultShow: 'Ẩn' },
  { name: 'Cô Quả Lưu', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên', defaultShow: 'Ẩn' },
  { name: 'Thiên Quan', group: 'Sao nhỏ/lưu sao', basis: 'Can năm', defaultShow: 'Ẩn' },
  { name: 'Thiên Phúc', group: 'Sao nhỏ/lưu sao', basis: 'Can năm', defaultShow: 'Ẩn' },
  { name: 'Ân Quang', group: 'Sao nhỏ/lưu sao', basis: 'Vị trí Văn Xương', defaultShow: 'Ẩn' },
  { name: 'Thiên Quý', group: 'Sao nhỏ/lưu sao', basis: 'Vị trí Văn Khúc', defaultShow: 'Ẩn' },
  { name: 'Tam Thai', group: 'Sao nhỏ/lưu sao', basis: 'Tháng + Tả Phụ', defaultShow: 'Ẩn' },
  { name: 'Bát Toạ', group: 'Sao nhỏ/lưu sao', basis: 'Tháng + Hữu Bật', defaultShow: 'Ẩn' },
  { name: 'Đài Phụ', group: 'Sao nhỏ/lưu sao', basis: 'Giờ + Văn Xương', defaultShow: 'Ẩn' },
  { name: 'Phong Cáo', group: 'Sao nhỏ/lưu sao', basis: 'Giờ + Văn Khúc', defaultShow: 'Ẩn' },
  { name: 'Long Đức', group: 'Sao nhỏ/lưu sao', basis: 'Chi năm', defaultShow: 'Ẩn' },
  { name: 'Nguyệt Đức Lưu', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên', defaultShow: 'Ẩn' },
  { name: 'Tang Môn', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Bạch Hổ', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Điếu Khách', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Trực Phù', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Thiên Không', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Thái Tuế', defaultShow: 'Ẩn' },
  { name: 'Địa Không', group: 'Sao nhỏ/lưu sao', basis: 'Giờ sinh', defaultShow: 'Ẩn' },
  { name: 'Địa Kiếp', group: 'Sao nhỏ/lưu sao', basis: 'Giờ sinh', defaultShow: 'Ẩn' },
  { name: 'Tướng Quân', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Tấu Thư', group: 'Sao nhỏ/lưu sao', basis: 'Vòng Lộc Tồn', defaultShow: 'Ẩn' },
  { name: 'Đẩu Quân', group: 'Sao nhỏ/lưu sao', basis: 'Tháng âm + giờ', defaultShow: 'Ẩn' },
  { name: 'Thiên Trù', group: 'Sao nhỏ/lưu sao', basis: 'Can năm', defaultShow: 'Ẩn' },
  { name: 'Đại Sát', group: 'Sao nhỏ/lưu sao', basis: 'Chi năm', defaultShow: 'Ẩn' },
  { name: 'Thiên Tài', group: 'Sao nhỏ/lưu sao', basis: 'Năm + cung Mệnh', defaultShow: 'Ẩn' },
  { name: 'Thiên Thọ', group: 'Sao nhỏ/lưu sao', basis: 'Năm + cung Thân', defaultShow: 'Ẩn' },
  { name: 'Thiên Y', group: 'Sao nhỏ/lưu sao', basis: 'Tháng âm', defaultShow: 'Ẩn' },
  { name: 'Thiên Thương', group: 'Sao nhỏ/lưu sao', basis: 'Cung Nô Bộc + Thiên Di', defaultShow: 'Ẩn' },
  { name: 'Thiên Sứ', group: 'Sao nhỏ/lưu sao', basis: 'Cung Tật Ách', defaultShow: 'Ẩn' },
  { name: 'Lưu Lộc', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Kình', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Đà', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Khôi', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Việt', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Xương', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên', defaultShow: 'Ẩn' },
  { name: 'Lưu Khúc', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên', defaultShow: 'Ẩn' },
  { name: 'Lưu Mã', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hoá Lộc', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hoá Quyền', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hoá Khoa', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hoá Kỵ', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (can)', defaultShow: 'Ẩn' },
  { name: 'Lưu Tang', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hổ', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Khốc', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hư', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hồng', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Hỉ', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Đào', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Cô', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Quả', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Long', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Phượng', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Thái Tuế', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Tuế Phá', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Quan Phù', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Tử Phù', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Lưu Bệnh Phù', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên (chi)', defaultShow: 'Ẩn' },
  { name: 'Phá Quân Lưu', group: 'Sao nhỏ/lưu sao', basis: 'Lưu niên', defaultShow: 'Ẩn' },
];

const TODAY_ISO = '2026-05-21';

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Methodology Tử Vi — Trường phái, an sao, đại vận, lưu niên · hieu.asia',
  description:
    'Phương pháp Tử Vi Bắc phái dùng tại hieu.asia: cách an Mệnh-Thân-Cục, 14 chính tinh, 10 phụ tinh, đại vận, lưu niên, lằn ranh engine vs AI.',
  inLanguage: 'vi-VN',
  datePublished: '2026-05-22',
  dateModified: TODAY_ISO,
  author: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
  publisher: {
    '@type': 'Organization',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
  mainEntity: {
    '@type': 'Thing',
    name: 'Tử Vi Đẩu Số (Bắc phái)',
    description:
      'Hệ thống an sao Tử Vi theo nhánh Bắc phái Trần Đoàn — Hi Di, có dị bản Tử Vân và Liễu Vô Cư Sĩ.',
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phương pháp luận',
      item: 'https://hieu.asia/methodology',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Methodology Tử Vi',
      item: 'https://hieu.asia/methodology/tu-vi',
    },
  ],
};

// Table of contents for sticky sidebar
const TOC: { id: string; label: string }[] = [
  { id: 'truong-phai', label: '1. Trường phái' },
  { id: 'danh-sach-sao', label: '2. Danh sách sao' },
  { id: 'danh-sach-114', label: '2b. 114 sao đầy đủ' },
  { id: 'menh-than', label: '3. An Mệnh & Thân' },
  { id: 'an-chinh-tinh', label: '4. An chính tinh' },
  { id: 'phu-tinh-tu-hoa', label: '5. Phụ tinh & Tứ Hoá' },
  { id: 'dai-van', label: '6. Đại vận' },
  { id: 'luu-nien', label: '7. Lưu niên' },
  { id: 'nguon-quy-tac', label: '8. Dị bản & nguồn' },
  { id: 'cung-chu-de', label: '9. Cung theo chủ đề' },
  { id: 'edge-cases', label: '10. Trường hợp đặc biệt' },
  { id: 'rule-time-claims', label: '11. Quy tắc thời gian' },
  { id: 'modes', label: '12. Hai chế độ' },
  { id: 'ai-vs-engine', label: '13. AI vs Engine' },
  { id: 'gioi-han', label: '14. Giới hạn' },
];

export default function MethodologyTuViPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/methodology" className="hover:text-gold">
              Phương pháp luận
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Methodology Tử Vi</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
            Methodology · Tử Vi
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi Bắc phái — cách hieu.asia an sao, tính đại vận, lưu niên
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Trang này nói rõ trường phái Tử Vi mà engine hieu.asia dùng, danh sách sao,
            công thức an Mệnh-Thân-Cục, cách tính đại vận, lưu niên — và đường phân định
            phần nào do engine deterministic làm, phần nào do AI/LLM diễn giải.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold-700">
              <BookOpen className="h-3.5 w-3.5" aria-hidden /> Bắc phái Trần Đoàn
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5" aria-hidden /> 14 chính + 10 phụ + 90 sao nhỏ
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground">
              <Cpu className="h-3.5 w-3.5" aria-hidden /> Engine deterministic
            </span>
          </div>
        </section>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 lg:grid lg:grid-cols-[1fr_240px] lg:gap-8">
          <section className="space-y-6">
          {/* 1. Trường phái */}
          <h2 className="sr-only">Trường phái dùng tại hieu.asia</h2>
          <Card id="truong-phai" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                <BookOpen className="h-5 w-5 text-gold" aria-hidden /> Trường phái dùng
                tại hieu.asia
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Bắc phái — nhánh Trần Đoàn (Hi Di tiên sinh), có tham chiếu Tử Vân và Liễu
                Vô Cư Sĩ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                Engine của hieu.asia chạy theo <strong>Bắc phái</strong> (Tử Vi Đẩu Số
                phương Bắc), nhánh chủ yếu theo <em>Trần Đoàn — Hi Di tiên sinh</em> và
                các nhánh tiếp nối như <em>Tử Vân</em>, <em>Liễu Vô Cư Sĩ</em>.
              </p>
              <p>
                Lý do chọn Bắc phái: hệ thống an sao chặt chẽ, có nhiều tư liệu để kiểm
                chứng được, ít phụ thuộc vào "khẩu quyết" truyền miệng — phù hợp với engine
                deterministic.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-foreground/85">
                <strong className="text-gold-700">Caveat.</strong> Với một số luận điểm có dị
                biệt giữa <em>phái Trung Châu</em>, <em>Tử Vân</em>, <em>Liễu Vô</em> —
                chúng tôi ghi rõ ngay trong báo cáo, kèm chú thích chỗ nào engine theo
                Bắc phái mainstream và chỗ nào có dị bản.
              </p>
            </CardContent>
          </Card>

          {/* 2. Danh sách sao */}
          <h2 className="sr-only">Danh sách sao sử dụng</h2>
          <Card id="danh-sach-sao" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                <Star className="h-5 w-5 text-gold" aria-hidden /> Danh sách sao sử dụng
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                14 chính tinh + 10 phụ tinh chính + ~90 sao phụ/sao nhỏ. Tổng 114 sao
                trong engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <div>
                <h3 className="mb-2 font-heading text-base text-foreground">
                  14 chính tinh
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {CHINH_TINH.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/tu-vi/sao/${s.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs text-gold-700 hover:bg-gold/10"
                      >
                        {s.name}
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-heading text-base text-foreground">
                  10 phụ tinh chính
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {PHU_TINH.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/tu-vi/sao/${s.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-foreground/85 hover:border-gold/40 hover:text-gold"
                      >
                        {s.name}
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-heading text-base text-foreground">
                  Các sao phụ và sao nhỏ
                </h3>
                <p className="text-muted-foreground">{SAO_NHO.join(' · ')}</p>
                <p className="mt-3 rounded-lg border border-border bg-card/60 p-3 text-xs text-muted-foreground">
                  Đầy đủ 114 sao có trong engine; hiển thị tuỳ vào tầm quan trọng từng
                  cung — sao nào ảnh hưởng mạnh tới cung thì hiện rõ, sao "trang trí" thì
                  ẩn vào chi tiết.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* §5.1 — Danh sách 114 sao đầy đủ */}
          <h2 className="sr-only">Danh sách 114 sao đầy đủ</h2>
          <Card id="danh-sach-114" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Danh sách 114 sao đầy đủ
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Bảng tham chiếu — nhóm, căn cứ an, hiển thị mặc định. Tổng {STARS_114.length} sao.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground/80 sm:text-base">
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full text-left text-xs sm:text-sm">
                  <thead className="bg-card/60 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Sao</th>
                      <th className="px-3 py-2 font-medium">Nhóm</th>
                      <th className="px-3 py-2 font-medium">Căn cứ an</th>
                      <th className="px-3 py-2 font-medium">Hiển thị mặc định</th>
                      <th className="px-3 py-2 font-medium">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/10">
                    {STARS_114.slice(0, 30).map((s) => (
                      <tr key={s.name} className="hover:bg-card/40">
                        <td className="whitespace-nowrap px-3 py-2 text-foreground">{s.name}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{s.group}</td>
                        <td className="px-3 py-2 text-muted-foreground">{s.basis}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{s.defaultShow}</td>
                        <td className="px-3 py-2 text-muted-foreground">{s.note ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <details className="rounded-lg border border-border bg-card/40 p-3">
                <summary className="cursor-pointer text-sm text-gold-700 hover:text-gold">
                  Xem {STARS_114.length - 30} sao còn lại
                </summary>
                <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                  <table className="min-w-full text-left text-xs sm:text-sm">
                    <thead className="bg-card/60 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Sao</th>
                        <th className="px-3 py-2 font-medium">Nhóm</th>
                        <th className="px-3 py-2 font-medium">Căn cứ an</th>
                        <th className="px-3 py-2 font-medium">Hiển thị mặc định</th>
                        <th className="px-3 py-2 font-medium">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream/10">
                      {STARS_114.slice(30).map((s) => (
                        <tr key={s.name} className="hover:bg-card/40">
                          <td className="whitespace-nowrap px-3 py-2 text-foreground">{s.name}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{s.group}</td>
                          <td className="px-3 py-2 text-muted-foreground">{s.basis}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{s.defaultShow}</td>
                          <td className="px-3 py-2 text-muted-foreground">{s.note ?? ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </CardContent>
          </Card>

          {/* 3. An Mệnh & Thân */}
          <h2 className="sr-only">Cách an cung Mệnh và Thân</h2>
          <Card id="menh-than" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cách an cung Mệnh và Thân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                <strong>Cung Mệnh:</strong> tính từ <em>tháng âm</em> sinh và <em>giờ</em>{' '}
                sinh, đếm theo trình tự 12 địa chi (Dần → Mão → Thìn → ...) theo bí quyết
                "tháng âm lùi, giờ tiến tới" — đếm ngược tháng từ cung Dần rồi tiến tới
                theo giờ sinh để xác định cung Mệnh.
              </p>
              <p>
                <strong>Cung Thân:</strong> tính theo công thức song hành tháng + giờ
                (tiến cả hai). Với người sinh tháng cuối hoặc giờ cuối, Thân thường khác
                Mệnh — và đây chính là khi "Mệnh nói một, Thân nói khác", dấu hiệu chia
                tách bản chất bên trong và biểu hiện bên ngoài.
              </p>
              <p>
                <strong>Cục</strong> (Kim / Mộc / Thủy / Hỏa / Thổ): xác định qua{' '}
                <em>thiên can năm sinh</em> kết hợp với <em>cung Mệnh</em> — bảng nạp âm
                Lục Thập Hoa Giáp. Cục quyết định <em>số ngày</em> dùng để an Tử Vi và
                tuổi khởi đại vận.
              </p>
            </CardContent>
          </Card>

          {/* 4. An chính tinh */}
          <h2 className="sr-only">Cách an chính tinh</h2>
          <Card id="an-chinh-tinh" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cách an chính tinh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                <strong>Tử Vi</strong> an theo <em>Cục + ngày âm</em>: số ngày sinh chia
                cho Cục số (Thủy 2 cục → chia 2, Mộc 3 cục → chia 3, ...), thương quyết
                định vị trí Tử Vi trên bảng 12 cung.
              </p>
              <p>
                Sau khi xác định Tử Vi, <strong>13 chính tinh còn lại</strong> an theo bảng
                cố định quanh Tử Vi: Thiên Cơ ngay trước Tử Vi, Thái Dương cách 2 cung,
                Vũ Khúc cách 3 cung, Thiên Đồng cách 4 cung, Liêm Trinh cách 5 cung; Thiên
                Phủ đối xứng với Tử Vi qua trục Dần-Thân, kéo theo Thái Âm, Tham Lang, Cự
                Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-foreground/85">
                <strong className="text-gold-700">Caveat.</strong> Hệ thống không tự nội suy
                nếu ngày âm {'>'} 30 trong tháng nhuận — engine có check và sẽ trả lỗi
                yêu cầu user xác nhận lại ngày âm. Tránh trường hợp "đoán" ngày 31 thành
                ngày 1 tháng sau và sai toàn bộ lá số.
              </p>
            </CardContent>
          </Card>

          {/* 5. Phụ tinh + Tứ Hoá */}
          <h2 className="sr-only">Cách an phụ tinh và Tứ Hoá</h2>
          <Card id="phu-tinh-tu-hoa" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cách an phụ tinh và Tứ Hoá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                <strong>Phụ tinh</strong> an theo <em>can/chi năm</em>, <em>tháng âm</em>,
                hoặc <em>giờ</em> sinh, tuỳ từng nhóm sao. Ví dụ Tả Phụ – Hữu Bật an theo
                tháng âm; Văn Xương – Văn Khúc an theo giờ; Khôi – Việt an theo thiên can
                năm; Lộc Tồn – Kình – Đà an theo thiên can năm; Hoả – Linh an theo địa chi
                năm và giờ.
              </p>
              <p>
                <strong>Tứ Hoá</strong> (Hoá Lộc / Hoá Quyền / Hoá Khoa / Hoá Kỵ) — chỉ an
                theo <em>thiên can năm sinh</em>. Mỗi can có 4 sao tương ứng hoá, ví dụ
                can Giáp → Hoá Lộc tại Liêm Trinh, Hoá Quyền tại Phá Quân, Hoá Khoa tại
                Vũ Khúc, Hoá Kỵ tại Thái Dương.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-foreground/85">
                <strong className="text-gold-700">Caveat — dị biệt giữa nhánh.</strong> Phái{' '}
                <em>Tử Vân</em> dùng <em>can ngày</em> để an Tứ Hoá (tạo ra "Tứ Hoá phi
                tinh"). Phái <em>Liễu Vô Cư Sĩ</em> dùng cả <em>can năm</em> và{' '}
                <em>can ngày</em> đối chiếu chéo. Engine hieu.asia mặc định dùng{' '}
                <em>can năm</em> (Bắc phái mainstream) và sẽ note rõ trong báo cáo nếu
                user muốn so sánh với cách của Tử Vân.
              </p>
            </CardContent>
          </Card>

          {/* 6. Đại vận */}
          <h2 className="sr-only">Cách tính Đại Vận</h2>
          <Card id="dai-van" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cách tính Đại Vận
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                Mỗi <strong>đại vận = 10 năm</strong>; vận đầu tiên bắt đầu từ{' '}
                <em>cung Mệnh</em>, sau đó di chuyển sang cung kế tiếp.
              </p>
              <p>
                <strong>Thuận / nghịch:</strong> chiều đi của đại vận dựa trên kết hợp
                âm-dương của thiên can năm sinh + giới tính. Nam Dương / Nữ Âm đi{' '}
                <em>thuận</em>; Nam Âm / Nữ Dương đi <em>nghịch</em>.
              </p>
              <div className="rounded-lg border border-border bg-card/60 p-4 text-foreground/85">
                <p className="font-medium text-foreground">Tuổi khởi đại vận:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/80">
                  <li>
                    <strong>Bản phổ thông:</strong> dùng Cục số (Thuỷ nhị cục = 2, Mộc tam
                    cục = 3, Kim tứ cục = 4, Thổ ngũ cục = 5, Hoả lục cục = 6) làm tuổi
                    khởi đại vận đầu tiên.
                  </li>
                  <li>
                    <strong>Một số nhánh:</strong> tinh chỉnh thời điểm chuyển vận theo
                    ngày/giờ sinh (chứ không phải đúng sinh nhật).
                  </li>
                  <li>
                    <strong>Engine hieu.asia hiện dùng:</strong> tuổi khởi vận = Cục số,
                    với chiều đại vận tính theo cặp (giới tính + âm/dương can năm).
                  </li>
                  <li>
                    Nếu công thức này thay đổi,{' '}
                    <Link
                      href="/methodology/algorithm-changelog"
                      className="text-gold-700 underline underline-offset-4 hover:opacity-80"
                    >
                      /methodology/algorithm-changelog
                    </Link>{' '}
                    ghi rõ.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 7. Lưu niên */}
          <h2 className="sr-only">Cách tính Lưu Niên</h2>
          <Card id="luu-nien" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cách tính Lưu Niên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <p>
                <strong>Lưu niên</strong> = cung mà <em>địa chi năm hiện tại</em> trùng
                với địa chi đặt tại cung đó trên lá số gốc. Ví dụ năm Ngọ — lưu niên rơi
                vào cung có địa chi Ngọ.
              </p>
              <p>
                <strong>Lưu nguyệt</strong> = cung mà <em>địa chi tháng âm hiện tại</em>{' '}
                trùng với địa chi cung. Lưu nhật, lưu thời tính tương tự nhưng độ ảnh
                hưởng giảm dần.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-foreground/85">
                <strong className="text-gold-700">Caveat.</strong> Lưu niên chỉ <em>gợi mở
                chủ đề năm</em> — không quyết định cụ thể "việc gì xảy ra". Engine sẽ tô
                đậm chủ đề năm trong báo cáo, nhưng luôn kèm câu "đây là bối cảnh, không
                phải kết quả".
              </p>
            </CardContent>
          </Card>

          {/* §5.2 — Dị bản và nguồn quy tắc */}
          <h2 className="sr-only">Dị bản và nguồn quy tắc</h2>
          <Card id="nguon-quy-tac" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Dị bản và nguồn quy tắc
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Mỗi quy tắc engine dùng — kèm dị bản phổ biến và lý do chọn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="font-medium text-foreground">Quy tắc: Tứ Hoá</p>
                <p className="mt-1"><span className="text-muted-foreground">Nguồn / nhánh chính:</span> Bắc phái Trần Đoàn — an theo <em>can năm sinh</em>.</p>
                <p><span className="text-muted-foreground">Dị bản:</span> Phái Tử Vân dùng <em>can ngày</em> (Tứ Hoá phi tinh); Liễu Vô Cư Sĩ đối chiếu cả can năm + can ngày.</p>
                <p><span className="text-muted-foreground">Engine mặc định:</span> <strong>Can năm</strong>.</p>
                <p><span className="text-muted-foreground">Tại sao chọn:</span> Bắc phái mainstream, tư liệu nhiều, dễ kiểm chứng deterministic.</p>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="font-medium text-foreground">Quy tắc: An Mệnh</p>
                <p className="mt-1"><span className="text-muted-foreground">Nguồn / nhánh chính:</span> "Tháng âm lùi — giờ tiến tới" (Bắc phái phổ thông).</p>
                <p><span className="text-muted-foreground">Dị bản:</span> Một số sách Đài Loan đếm cả hai chiều thuận; nhánh dân gian Việt Nam đôi khi đảo công thức.</p>
                <p><span className="text-muted-foreground">Engine mặc định:</span> <strong>Tháng âm lùi, giờ tiến tới</strong> từ cung Dần.</p>
                <p><span className="text-muted-foreground">Tại sao chọn:</span> Khớp với hầu hết sách Bắc phái chuẩn (Tử Vi Đẩu Số Toàn Thư).</p>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="font-medium text-foreground">Quy tắc: Cục số</p>
                <p className="mt-1"><span className="text-muted-foreground">Nguồn / nhánh chính:</span> Bảng Lục Thập Hoa Giáp — nạp âm Can Chi năm + cung Mệnh.</p>
                <p><span className="text-muted-foreground">Dị bản:</span> Một số nhánh dùng nạp âm năm + chi tháng (ít phổ biến).</p>
                <p><span className="text-muted-foreground">Engine mặc định:</span> <strong>Nạp âm can-chi năm + cung Mệnh</strong> → Kim/Mộc/Thuỷ/Hoả/Thổ (2-6 cục).</p>
                <p><span className="text-muted-foreground">Tại sao chọn:</span> Phương pháp mainstream, mỗi tổ hợp (năm + cung Mệnh) chỉ ra <em>một</em> cục duy nhất.</p>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="font-medium text-foreground">Quy tắc: Đại vận thuận/nghịch</p>
                <p className="mt-1"><span className="text-muted-foreground">Nguồn / nhánh chính:</span> "Dương Nam Âm Nữ thuận, Âm Nam Dương Nữ nghịch".</p>
                <p><span className="text-muted-foreground">Dị bản:</span> Có sách dùng âm-dương chi năm thay vì can năm — kết quả thường giống, nhưng vài năm biên giới khác.</p>
                <p><span className="text-muted-foreground">Engine mặc định:</span> Dùng <strong>âm-dương can năm + giới tính</strong>.</p>
                <p><span className="text-muted-foreground">Tại sao chọn:</span> Bám sát Tử Vi Đẩu Số Toàn Thư và đa số tài liệu Bắc phái hiện đại.</p>
              </div>
            </CardContent>
          </Card>

          {/* §5.3 — Cung nào dùng cho chủ đề nào */}
          <h2 className="sr-only">Cung nào dùng cho chủ đề nào</h2>
          <Card id="cung-chu-de" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cung nào dùng cho chủ đề nào
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Map từ câu hỏi user sang cung chính, cung phụ và thời vận engine sẽ đối chiếu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground/80 sm:text-base">
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full text-left text-xs sm:text-sm">
                  <thead className="bg-card/60 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Chủ đề user hỏi</th>
                      <th className="px-3 py-2 font-medium">Cung chính</th>
                      <th className="px-3 py-2 font-medium">Cung phụ</th>
                      <th className="px-3 py-2 font-medium">Thời vận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/10">
                    <tr>
                      <td className="px-3 py-2 text-foreground">Sự nghiệp</td>
                      <td className="px-3 py-2 text-foreground/80">Quan Lộc</td>
                      <td className="px-3 py-2 text-muted-foreground">Mệnh, Tài Bạch, Thiên Di, Nô Bộc</td>
                      <td className="px-3 py-2 text-muted-foreground">Đại vận, lưu niên</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Tài chính</td>
                      <td className="px-3 py-2 text-foreground/80">Tài Bạch</td>
                      <td className="px-3 py-2 text-muted-foreground">Quan Lộc, Điền Trạch, Phúc Đức</td>
                      <td className="px-3 py-2 text-muted-foreground">Đại vận, lưu niên</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Tình cảm</td>
                      <td className="px-3 py-2 text-foreground/80">Phu Thê</td>
                      <td className="px-3 py-2 text-muted-foreground">Mệnh, Phúc Đức, Nô Bộc, Tử Tức</td>
                      <td className="px-3 py-2 text-muted-foreground">Đại vận, lưu niên</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Gia đình</td>
                      <td className="px-3 py-2 text-foreground/80">Phụ Mẫu, Huynh Đệ</td>
                      <td className="px-3 py-2 text-muted-foreground">Phúc Đức, Điền Trạch</td>
                      <td className="px-3 py-2 text-muted-foreground">Đại vận</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Sức khoẻ / thói quen</td>
                      <td className="px-3 py-2 text-foreground/80">Tật Ách</td>
                      <td className="px-3 py-2 text-muted-foreground">Mệnh, Phúc Đức</td>
                      <td className="px-3 py-2 text-muted-foreground">Đại vận, lưu niên</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Đi xa / đổi môi trường</td>
                      <td className="px-3 py-2 text-foreground/80">Thiên Di</td>
                      <td className="px-3 py-2 text-muted-foreground">Mệnh, Quan Lộc, Nô Bộc</td>
                      <td className="px-3 py-2 text-muted-foreground">Đại vận, lưu niên</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* §5.5 — Trường hợp đặc biệt */}
          <h2 className="sr-only">Trường hợp đặc biệt</h2>
          <Card id="edge-cases" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Trường hợp đặc biệt
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Các edge case engine bắt buộc xử lý — không cho phép "đoán".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground/80 sm:text-base">
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full text-left text-xs sm:text-sm">
                  <thead className="bg-card/60 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Edge case</th>
                      <th className="px-3 py-2 font-medium">Rủi ro</th>
                      <th className="px-3 py-2 font-medium">Hệ thống xử lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/10">
                    <tr>
                      <td className="px-3 py-2 text-foreground">Sinh gần ranh giờ Tý</td>
                      <td className="px-3 py-2 text-muted-foreground">Cung Mệnh/Thân có thể đổi</td>
                      <td className="px-3 py-2 text-muted-foreground">Cảnh báo confidence + gợi ý so sánh 2 lá số</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Không nhớ giờ sinh</td>
                      <td className="px-3 py-2 text-muted-foreground">Confidence thấp</td>
                      <td className="px-3 py-2 text-muted-foreground">Hỏi hồi cứu, không phán cứng</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Sinh trong tháng nhuận</td>
                      <td className="px-3 py-2 text-muted-foreground">Sai tháng âm</td>
                      <td className="px-3 py-2 text-muted-foreground">Bắt user xác nhận tháng nhuận</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Sinh ngoài VN</td>
                      <td className="px-3 py-2 text-muted-foreground">Sai timezone</td>
                      <td className="px-3 py-2 text-muted-foreground">Hỏi nơi sinh / timezone</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Sinh ngày đổi tiết khí</td>
                      <td className="px-3 py-2 text-muted-foreground">Sai Can Chi tháng</td>
                      <td className="px-3 py-2 text-muted-foreground">Ngày đổi tiết khí có flag, prompt user xác nhận</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-foreground">Nhập ngày âm nhưng chọn nhầm lịch dương</td>
                      <td className="px-3 py-2 text-muted-foreground">Sai toàn bộ chart</td>
                      <td className="px-3 py-2 text-muted-foreground">Validator pattern check (tháng âm hợp lý, ngày âm ≤ 30)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* §5.6 — Quy tắc khi AI nhắc thời gian cụ thể */}
          <h2 className="sr-only">Quy tắc khi AI nhắc năm/quý/tháng cụ thể</h2>
          <Card id="rule-time-claims" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Quy tắc khi AI nhắc năm/quý/tháng cụ thể
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Mọi mention thời gian hoặc sao đều phải có evidence từ chart, không phải tone AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Nếu output nhắc <strong>năm / quý / tháng</strong> → phải có evidence
                  từ <em>đại vận / lưu niên / lưu nguyệt</em> cụ thể (không phải tone AI).
                </li>
                <li>
                  Nếu output nhắc <strong>sao cụ thể</strong> → sao phải tồn tại trong
                  <em> chart JSON</em> hoặc <em>transit JSON</em>.
                </li>
                <li>
                  Nếu output <strong>khuyên hành động</strong> → phải có ÍT NHẤT 1 điều
                  kiện kiểm chứng ngoài đời.
                </li>
              </ul>
              <p className="rounded-lg border border-amber-700/40 bg-amber-900/15 p-3 text-foreground/90">
                <strong className="text-amber-200">Validator.</strong> Cả 3 rule đều có
                check tự động trên output trước khi gửi tới user. Vi phạm → response bị
                regenerate.
              </p>
            </CardContent>
          </Card>

          {/* §5.7 — Hai chế độ diễn giải */}
          <h2 className="sr-only">Hai chế độ diễn giải</h2>
          <Card id="modes" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Hai chế độ diễn giải
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Cùng một kết luận, hai cách nói — user chọn theo nhu cầu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card/60 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
                    Mode dễ hiểu
                  </p>
                  <p className="mt-2 text-foreground/85">
                    "Bạn hợp môi trường có quyền tự chủ, mục tiêu dài hạn và không quá vụn vặt."
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/60 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
                    Mode chuyên sâu
                  </p>
                  <p className="mt-2 text-foreground/85">
                    "Luận dựa trên Quan Lộc, tam phương Mệnh–Tài–Di, đại vận hiện tại và
                    nhóm sao chủ động trong cung sự nghiệp."
                  </p>
                </div>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-3 text-xs text-muted-foreground">
                Mode chuyên sâu sẽ có toggle trong báo cáo (chưa active trong UI hiện
                tại — coming soon).
              </p>
            </CardContent>
          </Card>

          {/* 8. AI vs Engine */}
          <h2 className="sr-only">AI làm gì, engine làm gì</h2>
          <Card id="ai-vs-engine" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                <Shield className="h-5 w-5 text-gold" aria-hidden /> AI làm gì, engine
                làm gì
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Lằn ranh rõ ràng — không có chuyện AI "an sao theo cảm hứng".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card/60 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-heading text-base text-foreground">
                    <Database className="h-4 w-4 text-gold" aria-hidden /> Engine
                    deterministic
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-foreground/80">
                    <li>Đổi dương lịch ↔ âm lịch</li>
                    <li>Tính Can Chi năm/tháng/ngày/giờ</li>
                    <li>An cung Mệnh, Thân, Cục</li>
                    <li>An 14 chính tinh + 10 phụ tinh + ~90 sao nhỏ</li>
                    <li>Tính Tứ Hoá theo can năm</li>
                    <li>Tính đại vận, lưu niên, lưu nguyệt</li>
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Không có yếu tố LLM. Cùng input → cùng output, mọi lúc.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/60 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-heading text-base text-foreground">
                    <Brain className="h-4 w-4 text-gold" aria-hidden /> AI / LLM
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-foreground/80">
                    <li>Diễn giải tổ hợp sao + cung</li>
                    <li>Ghép bối cảnh user (mục tiêu, tình huống)</li>
                    <li>Soạn báo cáo tiếng Việt mạch lạc</li>
                    <li>Trả lời Mentor: hỏi-đáp tự phản tư</li>
                    <li>Gợi ý câu hỏi kiểm chứng</li>
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">
                    AI đọc chart JSON từ engine, không tự tạo ra sao.
                  </p>
                </div>
              </div>
              <p className="rounded-lg border border-amber-700/40 bg-amber-900/15 p-3 text-foreground/90">
                <strong className="text-amber-200">Hard rule.</strong> AI không được tự
                an sao. Mọi mention sao trong output phải có trong chart JSON do engine
                xuất. Có một validator chặn output bịa sao — nếu AI gọi tên sao không
                tồn tại trong chart, response bị reject và regenerate.
              </p>
            </CardContent>
          </Card>

          {/* 9. Giới hạn */}
          <h2 className="sr-only">Giới hạn và sự thật</h2>
          <Card id="gioi-han" className="border-border bg-card/40 scroll-mt-24">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Giới hạn và sự thật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Tử Vi <strong>không tiên tri</strong> tai hoạ hay chết chóc. Mọi luận
                  về "sao Tử/Bệnh/Hung" đều là <em>chủ đề chú ý</em>, không phải sự kiện
                  cố định.
                </li>
                <li>
                  Giờ sinh không rõ → độ chắc chắn giảm. Engine sẽ giảm confidence và
                  Mentor sẽ ưu tiên hỏi lại thay vì đoán cứng. Bạn có thể dùng{' '}
                  <Link
                    href="/tu-vi/rectify"
                    className="text-gold-700 underline underline-offset-4 hover:opacity-80"
                  >
                    /tu-vi/rectify
                  </Link>{' '}
                  (Birth Time Rectification) để trả lời 12 câu hồi cứu sự kiện đời, từ đó
                  thu hẹp khung giờ (canh) khả dĩ xuống top 3 ứng viên. Đây là heuristic
                  ước lượng, không thay thế xác định chính xác từ chuyên gia Tử Vi.
                </li>
                <li>
                  Lá số <strong>không thay thế</strong> bác sĩ, luật sư, hay cố vấn tài
                  chính có chứng chỉ. Khi vấn đề nghiêm trọng, gặp chuyên gia.
                </li>
                <li>
                  <strong>Quyền tự quyết.</strong> Bạn quyết, không phải lá số. hieu.asia
                  chỉ cung cấp một góc nhìn để bạn đối chiếu với trực giác và dữ kiện
                  của mình.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/sample-report"
              className="group rounded-xl border border-border bg-card/40 p-5 transition hover:border-gold/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
                Xem trước
              </p>
              <h3 className="mt-2 font-heading text-lg text-foreground">
                Xem báo cáo mẫu
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Một lá số được luận đầy đủ — để bạn biết kết quả thật trông như thế nào.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold-700 group-hover:underline">
                /sample-report <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href="/onboarding/topic"
              className="group rounded-xl border border-gold/30 bg-gold/10 p-5 transition hover:border-gold/60 hover:bg-gold/15"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
                Bắt đầu
              </p>
              <h3 className="mt-2 font-heading text-lg text-foreground">
                Lập lá số của bạn
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Trả lời 4 câu hỏi ngắn để engine an sao và soạn báo cáo riêng cho bạn.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold-700 group-hover:underline">
                /onboarding/topic <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
          </section>

          {/* Sticky table of contents (desktop only) */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Mục lục"
              className="sticky top-20 rounded-lg border border-border bg-card/40 p-4"
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-700">
                Mục lục
              </p>
              <ul className="space-y-1.5 text-xs">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded px-2 py-1 text-muted-foreground transition hover:bg-card/60 hover:text-gold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
