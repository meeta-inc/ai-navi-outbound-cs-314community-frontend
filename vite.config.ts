import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    qrcode() // QR 코드 플러그인 추가
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    // HTTPS 설정 (iOS에서 마이크 사용 시 필요)
    // https: {
    //   key: fs.readFileSync('.cert/key.pem'),
    //   cert: fs.readFileSync('.cert/cert.pem'),
    // },
    proxy: {
      '/api': {
        target: 'https://coipekj2sl.execute-api.ap-northeast-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/dev'),
      },
    },
  },
});