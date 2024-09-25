// src/components/Meta.tsx

import Head from 'next/head';

interface MetaProps {
    pageName?: string;
}

const Meta = ({ pageName }: MetaProps) => {
    // 自动生成标题，默认使用页面名称，如果没有提供页面名称则使用默认标题
    const title = pageName ? `${pageName} | AmyAlmond_bot - Dashboard` : 'AmyAlmond_bot - AI Chatbot | Dashboard';
    const description =
        'AmyAlmond_bot - An advanced AI chatbot with long-term memory, personalized interaction, real-time control, and multi-platform support.';
    const keywords =
        'AI Chatbot, AI聊天机器人, Personalized AI Conversations, 个性化对话, Long-term Memory AI, 长期记忆AI, Real-time Control AI Assistant, AI助手实时控制, Multi-platform AI, 多平台支持, Hot-Update Bot, 热更新机器人, GPT Voice AI, GPT语音系统, QQ机器人, Telegram Bot, Discord Bot, Chatbot, LuoXiaohei, 洛小黑, AI, ChatGPT-like, ChatGPT-like AI, AI-powered chatbot, ChatGPT-like AI chatbot, QQ, Telegram, Discord, Twitter Bot, Bilibili Bot, T台, 推特, GPT-Sovits';

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default Meta;
