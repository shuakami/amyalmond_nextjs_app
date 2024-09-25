import React, {useEffect, useState} from 'react';
import {Bot, CheckSquare} from 'lucide-react';
import AiPluginModal from "@/components/plugins_modal"; // 引入模态框组件
import parseModelResponse from "@/components/parseModelResponse"; // 引入解析工具
import ValidationPanel from "@/plugins/add/ValidationPanel";
import PublishPluginsModal from "@/components/publish_plugins_modal";
import Link from "next/link";


export default function PluginStart() {
    const [showAIInput, setShowAIInput] = useState(false);
    const [pluginName, setPluginName] = useState('');
    const [pluginConfig, setPluginConfig] = useState('');
    const [pluginCode, setPluginCode] = useState('');
    const [pluginAuthor, setPluginAuthor] = useState('');
    const [pluginVersion, setPluginVersion] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isCompleteEnabled, setIsCompleteEnabled] = useState(false);



// 用于提取信息的正则表达式函数
    const extractFromConfig = (config: string, key: string) => {
        const regex = new RegExp(`${key}:\\s*["{']?([^\\n]+?)["}']?\\s*(?:$|\\n)`, 'm');
        const match = config.match(regex);
        return match ? match[1].trim() : '';
    };

// 当插件生成后调用此函数，解析大模型的输出
    const handlePluginGenerated = (response: string) => {
        const { plugin_code, plugin_config } = parseModelResponse(response);

        // 设置插件代码和配置
        setPluginCode(plugin_code);
        setPluginConfig(plugin_config);
    };

// 监听插件配置和代码的变化，每次更新尝试提取
    useEffect(() => {
        if (pluginConfig) {
            const extractedName = extractFromConfig(pluginConfig, 'plugin_name');
            const extractedAuthor = extractFromConfig(pluginConfig, 'author');
            const extractedVersion = extractFromConfig(pluginConfig, 'version');

            setPluginName(extractedName || pluginName);
            setPluginAuthor(extractedAuthor || pluginAuthor);
            setPluginVersion(extractedVersion || pluginVersion);

           console.log('Plugin Name:', pluginName);
           console.log('Plugin Author:', pluginAuthor);
           console.log('Plugin Version:', pluginVersion);
        }
    }, [pluginConfig, pluginCode]); // 每当 pluginConfig 或 pluginCode 变化时重新提取

// 监听插件相关信息的变化，确保所有字段都有值时才能启用“完成”按钮
    useEffect(() => {
        const allFieldsValid = [pluginCode, pluginConfig, pluginName, pluginAuthor, pluginVersion].every(field => field && field.trim() !== '');
        setIsCompleteEnabled(allFieldsValid);
    }, [pluginCode, pluginConfig, pluginName, pluginAuthor, pluginVersion]);

// 处理完成按钮点击事件
    const handleComplete = () => {
        setShowPublishModal(true);
    };


    const handleAIGenerate = () => {
        setShowAIInput(true);
        setTimeout(() => {
            setIsModalOpen(true);
        }, 300);
    };

    return (
        <div className="h-full flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8 flex">
                <div className="rounded-lg overflow-hidden flex-grow flex">
                    <div
                        className={`w-full ${showAIInput ? 'lg:w-1/2' : 'lg:w-full'} p-6 mt-4 transition-all duration-300`}>
                        <h2 className="text-xl font-semibold mb-4">配置插件</h2>
                        <div className="flex space-x-4">
                        <button
                            className="mb-4 px-4 py-2 text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center hover:bg-blue-100"
                            onClick={handleAIGenerate}
                        >
                            <Bot className="w-4 h-4 mr-2"/>
                            使用AI生成插件
                        </button>
                        <button
                            className="mb-4 px-4 py-2 text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center hover:bg-blue-100"
                            onClick={() => setShowAIInput(true)}
                        >
                            <CheckSquare className="w-4 h-4 mr-2"/>
                            检查代码
                        </button>
                        </div>
                        {/* 引入模态框 */}
                        <AiPluginModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onPluginGenerated={handlePluginGenerated} // 当插件生成后，调用此函数
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                插件名称
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={pluginName}
                                onChange={(e) => setPluginName(e.target.value)}
                                placeholder="正常情况下系统会自动识别..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                插件配置 (YAML) - 请确保您的插件名称和配置文件内的一致
                            </label>
                            <textarea
                                className="w-full h-40 p-2 border  rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={pluginConfig}
                                onChange={(e) => setPluginConfig(e.target.value)}
                                placeholder="在此输入插件配置 (YAML)..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                插件核心代码 (Python)
                            </label>
                            <textarea
                                className="w-full h-40 p-2 border  rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={pluginCode}
                                onChange={(e) => setPluginCode(e.target.value)}
                                placeholder="在此输入插件核心代码 (Python)..."
                            />
                        </div>
                    </div>

                    {showAIInput && (
                        <ValidationPanel pluginCode={pluginCode} pluginConfig={pluginConfig} pluginName={pluginName}/>
                    )}
                </div>
            </main>
            <footer className="container mx-auto px-4 py-4 flex justify-end -mt-12 !mr-48">
                <button
                    className="px-4 py-2 text-gray-600 border rounded-md mr-2 hover:bg-gray-50 dark:bg-white/10">
                    <Link href="/dashboard/plugins">取消</Link>
                </button>
                <button
                    onClick={handleComplete}
                    className={`px-4 py-2 rounded-lg ${isCompleteEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400  cursor-not-allowed'}`}
                    disabled={!isCompleteEnabled}
                >
                    完成
                </button>
            </footer>

            <PublishPluginsModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                pluginCode={pluginCode}
                pluginConfig={pluginConfig}
                pluginName={pluginName}
                pluginAuthor={pluginAuthor}
                pluginVersion={pluginVersion}
            />

        </div>
    );
}
