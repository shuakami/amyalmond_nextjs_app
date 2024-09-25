"use client"

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ChevronUp, PlugIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Plugin {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    lastUpdated: string;
    installed: boolean;
}

interface PluginSidebarProps {
    onPluginClick: (plugin: Plugin) => void;
}

export const PluginSidebar: React.FC<PluginSidebarProps> = ({ onPluginClick }) => {
    const [plugins, setPlugins] = React.useState<Plugin[]>([]);
    const [isChevronRight, setIsChevronRight] = React.useState(false);
    const [isCardVisible, setIsCardVisible] = React.useState(true);
    const [cardHeight, setCardHeight] = React.useState('auto');
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [cardOpacity, setCardOpacity] = React.useState(1);
    const [loading, setLoading] = React.useState(true); // Loading 状态

    const handlePluginClick = (plugin: Plugin) => {
        window.open(
            `/dashboard/plugins/info/${plugin.name}?local=true`,
            '_blank'
        );
    };

    React.useEffect(() => {
        fetchLocalPlugins();
    }, []);

    const fetchLocalPlugins = async () => {
        try {
            const response = await fetch('http://localhost:10417/plugins/list');
            if (!response.ok) throw new Error('Failed to fetch plugins');

            const data = await response.json();
            const fetchedPlugins = data.plugins.map((plugin: any, index: number) => ({
                id: plugin.plugin_id || `local-${index}`,
                name: plugin.name || '未知插件',
                description: plugin.description || 'No description available',
                version: plugin.version || '1.0.0',
                author: plugin.author || 'Unknown Author',
                lastUpdated: new Date().toLocaleDateString(),
                installed: true // 本地插件默认已安装
            }));

            setPlugins(fetchedPlugins);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plugins:', error);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (cardRef.current) {
            setCardHeight(`${cardRef.current.scrollHeight}px`);
        }
    }, [plugins]);

    const handleButtonClick = () => {
        setIsChevronRight(!isChevronRight);
        if (!isCardVisible) {
            setCardHeight(`${cardRef.current?.scrollHeight}px`);
            setTimeout(() => {
                setCardOpacity(1);
            }, 10);
        } else {
            setCardOpacity(0);
            setTimeout(() => {
                setCardHeight('0px');
            }, 0);
        }
        setIsCardVisible(!isCardVisible);
    };

    return (
        <div className="p-4 space-y-4">
            <Button
                variant="ghost"
                onClick={handleButtonClick}
                className="flex items-center justify-between w-full px-3 py-2 text-sm mb-4 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition duration-300"
            >
                <span>已装载的插件列表</span>
                <ChevronUp
                    className={`transition-transform ${
                        isChevronRight ? 'rotate-90' : 'rotate-0'
                    }`}
                    size={14}
                />
            </Button>

            <AnimatePresence initial={false}>
                {loading ? (
                    <div>加载中...</div> // 你可以根据需要自定义加载状态
                ) : (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: cardHeight, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card
                            ref={cardRef}
                            className={`border-none w-full rounded-lg overflow-hidden transition-all duration-700 ease-in-out`}
                            style={{ height: cardHeight, opacity: cardOpacity }}
                        >
                            <CardContent className="p-4 space-y-4">
                                {plugins.map((plugin) => {
                                    return (
                                        <motion.div
                                            key={plugin.id}
                                            onClick={() => handlePluginClick(plugin)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative cursor-pointer bg-gray-50 dark:bg-white/10 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition duration-300 group"
                                        >
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent dark:from-transparent dark:via-white/15 dark:to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>

                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <PlugIcon className="mr-2 h-5 w-5"/>
                                                    <h3 className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                                                        {plugin.name}
                                                    </h3>
                                                </div>
                                                <DotsHorizontalIcon className="h-5 w-5"/>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge
                                                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                                                    variant="outline"
                                                >
                                                    版本: {plugin.version}
                                                </Badge>
                                                <Badge
                                                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                                                    variant="outline"
                                                >
                                                    作者: {plugin.author}
                                                </Badge>
                                                <Badge
                                                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                                                    variant="outline"
                                                >
                                                    更新于: {plugin.lastUpdated}
                                                </Badge>
                                                <Badge
                                                    className="rounded-md px-2 py-0.5 text-xs font-medium border hover:border-green-400/45 hover:dark:border-green-500/45"
                                                    variant="outline"
                                                    style={{
                                                        color: 'rgb(16, 185, 129)',
                                                        backgroundColor: 'rgba(16, 185, 129, 0.13)',
                                                    }}
                                                >
                                                    已安装
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
