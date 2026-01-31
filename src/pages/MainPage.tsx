import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useClientConfig } from '../contexts/ClientConfigContext';
import { ChatLayout } from '../components/templates/ChatLayout';
import { NavigationHeader } from '../components/organisms/NavigationHeader';
import { ChatMessage } from '../components/organisms/ChatMessage';
import { ChatInput } from '../components/organisms/ChatInput';
import { QuickReply } from '../components/organisms/QuickReply';
import { FAQCategory, FAQCategoryItem } from '../components/organisms/FAQCategory';
import { TopQuestions } from '../components/organisms/TopQuestions';
import { VoiceInputModal } from '../components/organisms/VoiceInputModal/VoiceInputModal';
import { MenuModal } from '../components/organisms/MenuModal';
import { MenuService } from '../services/menuService';
import { isIOS } from '../utils/device';
import { TypingIndicator } from '../components/molecules/TypingIndicator';
import { IOSViewportDebug } from '../components/molecules/IOSViewportDebug';
import { AttachedFile } from '../components/molecules/InputField';
import { FileInfo } from '../types/api/fileUpload.types';
import { useChat } from '../hooks/useChat';
import { useActiveComponents } from '../hooks/useActiveComponents';
import { getAccentColor, getShowNavigationHeader, getShowGradeSelection } from '../shared/config/app.config';
import { getColorClasses } from '../shared/config/theme.config';
import { GradeSelection } from '../components/organisms/GradeSelection';
import { GradeQuickReply } from '../components/organisms/GradeQuickReply';
import { GRADE_LABELS, GRADE_NAMES, type GradeType } from '../shared/constants/grade.constants';
import type { Message } from '../types';
import { getCategories, isCategoryApiEnabled } from '../services/api/category';
import { CategoryItem } from '../types/api/category.types';
import { getAttributes, isAttributesApiEnabled } from '../services/api/attributes';
import { AttributeItem } from '../types/api/attributes.types';
import { isFAQEnabled, isInboundApp } from '../utils/appFeatures';
import { OnboardingModal } from '../components/organisms/OnboardingModal';

function MainPage() {
  const { t, isLoading } = useLocale();
  const { clientId, appId, userId, clientName, schoolName, greeting, isEmbeddedEnvironment, isInitialDataReceived, isRequestedLearningOnboarding, isEnableLearningNavi } = useClientConfig(); // Context에서 설정값 가져오기
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  const showNavigationHeader = getShowNavigationHeader();
  const showGradeSelection = getShowGradeSelection();
  const faqEnabled = isFAQEnabled(appId); // FAQ 활성화 여부 확인
  const isInitialized = useRef(false);
  const isGreetingProcessed = useRef(false); // greeting 처리 여부 추적
  const [showFigmaQuickReply, setShowFigmaQuickReply] = useState(false);
  const [showFAQCategories, setShowFAQCategories] = useState(false);
  const [waitingForFAQCategories, setWaitingForFAQCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // API 카테고리 관련 상태
  const [apiCategories, setApiCategories] = useState<FAQCategoryItem[] | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  // API Attributes 관련 상태
  const [apiGrades, setApiGrades] = useState<AttributeItem[] | null>(null);
  const [gradesLoading, setGradesLoading] = useState(false);
  
  // 온보딩 관련 상태
  const [showGradeSelectionComponent, setShowGradeSelectionComponent] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeType | null>(null);
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(false);
  
  // CTA 관련 상태
  const [latestCTAMessageId, setLatestCTAMessageId] = useState<string | null>(null);
  const [hideAllCTA, setHideAllCTA] = useState(false);
  
  // 음성 입력 모달 상태
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // 학습 정보 온보딩 모달 상태
  const [isLearningOnboardingModalOpen, setIsLearningOnboardingModalOpen] = useState(false);
  const isLearningOnboardingCompleted = useRef(false); // 온보딩 완료 여부 추적

  // 파일 첨부 상태
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  // 메시지 ID 기반 컴포넌트 활성화 관리
  const {
    activeComponents,
    activateComponent,
    deactivateComponent,
    isComponentActive
  } = useActiveComponents();

  const {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    isTyping,
    currentlyTyping,
    messagesEndRef,
    chatContainerRef,
    handleSendMessage,
    completeTyping,
    addWelcomeMessage,
    addTypingBotMessage,
    addUserMessage
  } = useChat({
    userId, // Context에서 받은 동적 userId
    gradeId: selectedGrade || 'high', // 선택된 학년 또는 기본값
    clientId, // 쿼리 파라미터에서 받은 clientId
    appId, // 쿼리 파라미터에서 받은 appId
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onTypingComplete: () => {
      // 메시지 타이핑 완료 후 처리
      setTimeout(() => {
        // greeting이 없고 첫 번째 메시지인 경우에만 온보딩/QuickReply 처리
        // (greeting이 있으면 별도의 useEffect에서 처리)
        if (!greeting && messages.length <= 1) {
          if (showGradeSelection) {
            // 학년 선택이 활성화된 경우: 온보딩 메시지 표시
            setShowOnboardingMessage(true);
          } else {
            // 학년 선택이 비활성화된 경우: 기본 QuickReply 표시
            setShowFigmaQuickReply(true);
          }
          // 스크롤
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }, 500);

      // FAQ 카테고리 대기 중이면 표시
      if (waitingForFAQCategories) {
        setTimeout(() => {
          setShowFAQCategories(true);
          setWaitingForFAQCategories(false);
          // FAQ 카테고리가 표시된 후 스크롤
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 500);
      }

    }
  });

  useEffect(() => {
    // 번역이 로드되고 초기화가 아직 되지 않았을 때만 welcome 메시지 추가
    if (!isLoading && !isInitialized.current) {
      // 임베디드 환경(WebView/iframe)에서는 INITIAL_DATA를 기다림
      if (isEmbeddedEnvironment && !isInitialDataReceived) {
        console.log('Waiting for INITIAL_DATA in embedded environment...');
        return; // INITIAL_DATA를 받을 때까지 대기
      }

      // isRequestedLearningOnboarding이 true면 온보딩 모달 표시 (greeting 표시하지 않음)
      if (isRequestedLearningOnboarding && !isLearningOnboardingCompleted.current) {
        console.log('Learning onboarding requested, showing modal...');
        setIsLearningOnboardingModalOpen(true);
        isInitialized.current = true;
        return; // 모달이 닫힐 때까지 greeting 표시하지 않음
      }

      // greeting.main이 있으면 greeting.main을 표시, 없으면 chat.greeting을 표시
      if (greeting?.main) {
        // greeting.main 표시
        addWelcomeMessage(greeting.main);
        isInitialized.current = true;
        isGreetingProcessed.current = true; // greeting 처리 완료 표시

        // greeting.sub가 있으면 추가 표시
        if (greeting.sub) {
          setTimeout(() => {
            addTypingBotMessage(greeting.sub);
            // greeting.sub 타이핑 완료 후 QuickReply 표시
            setTimeout(() => {
              setShowFigmaQuickReply(true);
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }, 1500);
          }, 1500);
        } else {
          // greeting.sub가 없으면 greeting.main 타이핑 완료 후 QuickReply 표시
          setTimeout(() => {
            setShowFigmaQuickReply(true);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 1500);
        }
      } else {
        // greeting이 없으면 chat.greeting 표시
        const welcomeMessage = t('chat.greeting').replace('{school_name}', schoolName);
        addWelcomeMessage(welcomeMessage);
        isInitialized.current = true;
      }
    }
  }, [t, addWelcomeMessage, addTypingBotMessage, isLoading, schoolName, isEmbeddedEnvironment, isInitialDataReceived, greeting, messagesEndRef, isRequestedLearningOnboarding]);

  // greeting 정보가 업데이트되었을 때 처리
  useEffect(() => {
    // 이미 초기화되었고, greeting이 있고, 아직 greeting 처리가 안 된 경우
    // 단, 학습 온보딩 모달이 열려 있으면 greeting 표시하지 않음
    if (isInitialized.current && greeting?.main && !isGreetingProcessed.current && !isLearningOnboardingModalOpen) {
      isGreetingProcessed.current = true;

      // 기존에 표시된 QuickReply와 온보딩 숨기기
      setShowFigmaQuickReply(false);
      setShowOnboardingMessage(false);
      setShowGradeSelectionComponent(false);

      // greeting.main을 chat.greeting 뒤에 추가
      addTypingBotMessage(greeting.main);

      // greeting.sub가 있으면 나중에 표시하고 QuickReply는 그 후에
      if (greeting.sub) {
        setTimeout(() => {
          addTypingBotMessage(greeting.sub);
          // greeting.sub 타이핑 완료 후 QuickReply 표시
          setTimeout(() => {
            setShowFigmaQuickReply(true);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 1500);
        }, 1500);
      } else {
        // greeting.sub가 없으면 greeting.main 타이핑 완료 후 QuickReply 표시
        setTimeout(() => {
          setShowFigmaQuickReply(true);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 1500);
      }
    }
  }, [greeting, addTypingBotMessage, messagesEndRef, isLearningOnboardingModalOpen]);

  // 카테고리 API 호출 (FAQ가 활성화된 경우에만)
  useEffect(() => {
    if (faqEnabled && isCategoryApiEnabled() && clientId) {
      setCategoriesLoading(true);
      getCategories(clientId, true)
        .then(response => {
          if (response && response.items) {
            const convertedCategories: FAQCategoryItem[] = response.items
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map(item => ({
                id: item.categoryId,
                textKey: '',
                valueKey: item.categoryId,
                displayName: item.categoryName,
                // API 응답의 icon 객체를 그대로 전달
                icon: item.icon
              }));
            setApiCategories(convertedCategories);
          }
        })
        .catch(error => {
          console.error('Failed to load categories:', error);
        })
        .finally(() => {
          setCategoriesLoading(false);
        });
    }
  }, [faqEnabled, clientId]);

  useEffect(() => {
    if (isAttributesApiEnabled() && clientId) {
      setGradesLoading(true);
      getAttributes(clientId, 'grade', true)
        .then(response => {
          if (response && response.items) {
            setApiGrades(response.items);
          }
        })
        .catch(error => {
          console.error('Failed to load grade attributes:', error);
        })
        .finally(() => {
          setGradesLoading(false);
        });
    }
  }, [clientId]);

  // 최신 LLM 응답 메시지 ID 업데이트
  useEffect(() => {
    const llmMessages = messages.filter(m => m.type === 'bot' && m.llmResponse);
    if (llmMessages.length > 0) {
      const latestLLMMessage = llmMessages[llmMessages.length - 1];
      // 새로운 LLM 메시지가 추가된 경우에만 상태 업데이트
      if (latestLLMMessage.id !== latestCTAMessageId) {
        setLatestCTAMessageId(latestLLMMessage.id);
        // 새로운 LLM 메시지가 추가되면 CTA 표시 재활성화
        setHideAllCTA(false);
      }
    }
  }, [messages, latestCTAMessageId]);

  const handleQuickReplyClick = async (text: string) => {
    setNewMessage(text);
    setShowFigmaQuickReply(false);
    
    await handleSendMessage(text);
  };


  // 온보딩 메시지가 표시된 후 GradeSelection 표시
  useEffect(() => {
    if (showOnboardingMessage) {
      // 내부생 앱의 경우 다른 메시지 사용
      const messageKey = isInboundApp(appId)
        ? 'onboarding.gradeSelectionMessageForInbound'
        : 'onboarding.gradeSelectionMessage';
      const onboardingMessage = t(messageKey);
      addTypingBotMessage(onboardingMessage);

      setTimeout(() => {
        setShowGradeSelectionComponent(true);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 1000);
    }
  }, [showOnboardingMessage, addTypingBotMessage, t, appId]);

  // 학년 선택 핸들러
  const handleGradeSelect = (grade: GradeType) => {
    setSelectedGrade(grade);
    setShowGradeSelectionComponent(false);
    
    // 선택한 학년을 사용자 메시지로 표시
    addUserMessage(GRADE_LABELS[grade], false);
    
    // 학년 확인 봇 메시지 추가
    setTimeout(() => {
      const confirmationMessage = `${GRADE_NAMES[grade]}ですね！どのようなことを知りたいですか？`;
      addTypingBotMessage(confirmationMessage);
      
      // 학년별 퀵 리플라이 표시
      setTimeout(() => {
        setShowFigmaQuickReply(true);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 1000);
    }, 500);
  };

  // もどる 버튼 핸들러
  const handleBackToGradeSelection = () => {
    setShowFigmaQuickReply(false);
    setSelectedGrade(null);
    
    // "もどる" 사용자 메시지 표시
    addUserMessage('もどる', false);
    
    // GradeSelection 다시 표시
    setTimeout(() => {
      setShowGradeSelectionComponent(true);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 500);
  };

  const handleShowFAQCategories = () => {
    const otherText = t('chat.quickReplies.other');
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    // 이전 FAQ 카테고리 비활성화
    deactivateComponent('faqCategories');
    
    // 유저 메시지 추가
    addUserMessage(otherText, false);
    setShowFigmaQuickReply(false);
    
    // 타이핑 봇 메시지 추가하고 메시지 ID로 FAQ 카테고리 활성화
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
      // 메시지 ID를 사용하여 FAQ 카테고리 활성화
      activateComponent('faqCategories', messageId);
    }, 100);
  };

  const handleFAQCategorySelect = (category: FAQCategoryItem) => {
    const categoryTitle = category.displayName || t(category.textKey);
    const categorySelectedMessage = t('chat.faq.categorySelected', { category: categoryTitle });
    
    // 이전 컴포넌트들 비활성화
    deactivateComponent('faqCategories');
    deactivateComponent('topQuestions');
    
    // 1. 유저 메시지로 선택한 카테고리 표시
    addUserMessage(categoryTitle, false);
    setShowFAQCategories(false);
    setSelectedCategory(category);
    
    // 2. 봇 메시지 타이핑 애니메이션으로 표시하고 메시지 ID로 TopQuestions 활성화
    setTimeout(() => {
      const messageId = addTypingBotMessage(categorySelectedMessage);
      // 메시지 ID를 사용하여 TopQuestions 활성화
      activateComponent('topQuestions', messageId);
    }, 100);
  };

  const handleTopQuestionSelect = async (question: string) => {
    // 4. 각 top 질문을 클릭하면 유저 메시지로 표시 후 LLM 송신
    deactivateComponent('topQuestions');
    setSelectedCategory(null);
    await handleSendMessage(question);
  };

  const handleBackToCategories = () => {
    // 5. 카테고리 선택으로 돌아가기 클릭하면 유저 메시지로 표시 후 카테고리 재표시
    const backText = t('chat.faq.backToCategories');
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    // 이전 컴포넌트들 비활성화
    deactivateComponent('topQuestions');
    deactivateComponent('faqCategories');
    
    addUserMessage(backText, false);
    setSelectedCategory(null);
    
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
      // 새로운 메시지 ID로 FAQ 카테고리 활성화
      activateComponent('faqCategories', messageId);
    }, 100);
  };

  const handleTopQuestionsDataLoaded = () => {
    // TopQuestions 데이터가 로드되고 렌더링이 완료된 후 스크롤
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleSendClick = async () => {
    // 첨부된 파일이 있고 업로드가 완료된 경우
    if (attachedFile && !attachedFile.loading) {
      const imageUrl = attachedFile.previewUrl || attachedFile.preview;
      // FileInfo 객체 구성
      const fileInfo: FileInfo | undefined = attachedFile.fileId && attachedFile.s3Key && attachedFile.s3Uri && attachedFile.previewUrl
        ? {
            fileId: attachedFile.fileId,
            fileName: attachedFile.file.name,
            s3Key: attachedFile.s3Key,
            s3Uri: attachedFile.s3Uri,
            previewUrl: attachedFile.previewUrl
          }
        : undefined;

      await handleSendMessage(undefined, imageUrl, fileInfo, () => {
        // 메시지 입력창 초기화와 동일한 타이밍에 첨부 파일 삭제
        setAttachedFile(null);
      });
    } else {
      await handleSendMessage(undefined, undefined, undefined, () => {
        // 첨부 파일이 있으면 삭제 (업로드 중인 파일 등)
        if (attachedFile) {
          setAttachedFile(null);
        }
      });
    }
  };

  const handleFileAttach = (file: AttachedFile) => {
    setAttachedFile(file);
  };

  const handleFileRemove = () => {
    setAttachedFile(null);
  };

  // CTA 버튼 클릭 핸들러
  const handleMainCTAClick = () => {
    console.log('Main CTA clicked: 資料請求する');
    // 메인 CTA는 이미 CTAButtons 컴포넌트에서 외부 링크로 처리됨
  };

  const handleSubCTAClick = () => {
    // 즉시 모든 CTA 숨기기
    setHideAllCTA(true);
    
    // 이전 FAQ 카테고리 비활성화
    deactivateComponent('faqCategories');
    
    // CTA 서브 버튼용 FAQ 카테고리 표시 (유저 메시지는 "もう少し質問する"로)
    const subCTAText = 'もう少し質問する';
    const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
    
    // 유저 메시지 추가
    addUserMessage(subCTAText, false);
    
    // 타이핑 봇 메시지 추가하고 메시지 ID로 FAQ 카테고리 활성화
    setTimeout(() => {
      setWaitingForFAQCategories(true);
      const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
      activateComponent('faqCategories', messageId);
    }, 100);
  };

  // CTA 표시 완료 후 스크롤 핸들러
  const handleCTADisplayed = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
    
    // 음성 입력 처리
    if (item.action === 'voice-input') {
      setIsVoiceModalOpen(true);
      return;
    }
    
    // 외부 링크 처리
    if (item.action === 'external-link' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // FAQ 메뉴 클릭 시 처리 (FAQ가 활성화된 경우에만)
    if (item.id === 'ai-faq' && faqEnabled && !item.disabled) {
      // 이전 FAQ 카테고리 비활성화
      deactivateComponent('faqCategories');
      
      // 1. 유저 메시지로 라벨 표시
      addUserMessage(item.label, false);
      
      // 2. FAQ 카테고리를 위한 봇 메시지 타이핑
      setTimeout(() => {
        const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
        setWaitingForFAQCategories(true);
        const messageId = addTypingBotMessage(whatWouldYouLikeToKnow);
        activateComponent('faqCategories', messageId);
      }, 100);
    }
    // FAQ가 비활성화된 경우 메뉴 클릭 무시
    else if (item.id === 'ai-faq' && (!faqEnabled || item.disabled)) {
      console.log('FAQ menu is disabled for this app');
      return;
    }
    // 다른 메뉴 아이템들 처리
    else if (item.action === 'navigate' && item.url) {
      // 네비게이션 액션 처리 (추후 구현)
      console.log('Navigate to:', item.url);
    }
  };
  
  // 학습 정보 온보딩 모달 완료 핸들러
  const handleLearningOnboardingComplete = () => {
    console.log('Learning onboarding completed');
    isLearningOnboardingCompleted.current = true;
    setIsLearningOnboardingModalOpen(false);

    // 온보딩 완료 후 greeting 표시
    if (greeting?.main) {
      // greeting.main이 있으면 greeting만 표시
      addWelcomeMessage(greeting.main);
      isGreetingProcessed.current = true;

      if (greeting.sub) {
        setTimeout(() => {
          addTypingBotMessage(greeting.sub);
          setTimeout(() => {
            setShowFigmaQuickReply(true);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 1500);
        }, 1500);
      } else {
        setTimeout(() => {
          setShowFigmaQuickReply(true);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 1500);
      }
    } else {
      // greeting이 없으면 chat.greeting 표시 후 기존 온보딩/QuickReply 로직
      const welcomeMessage = t('chat.greeting').replace('{school_name}', schoolName);
      addWelcomeMessage(welcomeMessage);
      isGreetingProcessed.current = true;

      // chat.greeting 표시 후 온보딩 또는 QuickReply 처리
      setTimeout(() => {
        if (showGradeSelection) {
          // 학년 선택이 활성화된 경우: 온보딩 메시지 표시
          setShowOnboardingMessage(true);
        } else {
          // 학년 선택이 비활성화된 경우: 기본 QuickReply 표시
          setShowFigmaQuickReply(true);
        }
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 500);
    }
  };

  // 학습 정보 온보딩 모달 닫기 핸들러
  const handleLearningOnboardingClose = () => {
    console.log('Learning onboarding closed');
    setIsLearningOnboardingModalOpen(false);
    isLearningOnboardingCompleted.current = true; // 닫기도 완료로 처리

    // 모달을 닫아도 greeting은 표시
    if (greeting?.main && !isGreetingProcessed.current) {
      // greeting.main이 있으면 greeting만 표시
      addWelcomeMessage(greeting.main);
      isGreetingProcessed.current = true;

      if (greeting.sub) {
        setTimeout(() => {
          addTypingBotMessage(greeting.sub);
          setTimeout(() => {
            setShowFigmaQuickReply(true);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 1500);
        }, 1500);
      } else {
        setTimeout(() => {
          setShowFigmaQuickReply(true);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 1500);
      }
    } else if (!isGreetingProcessed.current) {
      // greeting이 없으면 chat.greeting 표시 후 기존 온보딩/QuickReply 로직
      const welcomeMessage = t('chat.greeting').replace('{school_name}', schoolName);
      addWelcomeMessage(welcomeMessage);
      isGreetingProcessed.current = true;

      // chat.greeting 표시 후 온보딩 또는 QuickReply 처리
      setTimeout(() => {
        if (showGradeSelection) {
          setShowOnboardingMessage(true);
        } else {
          setShowFigmaQuickReply(true);
        }
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 500);
    }
  };

  // 음성 입력 완료 핸들러
  const handleVoiceTranscript = (transcript: string) => {
    // 음성 입력 텍스트를 채팅 메시지로 전송
    setNewMessage(transcript);
    setTimeout(() => {
      handleSendClick();
    }, 100);
  };
  
  // 음성 대화 업데이트 핸들러
  const handleVoiceChatUpdate = (userMessage: string, botResponse: string, llmResponse?: any) => {
    // 사용자 메시지 추가
    addUserMessage(userMessage, false);
    
    // AI 응답 추가 - LLMResponse를 직접 messages에 추가
    if (llmResponse) {
      // LLMResponse가 있는 경우 직접 메시지로 추가
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: '', // LLMResponseGroup이 렌더링하므로 content는 비움
        timestamp: new Date(),
        llmResponse: llmResponse // 전달받은 LLMResponse를 그대로 사용
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // 스크롤 처리
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // LLM 응답이 없는 경우 일반 텍스트로 추가
      const messageId = addTypingBotMessage(botResponse, false);
      completeTyping();
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-navi-orange-main" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* iOS Viewport Debug - 개발용 (배포 시 제거) */}
      <IOSViewportDebug enabled={process.env.NODE_ENV === 'development'} />
      
      <ChatLayout
        showNavigationHeader={showNavigationHeader}
        header={
          <NavigationHeader 
            title={`${clientName}CS AI Navi`} 
            accentColor={accentColor}
            showDynamicHeader={true}
            clientId={clientId}
            clientName={clientName}
            schoolName={schoolName}
            onHeaderAction={(action: any) => {
              if (action.type === 'close') {
                console.log('Header close action triggered');
              }
            }}
          />
        }
        input={
          <ChatInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendClick}
            disabled={isTyping || (showGradeSelection && !selectedGrade && !greeting)}
            clientId={clientId}
            appId={appId}
            placeholder={
              showGradeSelection && !selectedGrade && !greeting
                ? 'まずは学年を選択してください'
                : undefined
            }
            onMenuItemClick={handleMenuItemClick}
            attachedFile={attachedFile}
            onFileAttach={handleFileAttach}
            onFileRemove={handleFileRemove}
            isEnableLearningNavi={isEnableLearningNavi}
          />
        }
      >
      <div 
        ref={chatContainerRef}
        className="h-full overflow-y-auto pb-4"
        data-testid="chat-container"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4" data-testid="messages-container">
          {messages.map((message, index) => {
            // 첫 번째 봇 메시지인지 확인
            const firstBotMessageIndex = messages.findIndex(m => m.type === 'bot');
            const isFirstBotMessage = message.type === 'bot' && index === firstBotMessageIndex;
            
            
            return (
              <div key={message.id}>
                <ChatMessage 
                  message={message} 
                  hideAvatar={message.type === 'bot' && !isFirstBotMessage}
                  llmResponse={message.llmResponse}
                  clientId={clientId}
                  // 최신 LLM 응답에서만 CTA 버튼 표시 (내부생 앱에서는 표시하지 않음)
                  {...(message.llmResponse ? {
                    showCTAAfterComplete: message.id === latestCTAMessageId && !hideAllCTA && !isInboundApp(appId),
                    onMainCTAClick: handleMainCTAClick,
                    onSubCTAClick: handleSubCTAClick,
                    onCTADisplayed: handleCTADisplayed
                  } : {})}
                />
              
              {/* 온보딩 메시지 다음에 GradeSelection 표시 (최초) - greeting이 있으면 표시하지 않음 */}
              {index === 1 && message.type === 'bot' && showGradeSelectionComponent && showGradeSelection &&
               !greeting && !messages.some(msg => msg.content === 'もどる') && (
                <div className="mt-4">
                  <GradeSelection
                    onGradeSelect={handleGradeSelect}
                    clientId={clientId}
                    apiGrades={apiGrades}
                    isLoading={gradesLoading}
                  />
                </div>
              )}
              
              {/* もどる 버튼 클릭 후 GradeSelection 표시 (가장 마지막 もどる 메시지에만) */}
              {message.type === 'user' && message.content === 'もどる' && showGradeSelectionComponent && 
               index === messages.length - 1 && (
                <div className="mt-4">
                  <GradeSelection 
                    onGradeSelect={handleGradeSelect}
                    clientId={clientId}
                    apiGrades={apiGrades}
                    isLoading={gradesLoading}
                  />
                </div>
              )}
              
              {/* 온보딩이 비활성화된 경우 또는 greeting이 있는 경우 기본 QuickReply 표시 */}
              {/* chat.greeting(index=0) → greeting.main(index=1) → greeting.sub(index=2) 순서 */}
              {/* QuickReply는 마지막 greeting 메시지 다음에 표시 */}
              {(() => {
                const quickReplyIndex = greeting
                  ? (greeting.sub ? 2 : 1)  // greeting 있음: sub 있으면 index=2, 없으면 index=1
                  : 0;                       // greeting 없음: index=0
                return index === quickReplyIndex &&
                  message.type === 'bot' &&
                  showFigmaQuickReply &&
                  (!showGradeSelection || greeting);
              })() && (
                <div className="mt-4">
                  <QuickReply
                    onReplyClick={handleQuickReplyClick}
                    onShowFAQCategories={handleShowFAQCategories}
                    show={true}
                    userId={userId}
                    clientId={clientId}
                    appId={appId}
                  />
                </div>
              )}
              
              {/* 학년 확인 메시지 후 학년별 QuickReply 표시 (가장 마지막 확인 메시지에서만) */}
              {message.type === 'bot' && showFigmaQuickReply && selectedGrade && 
               message.content && typeof message.content === 'string' && (message.content.includes('ですね！どのようなことを知りたいですか？')) && 
               (() => {
                 // 학년 확인 메시지들을 찾아서 현재 메시지가 가장 마지막인지 확인
                 const confirmationMessages = messages.filter(msg => 
                   msg.type === 'bot' && msg.content && typeof msg.content === 'string' && 
                   msg.content.includes('ですね！どのようなことを知りたいですか？')
                 );
                 const lastConfirmationIndex = messages.lastIndexOf(confirmationMessages[confirmationMessages.length - 1]);
                 return index === lastConfirmationIndex;
               })() && (
                <div className="mt-4">
                  <GradeQuickReply
                    grade={selectedGrade}
                    onReplyClick={handleQuickReplyClick}
                    onShowFAQCategories={handleShowFAQCategories}
                    onBackClick={handleBackToGradeSelection}
                    clientId={clientId}
                    appId={appId}
                  />
                </div>
              )}
              {/* FAQ 카테고리를 해당 메시지 ID에서만 표시 */}
              {isComponentActive('faqCategories', message.id) && showFAQCategories && (
                <div className="mt-4">
                  <FAQCategory 
                    categories={apiCategories || undefined}
                    onCategorySelect={handleFAQCategorySelect}
                  />
                </div>
              )}
              {/* Top 질문을 메시지 ID 기반으로 표시 */}
              {selectedCategory && isComponentActive('topQuestions', message.id) && (
                <div className="mt-4">
                  <TopQuestions
                    categoryId={selectedCategory.valueKey || selectedCategory.id}
                    categoryTitle={selectedCategory.displayName || t(selectedCategory.textKey)}
                    grade={selectedGrade || 'high'}
                    onQuestionSelect={handleTopQuestionSelect}
                    onBackToCategories={handleBackToCategories}
                    userId="Hyunse0001"
                    onDataLoaded={handleTopQuestionsDataLoaded}
                    clientId={clientId}
                  />
                </div>
              )}
              </div>
            );
          })}
          
          {currentlyTyping && (
            <ChatMessage
              message={{
                id: 'typing',
                type: 'bot',
                content: currentlyTyping.message,
                timestamp: new Date()
              }}
              isTyping={true}
              onTypingComplete={completeTyping}
              hideAvatar={messages.some(m => m.type === 'bot')}
              llmResponse={currentlyTyping.llmResponse}
              enableLLMTyping={true}
              clientId={clientId}
            />
          )}
          
          {isTyping && !currentlyTyping && (
            <TypingIndicator accentColor={accentColor} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      </ChatLayout>
      
      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscript={handleVoiceTranscript}
        onChatUpdate={handleVoiceChatUpdate}
        userId="Hyunse0001"
      />

      {/* Learning Onboarding Modal */}
      <OnboardingModal
        isOpen={isLearningOnboardingModalOpen}
        onClose={handleLearningOnboardingClose}
        onComplete={handleLearningOnboardingComplete}
        accentColor={accentColor}
        userId={userId}
      />
    </>
  );
}

export default MainPage;