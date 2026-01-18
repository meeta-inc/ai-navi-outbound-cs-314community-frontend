// 파일 업로드 API 타입 정의

/**
 * 파일 정보
 */
export interface FileInfo {
  fileId: string;
  fileName: string;
  s3Key: string;
  s3Uri: string;
  previewUrl: string;
}

/**
 * 파일 업로드 응답
 */
export interface FileUploadResponse {
  fileInfo: FileInfo;
  timestamp: string;
  traceId: string;
}

/**
 * 파일 업로드 에러 응답
 */
export interface FileUploadErrorResponse {
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
  traceId: string;
}
