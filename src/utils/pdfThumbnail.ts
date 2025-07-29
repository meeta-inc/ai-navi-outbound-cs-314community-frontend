import * as pdfjsLib from 'pdfjs-dist';

// PDF.js worker 설정 - 로컬 파일 사용하여 CORS 문제 해결
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
}

interface ThumbnailOptions {
  scale?: number;
  width?: number;
  height?: number;
}

/**
 * PDF 파일의 첫 페이지 썸네일을 생성합니다.
 * @param pdfUrl PDF 파일 URL
 * @param options 썸네일 옵션
 * @returns Base64 인코딩된 이미지 데이터 URL
 */
export async function generatePDFThumbnail(
  pdfUrl: string, 
  options: ThumbnailOptions = {}
): Promise<string> {
  const { scale = 0.5, width = 165, height = 96 } = options;

  try {
    console.log('PDF 썸네일 생성 시작:', pdfUrl);
    
    // PDF 문서 로드 - 로컬 worker 사용으로 CORS 문제 해결
    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: '/pdfjs/cmaps/',
      cMapPacked: true,
      disableAutoFetch: false,
      disableStream: true,
      disableRange: true,
    });
    console.log('PDF 로딩 시도:', pdfUrl);

    const pdf = await loadingTask.promise;
    console.log('PDF 로드 완료, 페이지 수:', pdf.numPages);
    
    const page = await pdf.getPage(1);
    console.log('첫 번째 페이지 로드 완료');

    // Canvas 생성
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context not available');
    }

    // 뷰포트 계산
    const viewport = page.getViewport({ scale });
    
    // 지정된 크기에 맞게 스케일 조정
    const scaleX = width / viewport.width;
    const scaleY = height / viewport.height;
    const finalScale = Math.min(scaleX, scaleY) * scale;
    
    const scaledViewport = page.getViewport({ scale: finalScale });
    
    canvas.width = width;
    canvas.height = height;

    // 중앙 정렬을 위한 오프셋 계산
    const offsetX = (width - scaledViewport.width) / 2;
    const offsetY = (height - scaledViewport.height) / 2;

    // 배경색 설정
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // PDF 페이지 렌더링
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
      transform: [1, 0, 0, 1, offsetX, offsetY],
    };

    await page.render(renderContext).promise;
    
    // 정리
    pdf.destroy();
    
    const result = canvas.toDataURL('image/jpeg', 0.8);
    console.log('PDF 썸네일 생성 완료, 크기:', result.length);
    
    return result;
  } catch (error) {
    console.error('PDF 썸네일 생성 실패:', error);
    console.error('에러 상세:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      pdfUrl
    });
    throw error;
  }
}

/**
 * PDF 썸네일을 캐싱하는 맵
 */
const thumbnailCache = new Map<string, string>();

/**
 * 캐싱된 PDF 썸네일을 가져옵니다.
 * @param pdfUrl PDF 파일 URL
 * @param options 썸네일 옵션
 * @returns Base64 인코딩된 이미지 데이터 URL
 */
export async function getCachedPDFThumbnail(
  pdfUrl: string,
  options: ThumbnailOptions = {}
): Promise<string> {
  const cacheKey = `${pdfUrl}_${JSON.stringify(options)}`;
  
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  const thumbnail = await generatePDFThumbnail(pdfUrl, options);
  thumbnailCache.set(cacheKey, thumbnail);
  
  return thumbnail;
}