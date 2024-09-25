// src/app/layout.tsx
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';

// 网站的元信息，用于SEO优化
export const metadata = {
  title: 'AmyAlmond_bot - AI Chatbot | AI聊天机器人',
  description:
      'AmyAlmond_bot - An advanced AI chatbot with long-term memory, personalized interaction, real-time control, and multi-platform support. AI聊天机器人，具有长期记忆和个性化互动功能，支持多平台运行。',
  keywords: [
    'AI Chatbot', 'AI聊天机器人', 'Personalized AI Conversations', '个性化对话',
    'Long-term Memory AI', '长期记忆AI', 'Real-time Control AI Assistant',
    'AI助手实时控制', 'Multi-platform AI', '多平台支持', 'Hot-Update Bot',
    '热更新机器人', 'GPT Voice AI', 'GPT语音系统', 'QQ机器人', 'Telegram Bot',
    'Discord Bot', 'Chatbot', 'LuoXiaohei', '洛小黑', 'AI', 'ChatGPT-like',
    'ChatGPT-like AI', 'AI-powered chatbot', 'ChatGPT-like AI chatbot',
    'QQ', 'Telegram', 'Discord', 'Twitter Bot', 'Bilibili Bot', 'twith', '推特', 'GPT-Sovits'
  ],
  openGraph: {
    title: 'AmyAlmond_bot - AI Chatbot | AI聊天机器人',
    description: 'An advanced AI chatbot with long-term memory, personalized interaction, real-time control, and multi-platform support.',
    url: 'https://bot.luoxiaohei.cn/',
    siteName: 'AmyAlmond_bot',
    images: [
      {
        url: 'https://bot.luoxiaohei.cn/icon.png',
        width: 800,
        height: 600,
        alt: 'AmyAlmond_bot Icon',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  }
};

// 根布局组件
export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="zh">
      <head>
        {/* Meta Tags for SEO */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI聊天机器人，具有长期记忆和个性化互动功能，支持多平台运行。" />
        <meta name="keywords" content="AI Chatbot, AI聊天机器人, Personalized AI Conversations, 个性化对话, Long-term Memory AI, 长期记忆AI, Real-time Control AI Assistant, AI助手实时控制, Multi-platform AI, 多平台支持, Hot-Update Bot, 热更新机器人, GPT Voice AI, GPT语音系统, QQ机器人, Telegram Bot, Discord Bot, Chatbot, LuoXiaohei, 洛小黑, AI, ChatGPT-like, ChatGPT-like AI, AI-powered chatbot, ChatGPT-like AI chatbot, QQ, Telegram, Discord, Twitter Bot, Bilibili Bot, twith, 推特, 语音系统" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
      <body>
        {/* 网站分析工具 */}
        <Analytics />
        {children}
      </body>
      </ThemeProvider>
      </html>
  );
}
