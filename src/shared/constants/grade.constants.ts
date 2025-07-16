export type GradeType = 'preschool' | 'elementary' | 'middle' | 'high';

export const GRADE_OPTIONS: Array<{ type: GradeType; label: string; emoji: string }> = [
  { type: 'preschool', label: '幼児', emoji: '🐣' },
  { type: 'elementary', label: '小学生', emoji: '👦' },
  { type: 'middle', label: '中学生', emoji: '🧑‍🎓' },
  { type: 'high', label: '高校生', emoji: '👩‍🎓' }
];

export const GRADE_LABELS: Record<GradeType, string> = {
  preschool: '🐣幼児',
  elementary: '👦小学生',
  middle: '🧑‍🎓中学生',
  high: '👩‍🎓高校生'
};

export const GRADE_NAMES: Record<GradeType, string> = {
  preschool: '幼児',
  elementary: '小学生',
  middle: '中学生',
  high: '高校生'
};

// 학년별 Top3 질문 로컬라이즈 키
export const GRADE_QUESTION_KEYS: Record<GradeType, string[]> = {
  preschool: [
    'chat.quickReplies.preschool.top1',
    'chat.quickReplies.preschool.top2',
    'chat.quickReplies.preschool.top3'
  ],
  elementary: [
    'chat.quickReplies.elementary.top1',
    'chat.quickReplies.elementary.top2',
    'chat.quickReplies.elementary.top3'
  ],
  middle: [
    'chat.quickReplies.middle.top1',
    'chat.quickReplies.middle.top2',
    'chat.quickReplies.middle.top3'
  ],
  high: [
    'chat.quickReplies.high.top1',
    'chat.quickReplies.high.top2',
    'chat.quickReplies.high.top3'
  ]
};