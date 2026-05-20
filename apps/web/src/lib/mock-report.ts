/**
 * Mock StrategicActionPlan for offline dev. Mirrors backend `_mock_alignment` output
 * (see `backend/core/crew_factory.py`). Used as fallback when API returns no
 * structured plan or is offline.
 */

import type { StrategicActionPlan } from '@hieu-asia/types';

export const MOCK_REPORT: StrategicActionPlan = {
  core_personality: [
    {
      theme_name: 'Tốc độ ra quyết định cao + nhạy cảm áp lực',
      evidence_from_disciplines: [
        'Bạn tự mô tả là người ra quyết định nhanh',
        'Đang giữ vai founder với áp lực dòng tiền',
        'Phân tích lá tay cho thấy đường tâm trí dứt khoát',
      ],
      synthesis_insight:
        'Bạn có khả năng tạo momentum và biến cơ hội thành hành động trong giờ — nhưng dưới áp lực tài chính, sức mạnh này dễ trở thành kiểm soát quá mức và cô lập cảm xúc.',
    },
    {
      theme_name: 'Người chịu trách nhiệm cao, hay tự gánh',
      evidence_from_disciplines: [
        'Pattern tự nhận lỗi khi team sai',
        'Có xu hướng nhảy qua middle manager khi gấp',
      ],
      synthesis_insight:
        'Bạn nhận về phần khó nhất — điều này tạo niềm tin nhưng khiến đội nhóm không lớn lên được.',
    },
  ],
  strengths: [
    {
      title: 'Tốc độ ra quyết định',
      assessment:
        'Bạn ra quyết định nhanh khi thấy đủ tín hiệu — biến cơ hội thành hành động trong giờ, không phải tuần.',
      risk: "Khi áp lực cao, tốc độ này có thể bỏ qua bước hỏi và đẩy người khác vào vai 'thừa hành'.",
      action:
        'Mỗi quyết định lớn: ép bản thân chờ 24h và hỏi 2 người dưới quyền trước khi chốt.',
    },
    {
      title: 'Khả năng tạo momentum',
      assessment:
        'Đội nhóm dễ chạy theo bạn khi bạn ra tín hiệu rõ ràng và bắt tay làm trước.',
      risk: 'Khi bạn ngưng, momentum đội cũng ngưng — chưa có ai thay được nhịp.',
      action:
        'Trong 30 ngày, train 1 phó tướng có thể chủ trì daily stand-up không cần bạn.',
    },
  ],
  blind_spots: [
    {
      title: 'Cô lập cảm xúc dưới áp lực',
      assessment:
        'Khi dòng tiền căng, bạn có xu hướng đóng cửa lại, ít chia sẻ với cộng sự.',
      risk: 'Team đoán mò → tin đồn → giảm năng suất nhanh hơn cả vấn đề tài chính thực.',
      action:
        "Có 1 buổi 'state of the union' với 3 cấp dưới mỗi 2 tuần, nói rõ tình hình + kế hoạch.",
    },
    {
      title: 'Áp lực dồn lên middle manager',
      assessment:
        'Bạn có xu hướng nhảy qua middle manager để chỉ đạo trực tiếp khi gấp.',
      risk: "Middle manager mất quyền lực thực, dần trở thành 'gác cửa' không có quyết định.",
      action:
        'Trong 60 ngày, mọi yêu cầu xuống staff đều đi qua middle manager — kể cả việc gấp.',
    },
  ],
  career_insights: [
    {
      title: 'Founder cash-flow discipline',
      assessment:
        'Với vai founder hiện tại, ưu tiên là cash discipline + delegation rhythm + middle-management clarity trước khi mở rộng.',
      risk: 'Mở chi nhánh mới mà chưa fix dòng tiền hiện tại sẽ phá vỡ cả hệ thống.',
      action:
        'Pause kế hoạch mở rộng 60 ngày. Tập trung optimize unit economics chi nhánh hiện tại.',
    },
  ],
  financial_insights: [
    {
      title: 'Phân loại 3 nhóm quyết định tài chính',
      assessment:
        "Hiện mọi quyết định tài chính đều bị cảm nhận là 'gấp' và 'quan trọng' như nhau.",
      risk: 'Decision fatigue → quyết định sai ở việc trung bình hoặc trì hoãn việc thực sự gấp.',
      action:
        'Tách quyết định tài chính thành 3 nhóm: (a) bắt buộc — duyệt ngay, (b) trì hoãn được — review hàng tuần, (c) thử nghiệm nhỏ — cap budget.',
    },
  ],
  relationships_insights: [
    {
      title: 'Middle manager alignment',
      assessment:
        'Middle manager là tầng quyết định độ ổn định của cả tổ chức trong giai đoạn áp lực.',
      risk: 'Mất 1 middle manager giỏi = mất 3-6 tháng đào tạo người mới + giảm tinh thần team.',
      action:
        'Mỗi tuần: 1 buổi 1:1 với mỗi middle manager, 30 phút, không bàn task — chỉ bàn họ.',
    },
  ],
  current_year_outlook:
    'Năm hiện tại tải về phía bạn nhiều quyết định irreversible (capex, hire C-level, mở chi nhánh). Đây không phải định mệnh — đây là pattern bạn có thể chủ động làm chậm. Tam chuyển thì tướng chuyển: thay đổi tốc độ ra quyết định, thì khí hậu đội nhóm và kết quả tài chính cũng thay đổi.',
  current_year_vulnerabilities: [
    {
      title: 'Capex impulse',
      assessment:
        "Khả năng đầu tư lớn không tính kỹ payback dưới áp lực 'phải làm gì đó'.",
      risk: 'Một quyết định sai có thể khoá dòng tiền 6-12 tháng.',
      action:
        'Mọi capex lớn cần có payback model viết tay + 2 người review trước khi sign.',
    },
  ],
  current_year_opportunities: [
    'Cơ hội train phó tướng — lúc khó là lúc chọn ra người chịu được áp lực.',
    'Cơ hội renegotiate với supplier khi quan hệ đã có nền — ép discount 5-10% rất khả thi.',
    'Cơ hội rút gọn menu/sản phẩm về core 20% — bỏ long-tail không có biên.',
  ],
  action_plan: {
    days_30: [
      'Freeze non-essential capex 30 ngày; review payback periods chi nhánh.',
      'Tạo weekly cash dashboard: runway, supplier debt, payroll, inventory turns.',
      'Hold 1:1 với mỗi middle manager — nghe blocker, không nghe status.',
    ],
    days_60: [
      'Standardize 3 SOP đang hỏng nhất; thay chỉ đạo cảm tính bằng spec rõ ràng.',
      'Move 20% quyết định nghẽn sang delegation framework (RAPID hoặc DACI).',
    ],
    days_90: [
      'Run quarterly people review tập trung capability gaps, không phải blame.',
      'Lock forward-looking cash plan cho 2 quý tới với stress-test scenarios.',
    ],
  },
  suggested_mentor_prompts: [
    'Tôi nên xử lý nhân sự chống đối thế nào?',
    'Tôi có nên mở chi nhánh mới tháng này không?',
    'Điểm mù lớn nhất của tôi trong quản trị là gì?',
    'Tạo cho tôi kế hoạch 7 ngày để ổn định dòng tiền.',
  ],
  caution_flags: [
    'Đây là phân tích phản tỉnh, không phải tư vấn pháp lý/tài chính/y khoa/tuyển dụng chính thức.',
    'Không dùng output này làm căn cứ duy nhất để sa thải hoặc tuyển dụng.',
    'Khi quyết định tài chính lớn, tham khảo chuyên gia có license phù hợp.',
  ],
  deterministic_calculation_summary: {},
  retrieved_rag_snippets: [],
  confidence_notes: ['Mock data — V1 demo, không phải LLM thực sự.'],
  career_and_business_guidance:
    'Ưu tiên cash discipline, delegation rhythm và middle-management clarity trước khi expansion.',
  current_year_vulnerability_forecast:
    'Rủi ro gần là tổ hợp của capital demand cao, quyết định nhanh và team fear chưa giải quyết.',
  recommended_90_day_plan: [],
};

export interface MockUserContextSummary {
  display_name: string;
  role: string;
  primary_concern: string;
}

export const MOCK_USER_CONTEXT: MockUserContextSummary = {
  display_name: 'Anh Minh',
  role: 'Founder F&B (3 chi nhánh)',
  primary_concern: 'Dòng tiền căng + middle manager chống đối',
};
