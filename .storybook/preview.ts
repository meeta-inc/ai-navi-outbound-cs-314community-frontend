import type { Preview } from '@storybook/react-vite'
import '../src/index.css'; // Tailwind CSS 스타일 적용

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-visible',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;