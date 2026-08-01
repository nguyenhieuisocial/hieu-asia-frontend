// Test cho mentor-quota-identity.ts — định danh gửi kèm cho quota Mentor
// theo ngày ở worker. Thứ tự chọn X-User-Id: user đăng nhập đã verify →
// chủ reading → x-anon-id; luôn kèm X-Client-Ip từ header do Vercel đặt.

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/reasoning/session-auth', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/lib/reasoning/session-auth')>();
  return { ...actual, getSessionFromRequest: vi.fn() };
});

import { mentorQuotaIdentityHeaders } from './mentor-quota-identity';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';

const mockedGetSession = getSessionFromRequest as ReturnType<typeof vi.fn>;

const ANON_ID = 'anon_9f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f';

function reqWith(headers: Record<string, string> = {}): Request {
  return new Request('https://hieu.asia/api/mentor', {
    method: 'POST',
    headers,
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('mentorQuotaIdentityHeaders — chọn X-User-Id', () => {
  it('user đăng nhập đã verify thắng chủ reading (gói trả tiền nằm trên auth id)', async () => {
    mockedGetSession.mockResolvedValue({ userId: 'auth-user-1', email: null, linkedAnonId: null });
    const h = await mentorQuotaIdentityHeaders(reqWith(), ANON_ID);
    expect(h['X-User-Id']).toBe('auth-user-1');
  });

  it('không đăng nhập → dùng chủ reading (kể cả anon_<uuid>)', async () => {
    mockedGetSession.mockResolvedValue(null);
    const h = await mentorQuotaIdentityHeaders(reqWith(), ANON_ID);
    expect(h['X-User-Id']).toBe(ANON_ID);
  });

  it('không đăng nhập, không reading → x-anon-id hợp lệ của khách', async () => {
    mockedGetSession.mockResolvedValue(null);
    const h = await mentorQuotaIdentityHeaders(reqWith({ 'x-anon-id': ANON_ID }));
    expect(h['X-User-Id']).toBe(ANON_ID);
  });

  it('x-anon-id sai shape → bỏ qua, không có X-User-Id', async () => {
    mockedGetSession.mockResolvedValue(null);
    const h = await mentorQuotaIdentityHeaders(
      reqWith({ 'x-anon-id': 'not-an-anon-id' }),
    );
    expect(h['X-User-Id']).toBeUndefined();
  });

  it('GoTrue ném lỗi → rơi xuống chủ reading, không vỡ', async () => {
    mockedGetSession.mockRejectedValue(new Error('gotrue down'));
    const h = await mentorQuotaIdentityHeaders(reqWith(), 'owner-1');
    expect(h['X-User-Id']).toBe('owner-1');
  });
});

describe('mentorQuotaIdentityHeaders — X-Client-Ip', () => {
  it('x-real-ip (Vercel đặt) được ưu tiên', async () => {
    mockedGetSession.mockResolvedValue(null);
    const h = await mentorQuotaIdentityHeaders(
      reqWith({ 'x-real-ip': '42.1.1.1', 'x-forwarded-for': '9.9.9.9, 76.76.21.21' }),
    );
    expect(h['X-Client-Ip']).toBe('42.1.1.1');
  });

  it('thiếu x-real-ip → lấy IP đầu của x-forwarded-for', async () => {
    mockedGetSession.mockResolvedValue(null);
    const h = await mentorQuotaIdentityHeaders(
      reqWith({ 'x-forwarded-for': '9.9.9.9, 76.76.21.21' }),
    );
    expect(h['X-Client-Ip']).toBe('9.9.9.9');
  });

  it('không có header IP nào → không gửi X-Client-Ip', async () => {
    mockedGetSession.mockResolvedValue(null);
    const h = await mentorQuotaIdentityHeaders(reqWith());
    expect(h['X-Client-Ip']).toBeUndefined();
  });
});
