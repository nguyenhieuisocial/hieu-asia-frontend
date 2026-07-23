import { describe, it, expect } from 'vitest';
import { requiredRank, ROLE_RANK, AI_SPEND_PATH_PREFIXES, OWNER_PATH_PREFIXES } from './_authz';

/**
 * Cổng phân quyền admin-proxy là điểm an ninh DUY NHẤT (backend mù vai trò).
 * Bất biến "endpoint tốn tiền/PII phải yêu cầu quyền cao hơn viewer" đã bị vi
 * phạm HAI lần (cockpit/attention, rồi llm/probe). Test này khoá lại để lần thứ
 * ba bị chặn ở CI thay vì lọt lên production.
 */

const seg = (p: string) => p.split('/');

describe('requiredRank — GET tốn tiền phải cần ÍT NHẤT admin', () => {
  it('admin/llm/probe (GET) cần admin, KHÔNG phải viewer', () => {
    // Đây là lỗ hổng đang vá: viewer gọi được endpoint đốt 3 lượt LLM/request.
    expect(requiredRank('GET', seg('admin/llm/probe'))).toBe(ROLE_RANK.admin);
    expect(requiredRank('GET', seg('admin/llm/probe'))).toBeGreaterThan(ROLE_RANK.viewer);
  });

  it('admin/cockpit/attention (GET) cần admin', () => {
    expect(requiredRank('GET', seg('admin/cockpit/attention'))).toBe(ROLE_RANK.admin);
  });

  it('MỌI endpoint trong AI_SPEND đều > viewer, ở mọi method', () => {
    // Nếu ai thêm một endpoint tốn tiền mà quên: hoặc nó không có ở đây (test
    // riêng bên trên đỏ), hoặc nó ở đây mà requiredRank không nâng quyền (test
    // này đỏ). Không có đường lọt.
    for (const p of AI_SPEND_PATH_PREFIXES) {
      for (const m of ['GET', 'POST']) {
        expect(requiredRank(m, seg(p)), `${m} ${p} phải cần >= admin`).toBeGreaterThanOrEqual(ROLE_RANK.admin);
      }
    }
  });
});

describe('requiredRank — các quy tắc khác không bị vỡ khi tách module', () => {
  it('owner path cần owner ở mọi method', () => {
    for (const p of OWNER_PATH_PREFIXES) {
      expect(requiredRank('GET', seg(p)), `GET ${p}`).toBe(ROLE_RANK.owner);
      expect(requiredRank('POST', seg(p)), `POST ${p}`).toBe(ROLE_RANK.owner);
    }
  });

  it('GET dashboard thường vẫn mở cho viewer', () => {
    expect(requiredRank('GET', seg('admin/metrics'))).toBe(ROLE_RANK.viewer);
    expect(requiredRank('GET', seg('admin/infra/supabase'))).toBe(ROLE_RANK.viewer);
  });

  it('mutation thường cần admin', () => {
    expect(requiredRank('POST', seg('admin/feedback/reply'))).toBe(ROLE_RANK.admin);
  });

  it('cấp quyền đọc-trả-phí (admin/sessions/:id/access) cần owner', () => {
    expect(requiredRank('POST', seg('admin/sessions/abc/access'))).toBe(ROLE_RANK.owner);
  });

  it('ghi settings phá tín hiệu cần owner; đọc thì viewer', () => {
    expect(requiredRank('POST', seg('admin/settings/retention'))).toBe(ROLE_RANK.owner);
    expect(requiredRank('GET', seg('admin/settings/retention'))).toBe(ROLE_RANK.viewer);
  });

  it('ranh giới segment: admin/usersX KHÔNG bị coi là admin/users', () => {
    // underPrefix phải tôn trọng ranh giới '/', nếu không một path lạ có thể
    // vô tình khớp một prefix owner (hoặc ngược lại, thoát khỏi nó).
    expect(requiredRank('GET', seg('admin/usersX'))).not.toBe(ROLE_RANK.owner);
  });
});
