import { generatePDFThumbnail, getCachedPDFThumbnail } from './pdfThumbnail';

// PDF.js 모킹
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  version: '3.0.0',
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      getPage: jest.fn(() => Promise.resolve({
        getViewport: jest.fn(({ scale }) => ({
          width: 200 * scale,
          height: 300 * scale,
        })),
        render: jest.fn(() => ({
          promise: Promise.resolve(),
        })),
      })),
      destroy: jest.fn(),
    }),
  })),
}));

// Canvas 모킹
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn(() => ({
    fillStyle: '',
    fillRect: jest.fn(),
  })),
  toDataURL: jest.fn(() => 'data:image/jpeg;base64,mocked-canvas-data'),
};

Object.defineProperty(document, 'createElement', {
  value: jest.fn((tagName) => {
    if (tagName === 'canvas') {
      return mockCanvas;
    }
    return {};
  }),
});

describe('pdfThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePDFThumbnail', () => {
    const testPdfUrl = 'https://example.com/test.pdf';

    it('PDF 썸네일을 성공적으로 생성한다', async () => {
      const result = await generatePDFThumbnail(testPdfUrl);
      
      expect(result).toBe('data:image/jpeg;base64,mocked-canvas-data');
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
    });

    it('커스텀 옵션으로 썸네일을 생성한다', async () => {
      const options = { scale: 1.0, width: 300, height: 200 };
      
      const result = await generatePDFThumbnail(testPdfUrl, options);
      
      expect(result).toBe('data:image/jpeg;base64,mocked-canvas-data');
      expect(mockCanvas.width).toBe(300);
      expect(mockCanvas.height).toBe(200);
    });

    it('PDF 로드 실패 시 에러를 던진다', async () => {
      const pdfjsLib = require('pdfjs-dist');
      pdfjsLib.getDocument.mockReturnValueOnce({
        promise: Promise.reject(new Error('PDF 로드 실패')),
      });

      await expect(generatePDFThumbnail(testPdfUrl)).rejects.toThrow('PDF 로드 실패');
    });

    it('Canvas context가 없을 때 에러를 던진다', async () => {
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = jest.fn(() => null);

      await expect(generatePDFThumbnail(testPdfUrl)).rejects.toThrow('Canvas context not available');
      
      // 복원
      mockCanvas.getContext = originalGetContext;
    });
  });

  describe('getCachedPDFThumbnail', () => {
    const testPdfUrl = 'https://example.com/test.pdf';

    it('첫 번째 호출에서 썸네일을 생성하고 캐시한다', async () => {
      const result1 = await getCachedPDFThumbnail(testPdfUrl);
      const result2 = await getCachedPDFThumbnail(testPdfUrl);
      
      expect(result1).toBe('data:image/jpeg;base64,mocked-canvas-data');
      expect(result2).toBe('data:image/jpeg;base64,mocked-canvas-data');
      
      // generatePDFThumbnail은 한 번만 호출되어야 함 (캐시 동작 확인)
      expect(mockCanvas.toDataURL).toHaveBeenCalledTimes(1);
    });

    it('다른 옵션으로 호출하면 별도 캐시를 생성한다', async () => {
      const options1 = { scale: 0.5 };
      const options2 = { scale: 1.0 };
      
      const result1 = await getCachedPDFThumbnail(testPdfUrl, options1);
      const result2 = await getCachedPDFThumbnail(testPdfUrl, options2);
      
      expect(result1).toBe('data:image/jpeg;base64,mocked-canvas-data');
      expect(result2).toBe('data:image/jpeg;base64,mocked-canvas-data');
      
      // 다른 옵션이므로 두 번 호출되어야 함
      expect(mockCanvas.toDataURL).toHaveBeenCalledTimes(2);
    });
  });
});