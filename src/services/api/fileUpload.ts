import { getFileUploadApiUrl } from '../../shared/config/app.config';
import type { FileUploadResponse, FileUploadErrorResponse } from '../../types/api/fileUpload.types';

/**
 * 파일을 업로드합니다.
 *
 * @param file - 업로드할 파일 (이미지 등)
 * @returns 파일 업로드 응답 (파일 정보 포함)
 * @throws 업로드 실패 시 에러
 */
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const baseUrl = getFileUploadApiUrl();
  const url = `${baseUrl}/file/upload`;

  // FormData 생성
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      // Content-Type은 브라우저가 자동으로 설정 (multipart/form-data with boundary)
      body: formData,
    });

    if (!response.ok) {
      // 에러 응답 파싱
      const errorData: FileUploadErrorResponse = await response.json().catch(() => ({
        error: {
          code: 'UPLOAD_ERROR',
          message: `HTTP error! status: ${response.status}`,
        },
        timestamp: new Date().toISOString(),
        traceId: 'unknown',
      }));

      throw new Error(errorData.error.message || 'ファイルのアップロードに失敗しました。');
    }

    const data: FileUploadResponse = await response.json();
    return data;

  } catch (error) {
    console.error('ファイルアップロード中にエラーが発生しました:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('ファイルのアップロードに失敗しました。もう一度お試しください。');
  }
};

/**
 * 파일이 업로드 가능한 타입인지 확인합니다.
 *
 * @param file - 확인할 파일
 * @returns 업로드 가능 여부
 */
export const isUploadableFile = (file: File): boolean => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  return allowedTypes.includes(file.type);
};

/**
 * 파일 크기가 제한 내에 있는지 확인합니다.
 *
 * @param file - 확인할 파일
 * @param maxSizeMB - 최대 크기 (MB 단위, 기본값: 10MB)
 * @returns 크기 제한 내 여부
 */
export const isFileSizeValid = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
