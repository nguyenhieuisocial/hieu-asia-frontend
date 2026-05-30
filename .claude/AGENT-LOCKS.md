# AGENT-LOCKS — đăng ký vùng làm việc & handoff đa-agent

Mục đích: mỗi agent đăng ký file/vùng đang giữ + handoff cross-agent. **Đọc trước khi sửa file chung.**
(Bootstrap bởi hero-lab agent 2026-05-30 — plan `~/.claude/plans/encapsulated-skipping-tiger.md` §Coordination nhắc file này nhưng chưa ai tạo.)

## 🔁 Handoff đang chờ owner thực hiện
| Ngày | Từ | Cho | Việc | Tài liệu |
|---|---|---|---|---|
| 2026-05-30 | hero-lab (`feat/hero-lab-prototype`) | owner `app/page.tsx` / homepage-wave | **Promote homepage "Bốn lăng kính → AI" → production** (founder DUYỆT — chọn promote). Branch đã revert swap cosmos (`page.tsx` == main, đã xoá HeroCosmos), KHÔNG đụng file khoá; owner lấy component từ `app/muc-lab/`. Gate: sau wave-64/CMS merge. | `docs/superpowers/plans/HANDOFF-homepage-promotion.md` · demo `/muc-lab/home` · GH issue (link khi tạo) |

## 🔒 Vùng đang giữ (tự đăng ký)
| Agent | Vùng | Ghi chú |
|---|---|---|
| hero-lab | `app/muc-lab/**`, `app/cosmos*/**`, `app/hero-lab/**`, `app/scroll-lab/**` (noindex labs) | prototype; **muc-lab** là hướng chốt → đang handoff promote |
| (homepage-wave) | `app/page.tsx`, `components/home/*`, `components/marketing/*`, `globals.css`, `tailwind.config.ts` | per upgrade plan §Coordination — TRÁNH sửa |
| (admin) | `apps/admin/**`, `apps/web/supabase/**` | per upgrade plan |
