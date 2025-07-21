import { GradeType } from './grade.constants';

export type { GradeType };

export type CategoryType = 'curriculum' | 'schedule' | 'pricing';

export interface Question {
  id: string;
  text: string;
  isBest: boolean;
}

export interface GradeCategoryQuestions {
  preschool: Record<CategoryType, Question[]>;
  elementary: Record<CategoryType, Question[]>;
  middle: Record<CategoryType, Question[]>;
  high: Record<CategoryType, Question[]>;
  categoryNames: Record<CategoryType, string>;
}

export const GRADE_CATEGORY_QUESTIONS: GradeCategoryQuestions = {
  categoryNames: {
    curriculum: '授業・カリキュラム',
    schedule: '通塾・学習時間',
    pricing: '料金・制度'
  },
  
  high: {
    curriculum: [
      {
        id: 'high-curriculum-1',
        text: '大学受験対策はどの科目に対応していますか？',
        isBest: true
      },
      {
        id: 'high-curriculum-2',
        text: '難関大学向けの指導はありますか？',
        isBest: true
      },
      {
        id: 'high-curriculum-3',
        text: '定期テスト対策と受験対策は両立できますか？',
        isBest: false
      },
      {
        id: 'high-curriculum-4',
        text: '苦手な科目だけ受講することは可能ですか？',
        isBest: false
      },
      {
        id: 'high-curriculum-5',
        text: '高1・高2から受験対策を始められますか？',
        isBest: false
      }
    ],
    schedule: [
      {
        id: 'high-schedule-1',
        text: '部活と両立できますか？',
        isBest: true
      },
      {
        id: 'high-schedule-2',
        text: '自習室はいつでも使えますか？',
        isBest: false
      },
      {
        id: 'high-schedule-3',
        text: '通塾の時間帯は選べますか？',
        isBest: false
      },
      {
        id: 'high-schedule-4',
        text: '授業の振替はできますか？',
        isBest: false
      },
      {
        id: 'high-schedule-5',
        text: '夏期・冬期講習はどのくらいの期間ありますか？',
        isBest: false
      }
    ],
    pricing: [
      {
        id: 'high-pricing-1',
        text: '授業料はいくらですか？学年や科目で変わりますか？',
        isBest: true
      },
      {
        id: 'high-pricing-2',
        text: '教材費は別途かかりますか？',
        isBest: false
      },
      {
        id: 'high-pricing-3',
        text: '無料体験はできますか？',
        isBest: false
      },
      {
        id: 'high-pricing-4',
        text: '複数科目の受講は割引がありますか？',
        isBest: false
      },
      {
        id: 'high-pricing-5',
        text: '模試や外部試験の費用は含まれますか？',
        isBest: false
      }
    ]
  },

  middle: {
    curriculum: [
      {
        id: 'middle-curriculum-1',
        text: '定期テスト対策はしてもらえますか？',
        isBest: true
      },
      {
        id: 'middle-curriculum-2',
        text: '学校の教科書に合わせた授業ですか？',
        isBest: false
      },
      {
        id: 'middle-curriculum-3',
        text: '苦手な教科を集中的に見てもらえますか？',
        isBest: false
      },
      {
        id: 'middle-curriculum-4',
        text: '宿題や課題のフォローはありますか？',
        isBest: false
      },
      {
        id: 'middle-curriculum-5',
        text: '高校受験対策はいつから始めるべきですか？',
        isBest: true
      }
    ],
    schedule: [
      {
        id: 'middle-schedule-1',
        text: '部活と両立できますか？',
        isBest: true
      },
      {
        id: 'middle-schedule-2',
        text: '自習室はいつでも使えますか？',
        isBest: false
      },
      {
        id: 'middle-schedule-3',
        text: '通塾の時間帯は選べますか？',
        isBest: false
      },
      {
        id: 'middle-schedule-4',
        text: '授業の振替はできますか？',
        isBest: false
      },
      {
        id: 'middle-schedule-5',
        text: '夏期・冬期講習はどのくらいの期間ありますか？',
        isBest: false
      }
    ],
    pricing: [
      {
        id: 'middle-pricing-1',
        text: '授業料はいくらですか？学年や科目で変わりますか？',
        isBest: true
      },
      {
        id: 'middle-pricing-2',
        text: '教材費は別途かかりますか？',
        isBest: false
      },
      {
        id: 'middle-pricing-3',
        text: '無料体験はできますか？',
        isBest: false
      },
      {
        id: 'middle-pricing-4',
        text: '複数科目の受講は割引がありますか？',
        isBest: false
      },
      {
        id: 'middle-pricing-5',
        text: '模試や外部試験の費用は含まれますか？',
        isBest: false
      }
    ]
  },

  elementary: {
    curriculum: [
      {
        id: 'elementary-curriculum-1',
        text: '小学校の授業に合わせた指導ですか？',
        isBest: true
      },
      {
        id: 'elementary-curriculum-2',
        text: '中学受験コースはありますか？',
        isBest: true
      },
      {
        id: 'elementary-curriculum-3',
        text: '低学年でも集中して取り組めますか？',
        isBest: false
      },
      {
        id: 'elementary-curriculum-4',
        text: '漢字・計算など基礎から見てもらえますか？',
        isBest: false
      },
      {
        id: 'elementary-curriculum-5',
        text: '宿題はありますか？',
        isBest: false
      }
    ],
    schedule: [
      {
        id: 'elementary-schedule-1',
        text: '学童や他の習い事と両立できますか？',
        isBest: true
      },
      {
        id: 'elementary-schedule-2',
        text: '授業の時間帯は何時からですか？',
        isBest: false
      },
      {
        id: 'elementary-schedule-3',
        text: '保護者の送り迎えは必要ですか？',
        isBest: false
      },
      {
        id: 'elementary-schedule-4',
        text: '週1回だけでも通えますか？',
        isBest: false
      },
      {
        id: 'elementary-schedule-5',
        text: '長期休みの講習はありますか？',
        isBest: false
      }
    ],
    pricing: [
      {
        id: 'elementary-pricing-1',
        text: '小学生の授業料はいくらですか？',
        isBest: true
      },
      {
        id: 'elementary-pricing-2',
        text: '兄弟で通うと割引はありますか？',
        isBest: false
      },
      {
        id: 'elementary-pricing-3',
        text: '教材費や年会費はありますか？',
        isBest: false
      },
      {
        id: 'elementary-pricing-4',
        text: '無料体験はできますか？',
        isBest: false
      },
      {
        id: 'elementary-pricing-5',
        text: '入塾テストはありますか？',
        isBest: false
      }
    ]
  },

  preschool: {
    curriculum: [
      {
        id: 'preschool-curriculum-1',
        text: '何歳から通えますか？',
        isBest: true
      },
      {
        id: 'preschool-curriculum-2',
        text: '小学校受験に対応していますか？',
        isBest: true
      },
      {
        id: 'preschool-curriculum-3',
        text: '授業はどんな内容ですか？',
        isBest: false
      },
      {
        id: 'preschool-curriculum-4',
        text: '遊びと学びのバランスはどうなっていますか？',
        isBest: false
      },
      {
        id: 'preschool-curriculum-5',
        text: '人見知りでも大丈夫ですか？',
        isBest: false
      }
    ],
    schedule: [
      {
        id: 'preschool-schedule-1',
        text: '保育園や幼稚園との両立はできますか？',
        isBest: true
      },
      {
        id: 'preschool-schedule-2',
        text: '通う頻度はどのくらいが理想ですか？',
        isBest: false
      },
      {
        id: 'preschool-schedule-3',
        text: '保護者の同伴は必要ですか？',
        isBest: false
      },
      {
        id: 'preschool-schedule-4',
        text: '午後と午前のクラスがありますか？',
        isBest: false
      },
      {
        id: 'preschool-schedule-5',
        text: '欠席時のフォローはありますか？',
        isBest: false
      }
    ],
    pricing: [
      {
        id: 'preschool-pricing-1',
        text: '幼児コースの料金はいくらですか？',
        isBest: true
      },
      {
        id: 'preschool-pricing-2',
        text: '入会金・教材費はかかりますか？',
        isBest: false
      },
      {
        id: 'preschool-pricing-3',
        text: '無料体験はありますか？',
        isBest: false
      },
      {
        id: 'preschool-pricing-4',
        text: '定期的な成長レポートはもらえますか？',
        isBest: false
      },
      {
        id: 'preschool-pricing-5',
        text: '他の年齢層に切り替えるタイミングは？',
        isBest: false
      }
    ]
  }
};