import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HyperText from '@/components/good_text';

interface NotificationProps {
    message: string;
    backgroundColor?: string;
    textColor?: string;
    onClose?: () => void;
}

const TopToast: React.FC<NotificationProps> = ({
                                                       message,
                                                       backgroundColor = '#3b86f6', // 默认蓝色背景
                                                       textColor = '#FFFFFF', // 默认白色文字
                                                       onClose,
                                                   }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ backgroundColor, color: textColor }}
                    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:h-10"
                >
                    <div className="container flex flex-col md:flex-row items-center justify-center gap-4">
                        <HyperText
                            text={message}
                            duration={1200}
                            className="text-xs md:text-sm"
                            animateOnLoad={false}
                        />
                        <button onClick={handleClose} className="ml-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TopToast;