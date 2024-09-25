import React, { useEffect, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Plugin {
    pluginId: string;
    pluginName: string;
    pluginAuthor: string;
    pluginVersion: string;
    prNumber?: string;
    approved?: boolean;
    underReview?: boolean;
    rejected?: boolean;
    avatar?: string | null;
    zip?: string | null;
    isLocal?: boolean; // 本地插件标志
    description?: string; // 插件描述
}

// 从 Cookie 读取插件信息
const getPluginsFromCookies = (): Plugin[] => {
    const cookies = document.cookie.split('; ');
    const plugins = cookies
        .filter(cookie => cookie.startsWith('plugin_info_'))
        .map(cookie => {
            const pluginData = cookie.split('=')[1];
            try {
                return JSON.parse(decodeURIComponent(pluginData));
            } catch (e) {
                console.error('Failed to parse cookie data:', e);
                return null;
            }
        })
        .filter(Boolean) as Plugin[];
    return plugins;
};

// 固定 Emoji 和美学背景色搭配
const emojiBackgrounds: { [key: string]: string } = {
    '🌟': 'from-yellow-400 to-orange-500',
    '🚀': 'from-blue-500 to-indigo-500',
    '🎉': 'from-green-400 to-teal-500',
    '🔥': 'from-red-500 to-yellow-500',
    '✨': 'from-purple-400 to-pink-500',
    '🛠️': 'from-gray-400 to-gray-600',
    '📦': 'from-yellow-300 to-yellow-500',
    '📱': 'from-blue-300 to-blue-500',
    '🖥️': 'from-teal-400 to-green-500',
    '⚙️': 'from-purple-300 to-purple-600',
};

const getRandomEmojiAndBackground = () => {
    const emojis = Object.keys(emojiBackgrounds);
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    return { emoji: randomEmoji, background: emojiBackgrounds[randomEmoji] };
};

const MyPlugins: React.FC = () => {
    const [plugins, setPlugins] = useState<Plugin[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const [localError, setLocalError] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition(); // 使用 useTransition 来处理动画过渡

    // 获取本地插件信息
    const fetchLocalPlugins = async () => {
        try {
            const response = await fetch('http://localhost:10417/plugins/list');
            if (!response.ok) throw new Error('Failed to fetch local plugins');

            const data = await response.json();
            if (data.status === 'success') {
                const localPlugins = data.plugins.map((plugin: any) => ({
                    pluginId: plugin.plugin_id || '无ID',
                    pluginName: plugin.name,
                    pluginAuthor: plugin.author,
                    pluginVersion: plugin.version,
                    description: plugin.description,
                    approved: true,
                    isLocal: true,
                }));
                return localPlugins;
            }
        } catch (error) {
            console.error('Error fetching local plugins:', error);
            setLocalError(true);
        }
        return [];
    };

    // 获取插件详情信息
    const fetchPluginInfo = async () => {
        const storedPlugins = getPluginsFromCookies();
        setLoading(true);
        const localPlugins = await fetchLocalPlugins();

        const cloudPlugins = await Promise.all(
            storedPlugins.map(async (plugin) => {
                const response = await fetch(`/api/plugin_info?pr=${plugin.prNumber}&id=${plugin.pluginId}&name=${plugin.pluginName}`);
                const data = await response.json();
                return {
                    ...plugin,
                    ...data,
                };
            })
        );

        setPlugins([...localPlugins, ...cloudPlugins]);
        setLoading(false);
    };

    useEffect(() => {
        fetchPluginInfo();
        const intervalId = setInterval(() => {
            fetchPluginInfo();
        }, 30000); // 调整到30秒
        return () => clearInterval(intervalId);
    }, []);

    // 处理搜索和筛选
    const filteredPlugins = plugins.filter((plugin) => {
        const matchesSearch = plugin.pluginName.includes(searchTerm) || plugin.pluginAuthor.includes(searchTerm);
        const matchesFilter =
            filter === 'all' ||
            (filter === 'local' && plugin.isLocal) ||
            (filter === 'active' && plugin.approved) ||
            (filter === 'inactive' && !plugin.approved);
        return matchesSearch && matchesFilter;
    });

    // 构造插件链接
    const getPluginLink = (plugin: Plugin) => {
        if (plugin.isLocal) {
            return `/dashboard/plugins/info/${plugin.pluginName}?local=true`;
        } else {
            return `/dashboard/plugins/info/${plugin.pluginId}?PluginName=${plugin.pluginName}`;
        }
    };

    return (
        <TooltipProvider>
            <div className="w-full mx-auto p-6 px-12">
                {/* 搜索和筛选 */}
                <div className="flex space-x-2 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="搜索插件..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-md"
                        />
                    </div>
                    <Select onValueChange={(value) => setFilter(value)}>
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="全部安装的插件" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部插件</SelectItem>
                            <SelectItem value="local">本地插件</SelectItem>
                            <SelectItem value="active">通过审核的插件</SelectItem>
                            <SelectItem value="inactive">未通过审核的插件</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 插件列表 */}
                <motion.div
                    className="rounded-lg border border-[#666666]/10 dark:border-[#666666]/20 transition-all duration-300 ease-in-out"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {loading ? (
                        <div className="p-4 text-center animate-pulse">加载中...</div>
                    ) : filteredPlugins.length > 0 ? (
                        filteredPlugins.map((plugin) => {
                            const { emoji, background } = getRandomEmojiAndBackground();
                            return (
                                <motion.div
                                    key={plugin.pluginId}
                                    initial={{ opacity: 0, translateY: -10 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-between p-4 border-b"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-10 h-10 bg-gradient-to-r ${
                                                plugin.isLocal ? background : 'bg-green-500'
                                            } rounded-full flex items-center justify-center text-white text-xl font-bold`}
                                        >
                                            {plugin.isLocal ? (
                                                emoji
                                            ) : plugin.approved ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-6 w-6 text-white"
                                                >
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                                </svg>
                                            ) : (
                                                plugin.pluginName[0].toUpperCase()
                                            )}
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Link href={getPluginLink(plugin)}>
                                                    <h3 className="font-semibold text-sm cursor-pointer">
                                                        {plugin.pluginName}
                                                    </h3>
                                                </Link>
                                            </TooltipTrigger>
                                            {plugin.description && (
                                                <TooltipContent className="bg-white dark:bg-black/90 shadow-md border border-[#666666]/20 dark:border-white/20">
                                                    <p>{plugin.description}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                        <p className="text-sm text-gray-500 mt-1">{plugin.pluginAuthor}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center text-sm text-gray-500">
                                            {plugin.isLocal
                                                ? '本地已安装'
                                                : plugin.approved
                                                    ? '通过审核'
                                                    : plugin.underReview
                                                        ? '审核中'
                                                        : '未通过审核'}
                                        </div>
                                        <Link href={getPluginLink(plugin)}>
                                        <Button variant="outline" size="sm">
                                            管理
                                        </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : localError ? (
                        <div className="p-6 text-center text-gray-500">
                            <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-red-600 to-pink-200 bg-clip-text text-transparent">
                                无法连接到本地机器人
                            </h3>
                            <p className="mb-4">请确保本地机器人已启动，以访问本地安装的插件列表。</p>
                            <Button variant="outline" size="default">
                                重试连接
                            </Button>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-700 to-white bg-clip-text text-transparent">
                                未找到插件
                            </h3>
                            <p className="mb-4 mt-4">您还没有自己的插件/没有查找到插件，尝试先创建一个吧~</p>
                            <Button variant="outline" size="default">
                                <Link href="/dashboard/plugins/start">前往创建</Link>
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </TooltipProvider>
    );
};

export default MyPlugins;
