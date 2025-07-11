import type { Preview } from '@storybook/react-vite'
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css'; // Tailwind CSS 스타일 적용
import { LocaleProvider } from '../src/contexts/LocaleContext';

const preview: Preview = {
  decorators: [
    (Story) => React.createElement(
      LocaleProvider, 
      {}, 
      React.createElement(
        MemoryRouter, 
        { initialEntries: ['/'] }, 
        React.createElement(Story)
      )
    ),
  ],
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
      disable: true,
    },
    options: {
      storySort: {
        order: [
          'Atoms',
          'Molecules', 
          'Organisms',
          'Templates',
          'Pages',
          '*'
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;