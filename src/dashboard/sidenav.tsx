'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Folder, PlusCircle, ThumbsDown, Book } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import FeedbackModal from '@/components/feedback_modal';
import { ModeToggle } from '@/components/mode-toggle';

export default function RobotSideNav() {
    // 打开feedback模态框
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleFeedbackClick = () => {
        setShowFeedbackModal(true);
    };

    const pathname = usePathname();

    const navItems = [
        { icon: Home, href: '/dashboard', label: '主页' },
        { icon: Grid, href: '/dashboard/plugins', label: '插件中心' },
        { icon: Folder, href: '/dashboard/plugins/my', label: '我的插件' },
        { icon: PlusCircle, href: '/dashboard/plugins/start', label: '制作插件' },
    ];

    return (
        <>
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
            <div className="flex flex-col justify-between items-center w-16 h-full min-h-screen py-4 px-0 border-r border-[#dddddd] dark:border-gray-800/85">
                <div className="flex flex-col items-center space-y-2.5">
                    <button className="mt-2 w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-6">
                        <span className="text-xl font-bold">🔥</span>
                    </button>
                    {navItems.map((item, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                                            pathname === item.href
                                                ? 'text-orange-500 bg-orange-100 dark:bg-transparent'
                                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        <item.icon size={20} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
                <div className="flex flex-col items-center space-y-2.5">
                    <button
                        onClick={handleFeedbackClick}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    >
                        <ThumbsDown size={20} />
                    </button>
                    <Link href={'/docs/plugin'} target="_blank">
                        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                            <Book size={20} />
                        </button>
                    </Link>
                    {/* 主题切换图标 */}
                    <ModeToggle />
                </div>
            </div>
        </>
    );
}
