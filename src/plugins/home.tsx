import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 动态确定文本颜色：根据图片的亮度来决定文本是黑色还是白色
const getTextColorBasedOnBackground = (hexColor: string) => {
    if (!hexColor) return 'text-white';
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? 'text-black' : 'text-white';
};

const IntegrationCard: React.FC<{
    name: string;
    description: string;
    price: string;
    avatar: string;
    pluginId: string;
}> = ({ name, description, price, avatar, pluginId }) => (
    <motion.div
        className="relative overflow-hidden rounded-lg shadow-sm border p-6 w-full h-72 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={() =>
            window.open(
                `/dashboard/plugins/info/${pluginId}?PluginName=${name}`,
                '_blank'
            )
        }
    >
        {/* 插件头像作为背景，亮度降低 */}
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage: `url(${avatar})`,
                filter: 'brightness(90%)',
            }}
        />
        {/* 文字放在背景上 */}
        <div className="relative z-10">
            <h3 className={`${getTextColorBasedOnBackground('#ffffff')} text-lg font-bold`}>
                {name}
            </h3>
            <p className={`${getTextColorBasedOnBackground('#ffffff')} text-sm mt-2`}>
                {description}
            </p>
        </div>
        {/* 卡片底部 */}
        <div className="absolute bottom-4 left-4">
            <p className={`${getTextColorBasedOnBackground('#ffffff')} text-sm`}>{price}</p>
        </div>
    </motion.div>
);

const PluginHero: React.FC = () => {
    const [plugins, setPlugins] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshCount, setRefreshCount] = useState<number>(0);
    const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

    const fetchPlugins = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/all_plugin?page=1');
            const data = await response.json();

            // 随机排列插件并限制显示数量为 6
            const shuffledPlugins = data.sort(() => Math.random() - 0.5).slice(0, 6);
            setPlugins(shuffledPlugins);
        } catch (error) {
            console.error('Error fetching plugins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        const currentTime = Date.now();
        if (refreshCount < 7 || currentTime - lastRefresh > 60000) {
            fetchPlugins();
            setRefreshCount((prev) => (currentTime - lastRefresh > 60000 ? 1 : prev + 1));
            setLastRefresh(currentTime);
        } else {
            alert('1分钟内最多刷新7次，请稍后再试！');
        }
    };

    useEffect(() => {
        fetchPlugins();
    }, []);

    return (
        <section className="p-8">
            <h2 className="text-xl font-bold mb-2">推荐插件</h2>
            <p className="text-[#666666] text-sm mb-4">
                这是一些插件推荐，帮助您快速上手。{' '}
                <button
                    onClick={handleRefresh}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                >
                    快速刷新
                </button>
            </p>
            {/* 使用grid布局 */}
            <AnimatePresence>
                {loading ? (
                    <motion.div
                        className="text-center text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }} // 添加过渡效果
                    >
                        加载中...
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }} // 添加过渡效果
                    >
                        {plugins.map((plugin) => (
                            <IntegrationCard
                                key={plugin.plugin_id}
                                name={plugin.name}
                                description={plugin.description || 'No description available'}
                                price={`Version: ${plugin.version}`}
                                avatar={plugin.avatar}
                                pluginId={plugin.plugin_id}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PluginHero;
