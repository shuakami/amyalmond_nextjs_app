import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ValidationPanelProps {
    pluginCode: string;
    pluginConfig: string;
    pluginName: string;
}

// 单个字母动画效果
const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
        },
    }),
};

export default function ValidationPanel({ pluginCode, pluginConfig, pluginName }: ValidationPanelProps) {
    const [validationResults, setValidationResults] = useState<{ nameErrors: string[], codeErrors: string[], configErrors: string[], isValid: boolean | null }>({
        nameErrors: [],
        codeErrors: [],
        configErrors: [],
        isValid: null,
    });

    // 检查插件名称是否符合要求
    const validatePluginName = (name: string): string[] => {
        const errors: string[] = [];
        if (!name || /[^a-zA-Z0-9_-]/.test(name)) {
            errors.push('插件名称不能为空，并且只能包含字母、数字、下划线或连字符。');
        }
        return errors;
    };

    // 检查插件代码是否符合SystemPrompt的要求
    const validatePluginCode = (code: string): string[] => {
        const errors: string[] = [];
        if (!code.includes('class ') || !code.includes('Plugin')) {
            errors.push('类定义缺失或未继承 core.plugins.Plugin。请确保插件定义类并继承自 Plugin。');
        }
        if (!code.includes('__init__')) {
            errors.push('插件缺少 __init__ 方法。请在类定义中添加初始化方法。示例：\nclass MyPlugin(Plugin):\n    def __init__(self):');
        }
        return errors;
    };

    // 检查插件配置文件（YAML）是否符合SystemPrompt的要求
    const validatePluginConfig = (config: string): string[] => {
        const errors: string[] = [];
        if (!config.includes('plugin_name:')) {
            errors.push('缺少 plugin_name 字段。请确保在 YAML 文件中定义插件名称。示例：\nplugin_name: "MyPlugin"');
        }
        if (!config.includes('version:')) {
            errors.push('缺少 version 字段。请确保在 YAML 文件中定义插件版本号。示例：\nversion: "1.0.0"');
        }
        if (!config.includes('author:')) {
            errors.push('缺少 author 字段。请确保在 YAML 文件中定义插件作者信息。示例：\nauthor: "Your Name"');
        }
        if (!config.includes('description:')) {
            errors.push('缺少 description 字段。请确保在 YAML 文件中定义插件描述。示例：\ndescription: "这是一个简单的插件"');
        }
        return errors;
    };

    // 自动检测：每当插件代码、配置文件或名称发生变化时触发检测
    useEffect(() => {
        if (!pluginCode && !pluginConfig && !pluginName) return; // 如果内容为空，不执行检测

        const nameErrors = validatePluginName(pluginName);
        const codeErrors = validatePluginCode(pluginCode);
        const configErrors = validatePluginConfig(pluginConfig);

        setValidationResults({
            nameErrors,
            codeErrors,
            configErrors,
            isValid: nameErrors.length === 0 && codeErrors.length === 0 && configErrors.length === 0,
        });
    }, [pluginCode, pluginConfig, pluginName]); // 监听 pluginCode、pluginConfig 和 pluginName 的变化

    // 将字符串拆分为逐字的数组并进行动画处理
    const renderAnimatedText = (text: string) => {
        return text.split('').map((char, i) => (
            <motion.span key={i} custom={i} initial="hidden" animate="visible" variants={letterAnimation}>
                {char}
            </motion.span>
        ));
    };

    return (
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 mt-4 text-gray-800 dark:text-gray-300">自动调试与验证</h2>
            <div className="bg-gray-100/80 dark:bg-white/10 rounded-lg p-6 mb-4 flex-grow">
                <div className="flex flex-col h-full text-gray-700">

                    {/* 显示插件名称的错误 */}
                    {validationResults.nameErrors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-4"
                        >
                            <div className="text-yellow-600 mb-2 flex items-center">
                                <AlertTriangle className="w-6 h-6 mr-2" />
                                <h3 className="font-semibold">插件名称错误：</h3>
                            </div>
                            <div className="pl-8 space-y-2">
                                {validationResults.nameErrors.map((error, index) => (
                                    <div key={index} className="text-red-500 flex items-start space-x-2">
                                        <Info className="w-5 h-5 mt-1" />
                                        <div>
                                            <p>{renderAnimatedText(error)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 显示插件代码的错误 */}
                    {validationResults.codeErrors.length > 0 && (
                        <motion.div
                            key={validationResults.codeErrors.length}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-4"
                        >
                            <div className="text-yellow-600 mb-2 flex items-center">
                                <AlertTriangle className="w-6 h-6 mr-2" />
                                <h3 className="font-semibold">插件代码错误：</h3>
                            </div>
                            <div className="pl-8 space-y-2">
                                {validationResults.codeErrors.map((error, index) => (
                                    <div key={index} className="text-red-500 flex items-start space-x-2">
                                        <Info className="w-5 h-5 mt-1" />
                                        <div>
                                            <p>{renderAnimatedText(error)}</p>
                                            <p className="text-sm text-black dark:text-white">修复建议：请确保插件类定义和继承符合系统要求。</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 显示插件配置文件的错误 */}
                    {validationResults.configErrors.length > 0 && (
                        <motion.div
                            key={validationResults.configErrors.length}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-6"
                        >
                            <div className="text-yellow-600 mb-2 flex items-center">
                                <AlertTriangle className="w-6 h-6 mr-2" />
                                <h3 className="font-semibold">插件配置文件错误：</h3>
                            </div>
                            <div className="pl-8 space-y-2">
                                {validationResults.configErrors.map((error, index) => (
                                    <div key={index} className="text-red-500 flex items-start space-x-2">
                                        <Info className="w-5 h-5 mt-1" />
                                        <div>
                                            <p>{renderAnimatedText(error)}</p>
                                            <p className="text-sm text-black dark:text-white">修复建议：请根据系统要求补全 YAML 配置文件。</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 显示成功信息 */}
                    {validationResults.isValid && (
                        <motion.div
                            key="valid"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-6"
                        >
                            <div className="text-green-600 flex items-center">
                                <CheckCircle className="w-6 h-6 mr-2" />
                                <p className="font-medium">{renderAnimatedText('插件名称、代码和配置文件均通过验证~ 太棒了！！')}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
