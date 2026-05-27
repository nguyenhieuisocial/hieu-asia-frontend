/**
 * Extended personality survey schema (Wave 60.94.n)
 *
 * MVP scaffold per [[81 - V1 Postmortem]] §9 + [[80 - Master Plan V1]] §plan.
 * Complements existing MBTI-style schema in `survey-schema.ts` with:
 * - **Big Five (OCEAN)** — IPIP-NEO short form, 20 items (4 per trait MVP;
 *   expand to 120 items per IPIP-NEO-120 spec for Premium tier)
 * - **DiSC** — open-source short form, 16 items (4 per dimension MVP;
 *   expand to 24 items for Premium tier)
 *
 * Total MVP: 36 items. Full Premium: 144 items.
 *
 * License: IPIP-NEO is public domain (https://ipip.ori.org/), DiSC short
 * form here is an open-source clone (NOT licensed Wiley DiSC).
 *
 * Question naming convention:
 * - `ipip_o_01` = IPIP, Openness, item 1
 * - `disc_d_01` = DiSC, Dominance, item 1
 *
 * Reverse-scored items (where AGREE indicates LOW trait, vd: "Tôi không quan
 * tâm đến nghệ thuật" agree = low openness) are listed in REVERSE_SCORED.
 */

export type BigFiveTrait = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
export type DiscDimension = 'dominance' | 'influence' | 'steadiness' | 'compliance';

export const BIG_FIVE_AXIS_MAP: Record<string, BigFiveTrait> = {
  ipip_o_01: 'openness',
  ipip_o_02: 'openness',
  ipip_o_03: 'openness',
  ipip_o_04: 'openness',
  ipip_c_01: 'conscientiousness',
  ipip_c_02: 'conscientiousness',
  ipip_c_03: 'conscientiousness',
  ipip_c_04: 'conscientiousness',
  ipip_e_01: 'extraversion',
  ipip_e_02: 'extraversion',
  ipip_e_03: 'extraversion',
  ipip_e_04: 'extraversion',
  ipip_a_01: 'agreeableness',
  ipip_a_02: 'agreeableness',
  ipip_a_03: 'agreeableness',
  ipip_a_04: 'agreeableness',
  ipip_n_01: 'neuroticism',
  ipip_n_02: 'neuroticism',
  ipip_n_03: 'neuroticism',
  ipip_n_04: 'neuroticism',
};

export const DISC_AXIS_MAP: Record<string, DiscDimension> = {
  disc_d_01: 'dominance',
  disc_d_02: 'dominance',
  disc_d_03: 'dominance',
  disc_d_04: 'dominance',
  disc_i_01: 'influence',
  disc_i_02: 'influence',
  disc_i_03: 'influence',
  disc_i_04: 'influence',
  disc_s_01: 'steadiness',
  disc_s_02: 'steadiness',
  disc_s_03: 'steadiness',
  disc_s_04: 'steadiness',
  disc_c_01: 'compliance',
  disc_c_02: 'compliance',
  disc_c_03: 'compliance',
  disc_c_04: 'compliance',
};

/**
 * Items where AGREE indicates LOW trait score (must invert score in scoring fn).
 * E.g. "Tôi ít quan tâm đến nghệ thuật" — agree = low openness.
 */
export const REVERSE_SCORED = new Set<string>([
  'ipip_o_03',
  'ipip_c_03',
  'ipip_e_03',
  'ipip_a_03',
  'ipip_n_03',
  'disc_s_03',
  'disc_c_03',
]);

const likertChoices = [
  { value: 1, text: 'Rất không đồng ý' },
  { value: 2, text: 'Không đồng ý' },
  { value: 3, text: 'Trung lập' },
  { value: 4, text: 'Đồng ý' },
  { value: 5, text: 'Rất đồng ý' },
];

export const EXTENDED_SURVEY_SCHEMA = {
  title: 'Khảo sát Tính cách mở rộng (Big Five + DiSC)',
  showProgressBar: 'top',
  progressBarType: 'questions',
  pages: [
    {
      name: 'big_five_openness',
      title: 'Big Five — Openness (Cởi mở với trải nghiệm)',
      elements: [
        { type: 'radiogroup', name: 'ipip_o_01', title: 'Tôi có trí tưởng tượng phong phú.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_o_02', title: 'Tôi thích thử ý tưởng mới và lý thuyết trừu tượng.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_o_03', title: 'Tôi ít quan tâm đến nghệ thuật.', choices: likertChoices, isRequired: true }, // reverse-scored
        { type: 'radiogroup', name: 'ipip_o_04', title: 'Tôi thích khám phá các nền văn hóa khác nhau.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'big_five_conscientiousness',
      title: 'Big Five — Conscientiousness (Tận tâm)',
      elements: [
        { type: 'radiogroup', name: 'ipip_c_01', title: 'Tôi luôn hoàn thành công việc đúng hạn.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_c_02', title: 'Tôi chuẩn bị kỹ trước khi làm bất kỳ việc gì.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_c_03', title: 'Tôi thường để mọi thứ lộn xộn.', choices: likertChoices, isRequired: true }, // reverse
        { type: 'radiogroup', name: 'ipip_c_04', title: 'Tôi đặt ra mục tiêu rõ ràng và theo đuổi đến cùng.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'big_five_extraversion',
      title: 'Big Five — Extraversion (Hướng ngoại)',
      elements: [
        { type: 'radiogroup', name: 'ipip_e_01', title: 'Tôi cảm thấy thoải mái khi gặp người mới.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_e_02', title: 'Tôi nói chuyện nhiều trong các buổi gặp gỡ.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_e_03', title: 'Tôi thường ít nói ở nơi đông người.', choices: likertChoices, isRequired: true }, // reverse
        { type: 'radiogroup', name: 'ipip_e_04', title: 'Tôi cảm thấy tràn đầy năng lượng khi xung quanh có nhiều người.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'big_five_agreeableness',
      title: 'Big Five — Agreeableness (Dễ chịu)',
      elements: [
        { type: 'radiogroup', name: 'ipip_a_01', title: 'Tôi tin tưởng người khác.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_a_02', title: 'Tôi dành thời gian quan tâm đến người khác.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_a_03', title: 'Tôi đôi khi lạnh lùng với người khác.', choices: likertChoices, isRequired: true }, // reverse
        { type: 'radiogroup', name: 'ipip_a_04', title: 'Tôi sẵn sàng tha thứ.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'big_five_neuroticism',
      title: 'Big Five — Neuroticism (Bất ổn cảm xúc)',
      elements: [
        { type: 'radiogroup', name: 'ipip_n_01', title: 'Tôi dễ cảm thấy căng thẳng.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_n_02', title: 'Tôi lo lắng về nhiều thứ.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'ipip_n_03', title: 'Tôi thường thấy thư thái và bình tĩnh.', choices: likertChoices, isRequired: true }, // reverse
        { type: 'radiogroup', name: 'ipip_n_04', title: 'Tâm trạng tôi thay đổi nhanh.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'disc_dominance',
      title: 'DiSC — Dominance (Quyết đoán)',
      elements: [
        { type: 'radiogroup', name: 'disc_d_01', title: 'Tôi thích kiểm soát kết quả của các tình huống.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_d_02', title: 'Tôi đưa ra quyết định nhanh, ngay cả khi thiếu thông tin.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_d_03', title: 'Tôi thẳng thắn nói ra ý kiến, ngay cả khi gây tranh cãi.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_d_04', title: 'Tôi tiếp cận thách thức một cách trực diện.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'disc_influence',
      title: 'DiSC — Influence (Truyền cảm hứng)',
      elements: [
        { type: 'radiogroup', name: 'disc_i_01', title: 'Tôi giỏi truyền cảm hứng cho người khác.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_i_02', title: 'Tôi thoải mái thể hiện cảm xúc.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_i_03', title: 'Tôi thích làm việc nhóm hơn làm một mình.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_i_04', title: 'Tôi lạc quan về tương lai.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'disc_steadiness',
      title: 'DiSC — Steadiness (Ổn định)',
      elements: [
        { type: 'radiogroup', name: 'disc_s_01', title: 'Tôi kiên nhẫn lắng nghe người khác.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_s_02', title: 'Tôi cảm thấy thoải mái khi mọi thứ ổn định và đoán trước được.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_s_03', title: 'Tôi thích thay đổi và môi trường mới.', choices: likertChoices, isRequired: true }, // reverse
        { type: 'radiogroup', name: 'disc_s_04', title: 'Tôi coi trọng sự hài hòa trong các mối quan hệ.', choices: likertChoices, isRequired: true },
      ],
    },
    {
      name: 'disc_compliance',
      title: 'DiSC — Compliance (Tuân thủ chi tiết)',
      elements: [
        { type: 'radiogroup', name: 'disc_c_01', title: 'Tôi chú ý đến chi tiết và độ chính xác.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_c_02', title: 'Tôi tuân theo các quy trình và quy tắc đã định.', choices: likertChoices, isRequired: true },
        { type: 'radiogroup', name: 'disc_c_03', title: 'Tôi thoải mái phá vỡ quy tắc khi cần thiết.', choices: likertChoices, isRequired: true }, // reverse
        { type: 'radiogroup', name: 'disc_c_04', title: 'Tôi phân tích kỹ trước khi đưa ra quyết định lớn.', choices: likertChoices, isRequired: true },
      ],
    },
  ],
};
