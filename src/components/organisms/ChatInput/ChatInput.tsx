import React, { useState, useEffect, useRef } from 'react';
import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';
import { SendIcon, CategoryIcon, ImageIcon } from '../../../assets/icons';
import { useLocale } from '../../../contexts/LocaleContext';
import { Button } from '../../atoms/Button';
import { InputField, AttachedFile } from '../../molecules/InputField';
import { MenuModal } from '../MenuModal';
import { MenuService } from '../../../services/menuService';
import { useKeyboardState } from '../../../hooks/useKeyboardState';
import { isIOS } from '../../../utils/device';
import type { MenuConfig, MenuItem } from '../../../shared/config/menuConfig';
import { generatePDFThumbnail } from '../../../utils/pdfThumbnail';
import { uploadFile, isUploadableFile, isFileSizeValid } from '../../../services/api/fileUpload';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  clientId?: string;
  appId?: string;
  onMenuItemClick?: (item: MenuItem) => void;
  attachedFile?: AttachedFile | null;
  onFileAttach?: (file: AttachedFile) => void;
  onFileRemove?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder,
  clientId = 'default',
  appId,
  onMenuItemClick,
  attachedFile,
  onFileAttach,
  onFileRemove
}: ChatInputProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메뉴 모달 상태 관리
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null);
  const isKeyboardOpen = useKeyboardState();

  // 고객사별 메뉴 설정 가져오기
  useEffect(() => {
    const config = MenuService.getMenuConfig(clientId, appId);
    setMenuConfig(config);
  }, [clientId, appId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // IME 변환 중일 때는 메시지 전송하지 않음
      if (e.nativeEvent.isComposing) {
        return;
      }
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleMenuClick = () => {
    // disabled 상태일 때는 메뉴 열기 방지
    if (disabled) {
      return;
    }
    
    // 키보드가 열려있으면 키보드가 닫힐 때까지 대기
    if (isKeyboardOpen) {
      // input에서 포커스 제거
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur();
      }
      
      // 키보드가 닫힌 후 메뉴 모달 열기
      setTimeout(() => {
        setIsMenuModalOpen(true);
      }, 300);
    } else {
      setIsMenuModalOpen(true);
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    setIsMenuModalOpen(false);
  };

  const handleAttachClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileAttach) return;

    // 파일 타입 검증
    if (!isUploadableFile(file)) {
      alert('PNG、JPEG、または PDF ファイルのみ添付できます。');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 파일 크기 검증 (10MB)
    if (!isFileSizeValid(file, 10)) {
      alert('ファイルサイズは10MB以下にしてください。');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // 1. 미리보기 생성 및 로딩 상태로 설정
    if (
      fileType.startsWith('image/') &&
      (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg')
    ) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          // 미리보기와 함께 로딩 상태로 파일 첨부
          onFileAttach({
            file,
            preview: event.target.result as string,
            type: 'image',
            loading: true
          });

          // 2. 파일 업로드 API 호출
          try {
            const uploadResult = await uploadFile(file);

            // 3. 업로드 성공 - 로딩 상태 해제 및 파일 정보 업데이트
            onFileAttach({
              file,
              preview: event.target.result as string,
              type: 'image',
              loading: false,
              fileId: uploadResult.fileInfo.fileId,
              s3Key: uploadResult.fileInfo.s3Key,
              s3Uri: uploadResult.fileInfo.s3Uri,
              previewUrl: uploadResult.fileInfo.previewUrl
            });
          } catch (error) {
            // 4. 업로드 실패 - 에러 처리
            console.error('ファイルアップロードエラー:', error);
            const errorMessage = error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました。';
            alert(errorMessage);

            // 에러 팝업이 닫히면 파일 첨부 삭제
            if (onFileRemove) {
              onFileRemove();
            }
          }
        }
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        const thumbnail = await generatePDFThumbnail(file);

        // 미리보기와 함께 로딩 상태로 파일 첨부
        onFileAttach({
          file,
          preview: thumbnail,
          type: 'pdf',
          loading: true
        });

        // 파일 업로드 API 호출
        try {
          const uploadResult = await uploadFile(file);

          // 업로드 성공 - 로딩 상태 해제 및 파일 정보 업데이트
          onFileAttach({
            file,
            preview: thumbnail,
            type: 'pdf',
            loading: false,
            fileId: uploadResult.fileInfo.fileId,
            s3Key: uploadResult.fileInfo.s3Key,
            s3Uri: uploadResult.fileInfo.s3Uri,
            previewUrl: uploadResult.fileInfo.previewUrl
          });
        } catch (error) {
          // 업로드 실패 - 에러 처리
          console.error('ファイルアップロードエラー:', error);
          const errorMessage = error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました。';
          alert(errorMessage);

          // 에러 팝업이 닫히면 파일 첨부 삭제
          if (onFileRemove) {
            onFileRemove();
          }
        }
      } catch (error) {
        console.error('PDF サムネイル生成失敗:', error);
        alert('PDF ファイルの処理に失敗しました。');
      }
    }

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // iOS 전용 스타일 적용
  const containerStyle = isIOS() ? {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
    background: 'white',
    borderTop: '1px solid #e5e7eb'
  } : {
    paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
  };

  return (
    <div
      className={`w-full bg-white flex justify-center items-end px-2 sm:px-4 py-4 gap-2 sm:gap-3 ${
        isIOS() ? 'ios-chat-input-fixed transform-gpu will-change-transform' : ''
      }`}
      style={containerStyle}>
      {/* Menu Button */}
      <Button
        onClick={handleMenuClick}
        disabled={disabled}
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${
          disabled
            ? 'cursor-not-allowed'
            : `${colors.backgroundHover} hover:text-white group`
        }`}
        aria-label="メニュー"
      >
        <CategoryIcon className={`w-6 h-6 transition-colors ${
          disabled
            ? 'text-gray-400'
            : `${colors.textBlack} group-hover:text-white`
        }`} />
      </Button>

      {/* Attach File Button - AS00003 클라이언트 전용 */}
      {clientId === 'AS00003' && (
        <>
          <Button
            onClick={handleAttachClick}
            disabled={disabled}
            className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${
              disabled
                ? 'cursor-not-allowed'
                : `${colors.backgroundHover} hover:text-white group`
            }`}
            aria-label="ファイルを添付"
          >
            <ImageIcon className={`w-6 h-6 transition-colors ${
              disabled
                ? 'text-gray-400'
                : `${colors.textBlack} group-hover:text-white`
            }`} />
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="ファイル選択"
          />
        </>
      )}

      {/* Input Field */}
      <InputField
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        accentColor={accentColor}
        data-testid="chat-input"
        attachedFile={attachedFile}
        onRemoveAttachment={onFileRemove}
      />

      {/* Send Button */}
      <Button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${
          value.trim() && !disabled
            ? `${colors.backgroundHover} hover:text-white group`
            : 'cursor-not-allowed'
        }`}
        aria-label={t('student.chatbot.send')}
      >
        <SendIcon className={`w-7 h-7 transition-colors ${
          value.trim() && !disabled
            ? `${colors.text} group-hover:text-white`
            : 'text-gray-400'
        }`} />
      </Button>

      {/* Menu Modal */}
      {menuConfig && (
        <MenuModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          menuConfig={menuConfig}
          accentColor={accentColor}
          onMenuItemClick={handleMenuItemClick}
        />
      )}
    </div>
  );
}