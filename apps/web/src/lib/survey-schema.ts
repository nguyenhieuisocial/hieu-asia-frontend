/**
 * Personality survey schema (SurveyJS JSON).
 *
 * 5 cụm × 12-15 câu V1 — map sang trục MBTI E/I/S/N/T/F/J/P khi áp dụng được.
 * Câu free-text đẩy vào `user_context.personality_raw` ở backend.
 *
 * Wave 60.21 — Axis tags MOVED OUT of question `description` field.
 * SurveyJS renders `description` as user-visible text below the title, so
 * the prior "axis:J-P" string was leaking internal scoring metadata into
 * the UI. Now stored in `QUESTION_AXIS_MAP` keyed by question name;
 * backend scorer service should import/lookup by question name.
 */

export interface SurveyAnswers {
  [key: string]: string | number | string[] | undefined;
}

/**
 * MBTI-axis annotation per question name. Backend scorer reads this map
 * (or maintains its own server-side copy) to weight responses into the
 * E/I, S/N, T/F, J/P axes. Values use the canonical MBTI dyad letters
 * separated by `-` (e.g. `J-P` means responses bias the J↔P axis).
 *
 * Questions NOT in this map are free-text or descriptive — not scored.
 */
export const QUESTION_AXIS_MAP: Record<string, 'E-I' | 'S-N' | 'T-F' | 'J-P'> = {
  q_decision_speed: 'J-P',
  q_decision_logic: 'T-F',
  q_decision_risk: 'S-N',
  q_pressure_energy: 'E-I',
  q_pressure_response: 'J-P',
  q_team_style: 'E-I',
  q_team_feedback: 'T-F',
  q_team_conflict: 'T-F',
};

export const SURVEY_SCHEMA = {
  title: 'Khảo sát Tính cách & Bối cảnh',
  showProgressBar: 'top',
  progressBarType: 'questions',
  showQuestionNumbers: 'off',
  completeText: 'Hoàn tất khảo sát',
  pageNextText: 'Tiếp theo',
  pagePrevText: 'Quay lại',
  pages: [
    {
      name: 'decision',
      title: 'Cách bạn ra quyết định',
      elements: [
        {
          type: 'radiogroup',
          name: 'q_decision_speed',
          title: 'Khi đứng trước một quyết định quan trọng, bạn thường:',
          isRequired: true,
          choices: [
            'Quyết nhanh theo trực giác rồi điều chỉnh sau',
            'Cân nhắc kỹ vài phương án trước khi chọn',
            'Cần dữ liệu đầy đủ mới quyết',
            'Tham khảo người tin cậy rồi quyết',
          ],
        },
        {
          type: 'rating',
          name: 'q_decision_logic',
          title: 'Bạn dựa vào lý trí hay cảm xúc khi quyết định?',
          rateMin: 1,
          rateMax: 5,
          minRateDescription: 'Hoàn toàn cảm xúc',
          maxRateDescription: 'Hoàn toàn lý trí',
          isRequired: true,
        },
        {
          type: 'radiogroup',
          name: 'q_decision_risk',
          title: 'Khi cơ hội có rủi ro, bạn nghiêng về:',
          isRequired: true,
          choices: [
            'Thử ngay nếu lợi ích lớn',
            'Thử nhỏ trước, mở rộng nếu được',
            'Đợi tín hiệu rõ rồi vào',
            'Ưu tiên giữ ổn định, bỏ qua',
          ],
        },
      ],
    },
    {
      name: 'pressure',
      title: 'Phản ứng dưới áp lực',
      elements: [
        {
          type: 'rating',
          name: 'q_pressure_energy',
          title: 'Khi căng thẳng, bạn nạp năng lượng bằng:',
          rateMin: 1,
          rateMax: 5,
          minRateDescription: 'Ở một mình',
          maxRateDescription: 'Gặp người khác',
          isRequired: true,
        },
        {
          type: 'radiogroup',
          name: 'q_pressure_response',
          title: 'Khi mọi thứ trật khỏi kế hoạch, phản ứng đầu tiên của bạn là:',
          isRequired: true,
          choices: [
            'Lập kế hoạch mới ngay lập tức',
            'Tìm hiểu nguyên nhân trước khi hành động',
            'Tạm dừng để bình tĩnh lại',
            'Tăng tốc làm việc để bù lại',
          ],
        },
        {
          type: 'checkbox',
          name: 'q_pressure_symptoms',
          title: 'Khi áp lực kéo dài, bạn nhận ra ở mình (chọn nhiều):',
          isRequired: false,
          choices: [
            'Mất ngủ',
            'Ăn nhiều hoặc bỏ ăn',
            'Cáu gắt với người xung quanh',
            'Trì hoãn việc quan trọng',
            'Tự cô lập',
            'Tăng cường tập luyện / làm việc',
          ],
        },
      ],
    },
    {
      name: 'team',
      title: 'Giao tiếp với đội nhóm',
      elements: [
        {
          type: 'rating',
          name: 'q_team_style',
          title: 'Trong nhóm, bạn thường là:',
          rateMin: 1,
          rateMax: 5,
          minRateDescription: 'Người lắng nghe',
          maxRateDescription: 'Người dẫn dắt',
          isRequired: true,
        },
        {
          type: 'radiogroup',
          name: 'q_team_feedback',
          title: 'Khi cần đưa phản hồi tiêu cực cho cộng sự, bạn:',
          isRequired: true,
          choices: [
            'Nói thẳng, đi vào vấn đề',
            'Nói thẳng nhưng giữ thể diện cho người nghe',
            'Vòng vo để tránh tổn thương',
            'Né tránh, hy vọng họ tự nhận ra',
          ],
        },
        {
          type: 'radiogroup',
          name: 'q_team_conflict',
          title: 'Khi có xung đột, bạn thường:',
          isRequired: true,
          choices: [
            'Đối mặt và giải quyết ngay',
            'Lắng nghe các bên trước khi kết luận',
            'Tìm giải pháp dung hoà',
            'Rút lui để giữ hoà khí',
          ],
        },
      ],
    },
    {
      name: 'concern',
      title: 'Mối quan tâm hiện tại',
      elements: [
        {
          type: 'checkbox',
          name: 'q_concern_areas',
          title: 'Bạn đang cần lời khuyên về (chọn nhiều):',
          isRequired: true,
          choices: [
            'Sự nghiệp / hướng đi nghề nghiệp',
            'Tài chính / dòng tiền',
            'Khởi nghiệp / kinh doanh',
            'Quản trị nhân sự',
            'Quan hệ gia đình',
            'Tình cảm / hôn nhân',
            'Sức khỏe tinh thần',
            'Hướng phát triển bản thân',
          ],
        },
        {
          type: 'comment',
          name: 'q_concern_current_situation',
          title: 'Tình huống cụ thể bạn đang đối mặt (1-2 câu, optional):',
          isRequired: false,
          maxLength: 500,
        },
      ],
    },
    {
      name: 'open',
      title: 'Câu hỏi tự do',
      elements: [
        {
          type: 'comment',
          name: 'q_open_self_describe',
          title:
            'Nếu phải mô tả bản thân cho một người cố vấn chỉ trong 3-4 câu, bạn sẽ nói gì?',
          isRequired: false,
          rows: 6,
          maxLength: 1200,
          placeholder: 'Ví dụ: Tôi là người hành động nhanh, đôi khi quá vội. Tôi đang...',
        },
      ],
    },
  ],
};

export type SurveyComplete = (answers: SurveyAnswers) => void;
