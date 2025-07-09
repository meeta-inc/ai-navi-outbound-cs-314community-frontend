// Atomic Design Components
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';

// Legacy exports for backward compatibility
export { Icon as DynamicIcon } from './atoms/Icon';
export { TypewriterText as default } from './atoms/Typography';
export { ChatMessage as default } from './organisms/ChatMessage';
export { ChatInput as default } from './organisms/ChatInput';
export { FAQCategory as default } from './organisms/FAQCategory';
export { QuickReply as default } from './organisms/QuickReply';
export { TopQuestions as default } from './organisms/TopQuestions';