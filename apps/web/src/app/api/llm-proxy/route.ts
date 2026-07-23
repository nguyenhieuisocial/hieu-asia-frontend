/**
 * LLM Gateway proxy — trạm trung chuyển cho Cloudflare Worker.
 *
 * VÌ SAO: Worker (api.hieu.asia) gọi thẳng `ai-gateway.vercel.sh` bị TREO
 * ~93% (đường CF→Vercel hỏng, chỉ ~4 req/12h tới nơi). Nhưng hàm chạy TRÊN
 * Vercel gọi gateway thì NHANH (Vercel→gateway nội mạng, OIDC tự auth). Route
 * này nhận request OpenAI-compatible từ worker → gọi gateway hộ → trả lại.
 * Worker chỉ cần đổi đích fetch sang đây (giữ nguyên logic mentor/decisions).
 *
 * Auth: header `x-proxy-secret` khớp env `HIEU_API_SERVICE_TOKEN` (token service
 * frontend↔worker đã có sẵn 2 phía — tái dùng, khỏi tạo secret mới). Chỉ worker
 * (giữ token) gọi được, tránh người lạ đốt credit gateway.
 *
 * KHÔNG cần API key gateway: chạy trên Vercel nên AI SDK tự lấy OIDC token.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { generateText, type ModelMessage } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Worker timeout 25s; để 60 cho an toàn (Vercel→gateway thường 2-8s).
export const maxDuration = 60;

const gateway = createGateway({
  headers: { 'http-referer': 'https://hieu.asia', 'x-title': 'hieu.asia (worker-proxy)' },
});

interface ProxyReq {
  model?: string;
  messages?: ModelMessage[];
  max_tokens?: number;
}

export async function POST(req: NextRequest) {
  const secret = process.env.HIEU_API_SERVICE_TOKEN;
  // Chưa cấu hình token → tắt proxy (fail-closed) để không mở toang.
  if (!secret || req.headers.get('x-proxy-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: ProxyReq;
  try {
    body = (await req.json()) as ProxyReq;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const model = typeof body.model === 'string' ? body.model : '';
  if (!model || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: 'model + messages required' }, { status: 400 });
  }

  try {
    const result = await generateText({
      model: gateway(model),
      messages: body.messages,
      maxOutputTokens: typeof body.max_tokens === 'number' ? body.max_tokens : 1024,
    });
    // Trả shape OpenAI-compatible — worker parse y như gọi gateway trực tiếp.
    return NextResponse.json({
      model: result.response?.modelId ?? model,
      choices: [{ message: { role: 'assistant', content: result.text ?? '' } }],
      usage: {
        prompt_tokens: result.usage?.inputTokens ?? 0,
        completion_tokens: result.usage?.outputTokens ?? 0,
      },
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: `gateway: ${safeErrorDetail('llm-proxy', e)}` },
      { status: 502 },
    );
  }
}
