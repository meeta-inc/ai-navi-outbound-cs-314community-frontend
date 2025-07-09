// import { getApiUrl } from '../../shared/config/app.config'; // 향후 API 호출 시 사용

export interface QuickReplyData {
  id: string;
  text: string;
  type: 'primary' | 'secondary';
}

export interface TopQuestionsData {
  categoryId: string;
  categoryTitle: string;
  questions: string[];
}

export interface ApiQuickRepliesResponse {
  header: string;
  questions: QuickReplyData[];
}

export interface ApiTopQuestionsResponse {
  title: string;
  questions: string[];
}

/**
 * 퀵 리플라이 톱3 질문을 가져오는 API 함수
 * 현재는 로컬 데이터를 반환하지만, 향후 백엔드 API 호출로 변경 예정
 */
export const getQuickReplyQuestions = async (_userId: string): Promise<ApiQuickRepliesResponse> => {
  try {
    // TODO: 실제 API 호출로 교체
    // const apiUrl = getApiUrl();
    // const response = await fetch(`${apiUrl}/questions/quick-replies`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ userId })
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to fetch quick reply questions');
    // }
    
    // return await response.json();
    
    // 현재는 로컬 데이터 반환 (향후 API 호출로 교체)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          header: "✨よくある質問Top3（直近14日間の統計）",
          questions: [
            {
              id: 'top1',
              text: '夏期講習はいつから始まりますか？',
              type: 'primary'
            },
            {
              id: 'top2', 
              text: '年間の授業料はいくらですか？',
              type: 'primary'
            },
            {
              id: 'top3',
              text: '小学生も対象ですか？',
              type: 'primary'
            },
            {
              id: 'other',
              text: 'その他',
              type: 'secondary'
            }
          ]
        });
      }, 300); // 실제 API 호출 시간을 시뮬레이션
    });
  } catch (error) {
    console.error('Error fetching quick reply questions:', error);
    throw error;
  }
};

/**
 * 카테고리별 톱5 질문을 가져오는 API 함수
 * 현재는 로컬 데이터를 반환하지만, 향후 백엔드 API 호출로 변경 예정
 */
export const getTopQuestionsByCategory = async (
  categoryId: string, 
  _userId: string
): Promise<ApiTopQuestionsResponse> => {
  try {
    // TODO: 실제 API 호출로 교체
    // const apiUrl = getApiUrl();
    // const response = await fetch(`${apiUrl}/questions/top-questions/${categoryId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ userId })
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch top questions for category ${categoryId}`);
    // }
    
    // return await response.json();
    
    // 현재는 로컬 데이터 반환 (향후 API 호출로 교체)
    return new Promise((resolve) => {
      setTimeout(() => {
        const questionsMap: Record<string, string[]> = {
          'category1': [
            "宿題はどのくらい出ますか？",
            "学校の宿題と両立できますか？",
            "親が確認する必要はありますか？",
            "宿題を忘れるとどうなりますか？",
            "宿題は効果がありますか？"
          ],
          'category2': [
            "どんな先生が教えてくれますか？",
            "先生は変わることがありますか？",
            "先生との相性が悪い場合は？",
            "質問しやすい環境ですか？",
            "先生の経歴を教えてください"
          ],
          'category3': [
            "合格実績を教えてください",
            "成績向上の事例はありますか？",
            "どのくらいで効果が出ますか？",
            "他の塾との違いは何ですか？",
            "保護者の満足度はどうですか？"
          ],
          'category4': [
            "授業料はいくらですか？",
            "教材費は別途かかりますか？",
            "割引制度はありますか？",
            "兄弟割引はありますか？",
            "月謝以外の費用はありますか？"
          ],
          'other': [
            "入学手続きはどうすればいいですか？",
            "体験授業は受けられますか？",
            "駐車場はありますか？",
            "休んだ時の振替はできますか？",
            "進路相談は受けられますか？"
          ]
        };
        
        const categoryTitles: Record<string, string> = {
          'category1': '授業について',
          'category2': '講師について', 
          'category3': '塾の実績について',
          'category4': '宿題について',
          'other': 'その他'
        };
        
        resolve({
          title: categoryTitles[categoryId] || categoryId,
          questions: questionsMap[categoryId] || []
        });
      }, 300); // 실제 API 호출 시간을 시뮬레이션
    });
  } catch (error) {
    console.error('Error fetching top questions:', error);
    throw error;
  }
};

/**
 * 질문 통계 업데이트 API 함수
 * 질문이 선택되었을 때 통계를 업데이트하는 함수
 */
export const updateQuestionStats = async (
  questionId: string, 
  questionText: string, 
  userId: string
): Promise<void> => {
  try {
    // TODO: 실제 API 호출로 교체
    // const apiUrl = getApiUrl();
    // const response = await fetch(`${apiUrl}/questions/stats`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ 
    //     questionId, 
    //     questionText, 
    //     userId,
    //     timestamp: new Date().toISOString()
    //   })
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to update question stats');
    // }
    
    // 현재는 로깅만 수행 (향후 API 호출로 교체)
    console.log('Question stats updated:', { questionId, questionText, userId });
  } catch (error) {
    console.error('Error updating question stats:', error);
    // 통계 업데이트 실패는 사용자 경험에 영향을 주지 않도록 에러를 던지지 않음
  }
};