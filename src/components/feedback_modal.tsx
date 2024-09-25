import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 支持被调用打开
export default function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative w-full max-w-md overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-100 dark:from-blue-700 dark:via-blue-800 dark:to-gray-900 opacity-30"
                                style={{
                                    transform: 'skewY(-6deg) translateY(-60%)',
                                    filter: 'blur(40px)',
                                }}
                            ></div>
                            <div className="relative p-6">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition duration-300 ease-in-out"
                                >
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close</span>
                                </button>
                                <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">您的反馈很重要</h2>
                                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                                    我们很抱歉没能满足您的期望。请通过 GitHub Issues 提交您的反馈，以便我们能够提供更好的服务。
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        onClick={onClose}
                                        variant="outline"
                                        className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 ease-in-out"
                                    >
                                        取消
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.open('https://github.com/shuakami/bot_plugins/issues/new', '_blank');
                                            onClose();
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition duration-300 ease-in-out"
                                    >
                                        前往 GitHub 提交反馈
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
