import React from 'react'
import { motion } from 'framer-motion'

const lineVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1 }
}


export default function ErrorPage({ error }: { error?: string }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <motion.svg
                    className="w-48 h-48 mx-auto mb-8"
                    viewBox="0 0 100 100"
                    initial="hidden"
                    animate="visible"
                >
                    <motion.path
                        d="M20,50 L40,50 M60,50 L80,50"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        strokeLinecap="round"
                        variants={lineVariants}
                        transition={{duration: 1}}
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="8"
                        fill="#4B5563"
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        transition={{delay: 1, duration: 0.5}}
                    />
                </motion.svg>
                <motion.h2
                    className="text-3xl font-light text-gray-800 mb-4"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5}}
                >
                    插件信息不可用
                </motion.h2>
                <motion.p
                    className="text-gray-600 mb-8"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.7}}
                >
                    错误信息：{error || '未找到插件，请检查参数或插件是否存在。'}<br></br>如果您刚成功提交过插件，很可能是在审核中
                </motion.p>
                <div
                    className="absolute bottom-0 left-0 p-4 text-xs text-gray-600"
                >
                    <a href={`https://github.com/shuakami/bot_plugins/issues/new?labels=bug&title=[Bug]%20有Bug%20|%20${window.location.href}&body=${encodeURIComponent(`报错：${error || '未找到插件，请检查参数或插件是否存在。'}\n\n访问路径：${window.location.href}\n\nCookie：${document.cookie}\n\n设备信息：${navigator.userAgent}\n\n`)}`}
                       target="_blank" rel="noopener noreferrer">
                        反馈问题{' '}
                    </a>
                    | <a href="/dashboard/plugins/my?cookie=true" target="_blank"
                         rel="noopener noreferrer" className="text-black">
                    回到我的插件{' '}
                </a>
                </div>
            </div>
        </div>
    )
}