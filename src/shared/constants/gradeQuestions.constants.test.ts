/**
 * @fileoverview 학년별 카테고리 질문 데이터 상수 테스트
 * 
 * 이 테스트는 이슈 #29 (https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29) 
 * TDD 단계1-1에서 작성된 테스트로, 학년별 FAQ 질문 데이터의 구조와 내용을 검증합니다.
 * 
 * 테스트 범위:
 * - 데이터 구조 검증 (학년, 카테고리, 질문 수)
 * - 질문 객체 구조 검증 (id, text, isBest)
 * - 콘텐츠 검증 (카테고리명, ID 고유성, 베스트 질문)
 * - 학년별 특화 질문 내용 검증
 */

import { GRADE_CATEGORY_QUESTIONS, GradeType, CategoryType } from './gradeQuestions.constants';

describe('GRADE_CATEGORY_QUESTIONS', () => {
  // 테스트 대상 학년: 유아, 초등, 중등, 고등
  const grades: GradeType[] = ['preschool', 'elementary', 'middle', 'high'];
  // 테스트 대상 카테고리: 수업/커리큘럼, 통학/학습시간, 요금/제도
  const categories: CategoryType[] = ['curriculum', 'schedule', 'pricing'];

  /**
   * 📋 데이터 구조 검증 테스트 그룹
   * 
   * 이슈 #29 요구사항에 따른 기본 데이터 구조가 올바르게 정의되었는지 확인
   * - 4개 학년 (유아, 초등, 중등, 고등)
   * - 각 학년당 3개 카테고리 (수업·커리큘럼, 통학·학습시간, 요금·제도)
   * - 각 카테고리당 5개 질문
   */
  describe('Data structure validation', () => {
    /**
     * 🎯 모든 학년 타입이 정의되어 있는지 확인
     * 
     * 검증 내용: GRADE_CATEGORY_QUESTIONS 객체에 4개 학년 키가 모두 존재하는지 확인
     * - preschool (유아)
     * - elementary (초등학생) 
     * - middle (중학생)
     * - high (고등학생)
     */
    it('should have all grade types defined', () => {
      grades.forEach(grade => {
        expect(GRADE_CATEGORY_QUESTIONS).toHaveProperty(grade);
      });
    });

    /**
     * 🎯 각 학년별로 정확히 3개 카테고리가 있는지 확인
     * 
     * 검증 내용: 각 학년마다 curriculum, schedule, pricing 카테고리가 존재하는지 확인
     * 이는 이슈 #29의 "모든 학년에 대해 공통적으로 3개 카테고리만 표시" 요구사항 구현
     */
    it('should have exactly 3 categories for each grade', () => {
      grades.forEach(grade => {
        const gradeCategories = Object.keys(GRADE_CATEGORY_QUESTIONS[grade]);
        expect(gradeCategories).toHaveLength(3);
        expect(gradeCategories).toEqual(expect.arrayContaining(categories));
      });
    });

    /**
     * 🎯 각 카테고리별로 정확히 5개 질문이 있는지 확인
     * 
     * 검증 내용: 4개 학년 × 3개 카테고리 = 12개 조합에서 각각 5개 질문이 있는지 확인
     * 총 60개 질문 (4 × 3 × 5 = 60)이 올바르게 구성되었는지 검증
     */
    it('should have exactly 5 questions for each category in each grade', () => {
      grades.forEach(grade => {
        categories.forEach(category => {
          const questions = GRADE_CATEGORY_QUESTIONS[grade][category];
          expect(questions).toHaveLength(5);
        });
      });
    });

    /**
     * 🎯 모든 질문 객체가 올바른 구조를 가지고 있는지 확인
     * 
     * 검증 내용: 각 질문 객체가 다음 속성들을 올바른 타입으로 가지고 있는지 확인
     * - id: string (고유 식별자)
     * - text: string (질문 텍스트, 빈 문자열 불허)
     * - isBest: boolean (추천 질문 여부)
     */
    it('should have valid question structure for all questions', () => {
      grades.forEach(grade => {
        categories.forEach(category => {
          const questions = GRADE_CATEGORY_QUESTIONS[grade][category];
          questions.forEach((question, index) => {
            expect(question).toHaveProperty('id');
            expect(question).toHaveProperty('text');
            expect(question).toHaveProperty('isBest');
            expect(typeof question.id).toBe('string');
            expect(typeof question.text).toBe('string');
            expect(typeof question.isBest).toBe('boolean');
            expect(question.text).not.toBe('');
          });
        });
      });
    });
  });

  /**
   * 📋 콘텐츠 검증 테스트 그룹
   * 
   * 질문 데이터의 실제 내용과 품질을 검증
   * - 카테고리명의 일본어 표기 정확성
   * - 질문 ID의 전역 고유성
   * - 베스트 질문 개수의 적절성
   */
  describe('Content validation', () => {
    /**
     * 🎯 카테고리명이 올바른 일본어로 표기되어 있는지 확인
     * 
     * 검증 내용: 이슈 #29에서 지정한 정확한 일본어 카테고리명 사용 확인
     * - curriculum: "授業・カリキュラム" (수업·커리큘럼)
     * - schedule: "通塾・学習時間" (통학·학습시간)  
     * - pricing: "料金・制度" (요금·제도)
     */
    it('should have category names in Japanese', () => {
      const expectedCategoryNames = {
        curriculum: '授業・カリキュラム',
        schedule: '通塾・学習時間',
        pricing: '料金・制度'
      };

      expect(GRADE_CATEGORY_QUESTIONS.categoryNames).toEqual(expectedCategoryNames);
    });

    /**
     * 🎯 모든 질문 ID가 전역적으로 고유한지 확인
     * 
     * 검증 내용: 60개 모든 질문의 ID가 중복되지 않는지 확인
     * - 4개 학년 × 3개 카테고리 × 5개 질문 = 60개 고유 ID
     * - ID 형식: "grade-category-number" (예: "high-curriculum-1")
     */
    it('should have unique question IDs across all grades and categories', () => {
      const allIds: string[] = [];
      
      grades.forEach(grade => {
        categories.forEach(category => {
          const questions = GRADE_CATEGORY_QUESTIONS[grade][category];
          questions.forEach(question => {
            allIds.push(question.id);
          });
        });
      });

      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

    /**
     * 🎯 각 카테고리별로 적절한 수의 베스트 질문이 있는지 확인
     * 
     * 검증 내용: 각 카테고리마다 1-3개의 추천 질문(isBest: true)이 있는지 확인
     * - 최소 1개: 사용자에게 추천할 질문이 반드시 존재
     * - 최대 3개: 너무 많은 추천으로 사용자 혼란 방지
     */
    it('should have at least one best question per category for each grade', () => {
      grades.forEach(grade => {
        categories.forEach(category => {
          const questions = GRADE_CATEGORY_QUESTIONS[grade][category];
          const bestQuestions = questions.filter(q => q.isBest);
          expect(bestQuestions.length).toBeGreaterThanOrEqual(1);
          expect(bestQuestions.length).toBeLessThanOrEqual(3);
        });
      });
    });
  });

  /**
   * 📋 학년별 특화 콘텐츠 검증 테스트 그룹
   * 
   * 각 학년에 맞는 특화된 질문 내용이 포함되어 있는지 확인
   * 이슈 #29 명세서에 명시된 학년별 핵심 질문들의 존재 여부 검증
   */
  describe('Specific grade content', () => {
    /**
     * 🎯 고등학생 특화 질문이 포함되어 있는지 확인
     * 
     * 검증 내용: 고등학생 수업·커리큘럼 카테고리에 대학수험 관련 질문 포함 확인
     * - "大学受験対策はどの科목に対応していますか？" (대학수험대책은 어느 과목에 대응하고 있습니까?)
     * - "難関大学向けの指導はありますか？" (난관대학 대상 지도가 있습니까?)
     */
    it('should have high school specific questions', () => {
      const highSchoolCurriculumQuestions = GRADE_CATEGORY_QUESTIONS.high.curriculum;
      const questionTexts = highSchoolCurriculumQuestions.map(q => q.text);
      
      expect(questionTexts).toContain('大学受験対策はどの科目に対応していますか？');
      expect(questionTexts).toContain('難関大学向けの指導はありますか？');
    });

    /**
     * 🎯 중학생 특화 질문이 포함되어 있는지 확인
     * 
     * 검증 내용: 중학생 수업·커리큘럼 카테고리에 정기시험 및 고교수험 관련 질문 포함 확인
     * - "定期テスト対策はしてもらえますか？" (정기시험 대책을 해주시겠습니까?)
     * - "高校受験対策はいつから始めるべきですか？" (고교수험대책은 언제부터 시작해야 합니까?)
     */
    it('should have middle school specific questions', () => {
      const middleSchoolCurriculumQuestions = GRADE_CATEGORY_QUESTIONS.middle.curriculum;
      const questionTexts = middleSchoolCurriculumQuestions.map(q => q.text);
      
      expect(questionTexts).toContain('定期テスト対策はしてもらえますか？');
      expect(questionTexts).toContain('高校受験対策はいつから始めるべきですか？');
    });

    /**
     * 🎯 초등학생 특화 질문이 포함되어 있는지 확인
     * 
     * 검증 내용: 초등학생 수업·커리큘럼 카테고리에 중학수험 및 초등교육과정 관련 질문 포함 확인
     * - "中学受験コースはありますか？" (중학수험 코스가 있습니까?)
     * - "小学校の授業に合わせた指導ですか？" (초등학교 수업에 맞춘 지도입니까?)
     */
    it('should have elementary school specific questions', () => {
      const elementaryCurriculumQuestions = GRADE_CATEGORY_QUESTIONS.elementary.curriculum;
      const questionTexts = elementaryCurriculumQuestions.map(q => q.text);
      
      expect(questionTexts).toContain('中学受験コースはありますか？');
      expect(questionTexts).toContain('小学校の授業に合わせた指導ですか？');
    });

    /**
     * 🎯 유아 특화 질문이 포함되어 있는지 확인
     * 
     * 검증 내용: 유아 수업·커리큘럼 카테고리에 연령 및 초등수험 관련 질문 포함 확인
     * - "何歳から通えますか？" (몇 살부터 다닐 수 있습니까?)
     * - "小学校受験に対応していますか？" (초등학교 수험에 대응하고 있습니까?)
     */
    it('should have preschool specific questions', () => {
      const preschoolCurriculumQuestions = GRADE_CATEGORY_QUESTIONS.preschool.curriculum;
      const questionTexts = preschoolCurriculumQuestions.map(q => q.text);
      
      expect(questionTexts).toContain('何歳から通えますか？');
      expect(questionTexts).toContain('小学校受験に対応していますか？');
    });
  });
});