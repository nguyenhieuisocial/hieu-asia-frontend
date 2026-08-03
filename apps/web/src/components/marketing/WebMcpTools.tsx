'use client';

/**
 * WebMCP (Web Model Context Protocol) tool registration.
 *
 * On the client, if the browser exposes `navigator.modelContext.provideContext`
 * (the experimental WebMCP API), we register one tool per PUBLIC, read-only
 * free tool on hieu.asia. This lets an in-browser AI agent discover and use the
 * tools directly.
 *
 * SAFETY (hard rules):
 *   - Every `execute` does ONLY safe things: it returns the public tool URL and
 *     optionally navigates the browser there. It NEVER calls internal APIs,
 *     auth, payment, or any PII-write endpoint.
 *   - Feature-detected: no-ops in browsers without WebMCP.
 *   - Renders null and runs in `useEffect` so it never affects SSR/hydration.
 */

import { useEffect } from 'react';

const SITE_ORIGIN = 'https://hieu.asia';

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  /** Public tool page the user is sent to. */
  url: string;
}

// One descriptor per safe, read-only public tool. inputSchema is JSON Schema
// for the inputs the tool collects from the user.
const TOOLS: WebMcpTool[] = [
  {
    name: 'xem_la_so_tu_vi',
    description:
      'Lập & xem lá số Tử Vi Đẩu Số từ ngày giờ sinh — 12 cung, 114 sao, độ sáng, cách cục và tam phương tứ chính. Công cụ tính toán xác định, không phân tích. Trả về URL công cụ công khai để người dùng tự nhập và xem.',
    inputSchema: {
      type: 'object',
      properties: {
        ngay_sinh_duong_lich: {
          type: 'string',
          description: 'Ngày sinh dương lịch, định dạng YYYY-MM-DD',
        },
        gio_sinh: {
          type: 'string',
          description: 'Giờ sinh, định dạng HH:MM (24h)',
        },
        gioi_tinh: {
          type: 'string',
          enum: ['nam', 'nu'],
          description: 'Giới tính: nam hoặc nu',
        },
      },
      required: ['ngay_sinh_duong_lich', 'gio_sinh', 'gioi_tinh'],
    },
    url: `${SITE_ORIGIN}/la-so-tu-vi`,
  },
  {
    name: 'xem_la_so_bat_tu',
    description:
      'Lập & xem lá số Bát Tự (Tứ Trụ) miễn phí — đủ 4 trụ năm/tháng/ngày/giờ (8 chữ), ngũ hành, Nhật Chủ, Thập Thần, cân bằng ngũ hành. Tính theo tiết khí. Trả về URL công cụ công khai để người dùng tự nhập và xem.',
    inputSchema: {
      type: 'object',
      properties: {
        ngay_sinh_duong_lich: {
          type: 'string',
          description: 'Ngày sinh dương lịch, định dạng YYYY-MM-DD',
        },
        gio_sinh: {
          type: 'string',
          description: 'Giờ sinh, định dạng HH:MM (24h)',
        },
        gioi_tinh: {
          type: 'string',
          enum: ['nam', 'nu'],
          description: 'Giới tính: nam hoặc nu',
        },
      },
      required: ['ngay_sinh_duong_lich', 'gio_sinh', 'gioi_tinh'],
    },
    url: `${SITE_ORIGIN}/la-so-bat-tu`,
  },
  {
    name: 'tu_vi_12_con_giap_hom_nay',
    description:
      'Tử Vi hàng ngày cho 12 con giáp — tổng quan, sự nghiệp, tình duyên, tài lộc, sức khoẻ. Dự báo chung theo tuổi (không phải lá số cá nhân). Trả về URL trang công khai để người dùng chọn con giáp.',
    inputSchema: {
      type: 'object',
      properties: {
        con_giap: {
          type: 'string',
          enum: [
            'ty',
            'suu',
            'dan',
            'mao',
            'thin',
            'ti',
            'ngo',
            'mui',
            'than',
            'dau',
            'tuat',
            'hoi',
          ],
          description: 'Tuổi con giáp của người dùng',
        },
      },
      required: ['con_giap'],
    },
    url: `${SITE_ORIGIN}/tu-vi-hom-nay`,
  },
  {
    name: 'xem_ngay_tot_theo_muc_dich',
    description:
      'Chọn mục đích (cưới hỏi, khai trương, động thổ, nhập trạch...) để xem ngày đẹp — chấm điểm 0–100 theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu, cảnh báo Tam Tai, Kim Lâu, Hoang Ốc. Trả về URL công cụ công khai để người dùng chọn mục đích.',
    inputSchema: {
      type: 'object',
      properties: {
        muc_dich: {
          type: 'string',
          description: 'Mục đích, ví dụ: cưới hỏi, khai trương, động thổ, nhập trạch',
        },
        nam_sinh: {
          type: 'integer',
          description: 'Năm sinh (tuỳ chọn) để cảnh báo Tam Tai / Kim Lâu / Hoang Ốc theo tuổi',
        },
      },
      required: ['muc_dich'],
    },
    url: `${SITE_ORIGIN}/xem-ngay`,
  },
];

// Minimal shape of the experimental WebMCP API we rely on. Kept local so we
// don't depend on a global type that may not exist in this TS lib target.
interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: unknown) => Promise<{ content: Array<{ type: 'text'; text: string }> }>;
}
interface ModelContextLike {
  provideContext?: (config: { tools: ModelContextTool[] }) => void;
}

export function WebMcpTools() {
  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const modelContext = (navigator as Navigator & { modelContext?: ModelContextLike })
      .modelContext;
    if (!modelContext || typeof modelContext.provideContext !== 'function') return;

    try {
      modelContext.provideContext({
        tools: TOOLS.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          // SAFE: only returns the public URL and (best-effort) navigates there.
          // No fetch, no auth, no payment.
          execute: async () => {
            try {
              if (typeof window !== 'undefined') {
                window.location.assign(tool.url);
              }
            } catch {
              // Navigation is best-effort; returning the URL is the contract.
            }
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `Mở công cụ miễn phí tại: ${tool.url}`,
                },
              ],
            };
          },
        })),
      });
    } catch {
      // Feature is experimental; never break the page if registration throws.
    }
  }, []);

  return null;
}
