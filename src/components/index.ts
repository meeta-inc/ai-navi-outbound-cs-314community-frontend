// Atomic Design Components
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';

// Legacy exports for backward compatibility
export { Icon as DynamicIcon } from './atoms/Icon';
export { TypewriterText } from './atoms/Typography';
export { ChatMessage } from './organisms/ChatMessage';
export { ChatInput } from './organisms/ChatInput';
export { FAQCategory } from './organisms/FAQCategory';
export { QuickReply } from './organisms/QuickReply';
export { TopQuestions } from './organisms/TopQuestions';

// Default exports (choose one main component as default if needed)
// export { TypewriterText as default } from './atoms/Typography';