import type { Meta, StoryObj } from '@storybook/react';
import { TypingIndicator } from './TypingIndicator';

const meta: Meta<typeof TypingIndicator> = {
  title: 'Molecules/TypingIndicator',
  component: TypingIndicator,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    accentColor: {
      control: { type: 'select' },
      options: ['orange', 'blue', 'green', 'purple', 'red'],
    },
    showLoader: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TypingIndicator>;

export const Default: Story = {
  args: {
    accentColor: 'orange',
    showLoader: true,
  },
};

export const WithoutLoader: Story = {
  args: {
    accentColor: 'orange',
    showLoader: false,
  },
};

export const BlueTheme: Story = {
  args: {
    accentColor: 'blue',
    showLoader: true,
  },
};

export const GreenTheme: Story = {
  args: {
    accentColor: 'green',
    showLoader: true,
  },
};