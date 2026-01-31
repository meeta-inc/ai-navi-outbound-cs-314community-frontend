import { useState } from 'react';
import { X, Search, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SCHOOLS, type School } from '../../../data/mockSchools';
import { getColorClasses } from '../../../shared/config/theme.config';
import type { AccentColor } from '../../../shared/config/theme.config';
import { registerLearningInfo } from '../../../services/api/learningInfo';
import type { GradeId } from '../../../types/api/learningInfo.types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  accentColor?: AccentColor;
  userId?: string; // API 호출을 위한 userId
}

type GradeType = 'middle1' | 'middle2' | 'middle3' | 'high1' | 'high2' | 'high3';

const GRADE_LABELS: Record<GradeType, { label: string; emoji: string }> = {
  middle1: { label: '中学1年生', emoji: '📚' },
  middle2: { label: '中学2年生', emoji: '📖' },
  middle3: { label: '中学3年生', emoji: '✏️' },
  high1: { label: '高校1年生', emoji: '🎓' },
  high2: { label: '高校2年生', emoji: '📝' },
  high3: { label: '高校3年生', emoji: '🎯' },
};

// GradeType을 API의 gradeId와 gradeLevel로 변환
const convertGradeToApiFormat = (grade: GradeType): { gradeId: GradeId; gradeLevel: number } => {
  const gradeMapping: Record<GradeType, { gradeId: GradeId; gradeLevel: number }> = {
    middle1: { gradeId: 'middle', gradeLevel: 7 },
    middle2: { gradeId: 'middle', gradeLevel: 8 },
    middle3: { gradeId: 'middle', gradeLevel: 9 },
    high1: { gradeId: 'high', gradeLevel: 10 },
    high2: { gradeId: 'high', gradeLevel: 11 },
    high3: { gradeId: 'high', gradeLevel: 12 },
  };
  return gradeMapping[grade];
};

export function OnboardingModal({ isOpen, onClose, onComplete, accentColor = 'orange', userId }: OnboardingModalProps) {
  const [step, setStep] = useState<'studentType' | 'grade' | 'school' | 'confirm'>('studentType');
  const [studentType, setStudentType] = useState<'middle' | 'high' | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeType | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [customSchoolName, setCustomSchoolName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // API 호출 로딩 상태

  const colors = getColorClasses(accentColor);

  const allGrades = Object.entries(GRADE_LABELS).map(([value, data]) => ({
    value: value as GradeType,
    ...data,
  }));

  const grades = studentType
    ? allGrades.filter(grade =>
        studentType === 'middle'
          ? grade.value.startsWith('middle')
          : grade.value.startsWith('high')
      )
    : [];

  const filteredSchools = MOCK_SCHOOLS
    .filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = studentType
        ? school.type === studentType || school.type === 'both'
        : true;
      return matchesSearch && matchesType;
    })
    .slice(0, 2);

  const handleStudentTypeSelect = (type: 'middle' | 'high') => {
    setStudentType(type);
    setTimeout(() => {
      setStep('grade');
    }, 300);
  };

  const handleGradeSelect = (grade: GradeType) => {
    setSelectedGrade(grade);
    setTimeout(() => {
      setStep('school');
    }, 300);
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setCustomSchoolName('');
    setShowCustomInput(false);
  };

  const handleCustomSchoolToggle = () => {
    setShowCustomInput(true);
    setSelectedSchool(null);
    setSearchQuery('');
  };

  const handleConfirm = () => {
    if (!canComplete) return;
    setTimeout(() => {
      setStep('confirm');
    }, 300);
  };

  const handleComplete = async () => {
    if (!selectedGrade) return;

    if (!selectedSchool && !customSchoolName.trim()) {
      return;
    }

    const schoolName = selectedSchool?.name || customSchoolName.trim();

    // userId가 없으면 API 호출 없이 기존 로직 실행
    if (!userId) {
      console.warn('userId is not provided, skipping API call');
      const onboardingData = {
        grade: selectedGrade,
        schoolId: selectedSchool?.id,
        schoolName: schoolName,
        schoolRegion: selectedSchool?.region,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
      localStorage.setItem('onboarding_completed', 'true');
      onComplete();
      onClose();
      return;
    }

    // 로딩 시작
    setIsLoading(true);

    try {
      // GradeType을 API 형식으로 변환
      const { gradeId, gradeLevel } = convertGradeToApiFormat(selectedGrade);

      // API 호출
      const response = await registerLearningInfo(userId, {
        gradeId,
        gradeLevel,
        schoolName,
      });

      console.log('Learning info registered successfully:', response);

      // 성공 시 로컬 스토리지에 저장
      const onboardingData = {
        grade: selectedGrade,
        schoolId: selectedSchool?.id,
        schoolName: schoolName,
        schoolRegion: selectedSchool?.region,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
      localStorage.setItem('onboarding_completed', 'true');

      // 성공 시 모달 닫기 및 완료 콜백 호출
      onComplete();
      onClose();
    } catch (error) {
      // 에러 시 로딩 상태만 해제 (로딩 직전 상태로 복원)
      console.error('Failed to register learning info:', error);
      setIsLoading(false);
      // 에러 발생 시 confirm 화면 유지 (사용자가 다시 시도할 수 있음)
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('school');
    } else if (step === 'school') {
      setStep('grade');
      setSelectedSchool(null);
      setCustomSchoolName('');
      setShowCustomInput(false);
    } else if (step === 'grade') {
      setStep('studentType');
      setSelectedGrade(null);
    }
  };

  const canComplete = selectedGrade && (selectedSchool || customSchoolName.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`relative ${colors.bgLight} p-4 pb-6 border-b-2 ${colors.border} flex-shrink-0`}>
                <button
                  onClick={onClose}
                  className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${colors.bgHover}`}
                  aria-label="閉じる"
                >
                  <X className={`w-4 h-4 ${colors.text}`} />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-3xl mb-2"
                  >
                    {step === 'studentType' ? '👨‍🎓' : step === 'grade' ? '🎓' : step === 'school' ? '🏫' : '✅'}
                  </motion.div>
                  <h2 className={`text-lg font-bold mb-1 ${colors.textBlack}`}>
                    {step === 'studentType' && '中学生 または 高校生'}
                    {step === 'grade' && '学年を選択してください'}
                    {step === 'school' && '学校を選択してください'}
                    {step === 'confirm' && '選択内容の確認'}
                  </h2>
                  <p className={`text-xs ${colors.textSecondary}`}>
                    {step === 'studentType' && 'お子様の学生タイプを選んでください'}
                    {step === 'grade' && 'お子様の現在の学年を選んでください'}
                    {step === 'school' && `${studentType === 'middle' ? '中学校' : '高校'}を検索または選択してください`}
                    {step === 'confirm' && '以下の内容で登録します'}
                  </p>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bgSecondary}`}>
                  <motion.div
                    className={`h-full ${colors.background}`}
                    initial={{ width: '0%' }}
                    animate={{
                      width: step === 'studentType' ? '25%' : step === 'grade' ? '50%' : step === 'school' ? '75%' : '100%'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {step === 'studentType' ? (
                    <motion.div
                      key="studentType"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        onClick={() => handleStudentTypeSelect('middle')}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all
                          hover:scale-105 hover:shadow-lg active:scale-95
                          ${studentType === 'middle'
                            ? `${colors.border} ${colors.bgLight} shadow-md`
                            : `border-gray-200 bg-white ${colors.bgHover}`
                          }
                        `}
                      >
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-base font-bold text-gray-800">中学生</div>
                        <div className="text-xs text-gray-500 mt-0.5">1年生〜3年生</div>
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        onClick={() => handleStudentTypeSelect('high')}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all
                          hover:scale-105 hover:shadow-lg active:scale-95
                          ${studentType === 'high'
                            ? `${colors.border} ${colors.bgLight} shadow-md`
                            : `border-gray-200 bg-white ${colors.bgHover}`
                          }
                        `}
                      >
                        <div className="text-3xl mb-2">🎓</div>
                        <div className="text-base font-bold text-gray-800">高校生</div>
                        <div className="text-xs text-gray-500 mt-0.5">1年生〜3年生</div>
                      </motion.button>
                    </motion.div>
                  ) : step === 'grade' ? (
                    <motion.div
                      key="grade"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-3 gap-2"
                    >
                      {grades.map((grade, index) => (
                        <motion.button
                          key={grade.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleGradeSelect(grade.value)}
                          className={`
                            relative p-3 rounded-xl border-2 transition-all
                            hover:scale-105 hover:shadow-lg active:scale-95
                            ${selectedGrade === grade.value
                              ? `${colors.border} ${colors.bgLight} shadow-md`
                              : `border-gray-200 bg-white ${colors.bgHover}`
                            }
                          `}
                        >
                          <div className="text-2xl mb-1">{grade.emoji}</div>
                          <div className="text-xs font-semibold text-gray-800">{grade.label}</div>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : step === 'school' ? (
                    <motion.div
                      key="school"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      {!showCustomInput && (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`${studentType === 'middle' ? '中学校' : '高校'}名を検索...`}
                            className={`w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none transition-colors focus:${colors.border}`}
                          />
                        </div>
                      )}

                      {showCustomInput ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <input
                            type="text"
                            value={customSchoolName}
                            onChange={(e) => setCustomSchoolName(e.target.value)}
                            placeholder="学校名を入力してください"
                            autoFocus
                            className={`w-full px-3 py-2.5 border-2 ${colors.border} rounded-lg text-sm focus:outline-none`}
                          />
                          <button
                            onClick={() => {
                              setShowCustomInput(false);
                              setCustomSchoolName('');
                            }}
                            className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            ← リストに戻る
                          </button>
                        </motion.div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {filteredSchools.length > 0 ? (
                            <>
                              {filteredSchools.map((school, index) => (
                                <motion.button
                                  key={school.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  onClick={() => handleSchoolSelect(school)}
                                  className={`
                                    w-full text-left p-3 rounded-lg border-2 transition-all
                                    ${colors.bgHover}
                                    ${selectedSchool?.id === school.id
                                      ? `${colors.border} ${colors.bgLight}`
                                      : 'border-gray-200 bg-white'
                                    }
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="text-sm font-medium text-gray-800">{school.name}</div>
                                      <div className="text-xs text-gray-500">{school.region}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  </div>
                                </motion.button>
                              ))}
                              <button
                                onClick={handleCustomSchoolToggle}
                                className={`w-full p-3 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-600 transition-all ${colors.textHover} ${colors.bgHover}`}
                              >
                                リストにない学校を入力
                              </button>
                            </>
                          ) : (
                            <div className="text-center py-6 space-y-2">
                              <div className="text-sm text-gray-500">該当する学校が見つかりません</div>
                              <button
                                onClick={handleCustomSchoolToggle}
                                className={`px-4 py-2 text-sm ${colors.background} text-white rounded-lg ${colors.backgroundHover} transition-colors`}
                              >
                                直接入力する
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      <div className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bgLight} space-y-3`}>
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                          <div className="text-2xl">
                            {studentType === 'middle' ? '📚' : '🎓'}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600">学生区分</div>
                            <div className="text-sm font-bold text-gray-800">
                              {studentType === 'middle' ? '中学生' : '高校生'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                          <div className="text-2xl">
                            {selectedGrade && GRADE_LABELS[selectedGrade].emoji}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600">学年</div>
                            <div className="text-sm font-bold text-gray-800">
                              {selectedGrade && GRADE_LABELS[selectedGrade].label}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🏫</div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600">学校</div>
                            <div className="text-sm font-bold text-gray-800">
                              {selectedSchool?.name || customSchoolName}
                            </div>
                            {selectedSchool?.region && (
                              <div className="text-xs text-gray-500">{selectedSchool.region}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg ${colors.bgLight} border ${colors.border}`}>
                        <p className="text-xs text-gray-600 text-center">
                          上記の内容で登録してよろしいですか？
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <div className="flex gap-2">
                  {(step === 'grade' || step === 'school' || step === 'confirm') && (
                    <button
                      onClick={handleBack}
                      disabled={isLoading}
                      className={`px-4 py-2.5 text-sm border-2 border-gray-300 text-gray-700 font-medium rounded-lg transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                      }`}
                    >
                      戻る
                    </button>
                  )}
                  {step === 'school' && (
                    <button
                      onClick={handleConfirm}
                      disabled={!canComplete}
                      className={`
                        flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                        ${canComplete
                          ? `${colors.background} text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${colors.backgroundHover}`
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      確認
                    </button>
                  )}
                  {step === 'confirm' && (
                    <button
                      onClick={handleComplete}
                      disabled={isLoading}
                      className={`
                        flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        ${isLoading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : `${colors.background} text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${colors.backgroundHover}`
                        }
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          登録中...
                        </>
                      ) : (
                        '完了'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
