'use client'

// @ts-ignore
import yaml from 'js-yaml';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
// @ts-ignore
import CryptoJS from 'crypto-js';
import { Progress } from "@/components/ui/progress"
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

interface PublishPluginsModalProps {
    isOpen: boolean;
    onClose: () => void;
    pluginCode: string;
    pluginConfig: string;
    pluginName: string;
    pluginAuthor: string;
    pluginVersion: string;
}

export default function PublishPluginsModal({ isOpen, onClose, pluginCode, pluginConfig, pluginName, pluginAuthor, pluginVersion }: PublishPluginsModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [pluginReadme, setPluginReadme] = useState('');
    const [pluginAvatar, setPluginAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isPackaging, setIsPackaging] = useState(false);
    const [pluginId, setPluginId] = useState('');
    const [checksum, setChecksum] = useState('');
    const [zipFile, setZipFile] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [submissionStage, setSubmissionStage] = useState('');

    useEffect(() => {
        if (pluginName) {
            const generatedPluginId = `${pluginName}_${uuidv4()}`;
            setPluginId(generatedPluginId);
        }
    }, [pluginName]);

    useEffect(() => {
        if (pluginId) {
            setIsPackaging(true);
            const zip = new JSZip();

            // 解析和修改 YAML 文件内容
            let modifiedYamlConfig = pluginConfig;
            try {
                const yamlContent = yaml.load(pluginConfig); // 解析 YAML
                if (typeof yamlContent === 'object' && yamlContent !== null) {
                    yamlContent.plugin_id = pluginId; // 注入 plugin_id
                    modifiedYamlConfig = yaml.dump(yamlContent); // 转换回 YAML 字符串
                }
            } catch (e) {
                console.error('Error parsing YAML:', e);
                setError('YAML 格式错误');
                setIsPackaging(false);
                return;
            }

            // 直接将文件添加到ZIP的根目录
            zip.file(`${pluginName}.py`, pluginCode);
            zip.file(`${pluginName}.yaml`, modifiedYamlConfig);

            // 打印配置
            console.log('Generated YAML Config:', modifiedYamlConfig);

            zip.generateAsync({ type: 'blob' }).then((content) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    if (reader.result) {
                        // 使用 CryptoJS 计算 SHA-256 校验和
                        const wordArray = CryptoJS.lib.WordArray.create(reader.result); // 将 ArrayBuffer 转换为 WordArray
                        const hash = CryptoJS.SHA256(wordArray); // 计算 SHA-256 哈希
                        const hashHex = hash.toString(CryptoJS.enc.Hex); // 转换为十六进制字符串

                        setChecksum(hashHex); // 设置生成的 checksum
                        setZipFile(content); // 设置生成的 zip 文件
                        setIsPackaging(false); // 完成打包过程

                        // 打印
                        console.log('Generated checksum:', hashHex);
                    }
                };
                reader.readAsArrayBuffer(content); // 将 Blob 转换为 ArrayBuffer
            }).catch(() => {
                setError('打包过程中出现问题');
                setIsPackaging(false);
            });
        }
    }, [pluginId, pluginCode, pluginConfig, pluginName]);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
            setPluginAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setError('图片大小不能超过5MB');
        }
    };

    const handleSubmit = async () => {
        if (!pluginReadme || !pluginAvatar || !zipFile) {
            setError('请检查你之前的 插件名称/插件配置 (YAML)/插件核心代码 (Python)/使用说明 是否正确填写');
            console.log('Missing fields:', !pluginReadme, !pluginAvatar, !zipFile);
            return;
        }

        setIsSubmitting(true);
        setProgress(0);
        setSubmissionStage('正在准备提交...');

        const formData = new FormData();
        formData.append('plugin_id', pluginId);
        formData.append('plugin_name', pluginName);
        formData.append('plugin_author', pluginAuthor);
        formData.append('plugin_version', pluginVersion);
        formData.append('plugin_readme', pluginReadme);
        formData.append('plugin_avatar', pluginAvatar);
        formData.append('plugin_zip', zipFile);
        formData.append('checksum', checksum);

        try {
            const simulateProgress = () => {
                let currentProgress = 0;
                const interval = setInterval(() => {
                    currentProgress += Math.random() * 5;
                    if (currentProgress > 95) {
                        clearInterval(interval);
                        currentProgress = 95;
                    }
                    setProgress(currentProgress);
                    updateSubmissionStage(currentProgress);
                }, 300);
                return interval;
            };

            const progressInterval = simulateProgress();

            const response = await fetch('/api/add_plugin', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setProgress(100);
            setSubmissionStage('提交完成！');

            const result = await response.json();

            // 判断是否成功
            if (
                result.status === 'success' ||
                result.status === 'FUNCTION_INVOCATION_TIMEOUT' ||
                JSON.stringify(result).includes('FUNCTION_INVOCATION_TIMEOUT')
            ) {
                // 设置每个插件的单独 Cookie，使用 pluginId 作为 Cookie 的唯一标识符
                const expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 10); // 设置为 10 年后

                document.cookie = `plugin_info_${pluginId}=${encodeURIComponent(
                    JSON.stringify({
                        pluginId,
                        pluginName,
                        pluginAuthor,
                        pluginVersion,
                        prNumber: result.pr_number,
                    })
                )}; path=/; expires=${expirationDate.toUTCString()};`;

                setTimeout(() => {
                    window.location.href = `/dashboard/plugins/my?cookie=true`;
                }, 1000);
            } else {
                throw new Error(result.error || '未知错误');
            }
        } catch (err) {
            setError('插件提交失败。请通过 (F12——Console(控制台)) 查看日志，并将日志截图给开发者');
            console.error('提交失败:', err);
            console.log('提交的数据:', {
                pluginId,
                pluginName,
                pluginAuthor,
                pluginVersion,
                pluginCode,
                pluginConfig,
                pluginReadme,
                pluginAvatar,
                checksum
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateSubmissionStage = (progress: number) => {
        if (progress < 20) {
            setSubmissionStage('正在打包插件文件...');
        } else if (progress < 40) {
            setSubmissionStage('正在上传插件资源...');
        } else if (progress < 60) {
            setSubmissionStage('正在验证插件完整性...');
        } else if (progress < 80) {
            setSubmissionStage('正在生成插件文档...');
        } else {
            setSubmissionStage('即将完成提交...');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white dark:bg-black rounded-lg w-full max-w-[800px] relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-500"
                            disabled={isSubmitting}
                        >
                            <X size={24} />
                        </button>
                        <div className="p-8">
                            {!isSubmitting && (
                                <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0F87FC] to-[#0043FF]">
                                    补充插件详情
                                </h2>
                            )}
                            {!isSubmitting ? (
                                currentStep === 1 ? (
                                    <>
                                        <h3 className="text-lg font-bold mb-4 text-black dark:text-white">插件使用说明</h3>
                                        <textarea
                                            value={pluginReadme}
                                            onChange={(e) => setPluginReadme(e.target.value)}
                                            placeholder="输入插件的使用说明（类似README）"
                                            className="w-full h-40 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors rounded-lg border border-gray-300"
                                        />
                                        <div className="flex justify-end mt-6">
                                            <button
                                                onClick={() => setCurrentStep(2)}
                                                className="py-2 px-6 rounded-md bg-[#2454FF] text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                下一步
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-bold mb-4 text-black dark:text-white">上传插件头像</h3>
                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {avatarPreview ? (
                                                        <Image src={avatarPreview} alt="Avatar preview" width={128} height={128} className="w-32 h-32 object-cover rounded-full" />
                                                    ) : (
                                                        <>
                                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传</span> 或拖拽文件到这里</p>
                                                            <p className="text-xs text-gray-500">PNG, JPG or GIF (最大 5MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                            </label>
                                        </div>
                                        <div className="flex justify-between mt-6">
                                            <button
                                                onClick={() => setCurrentStep(1)}
                                                className="py-2 px-6 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                            >
                                                上一步
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                className={`py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                                                    pluginReadme && pluginAvatar && !isPackaging
                                                        ? 'bg-[#2454FF] text-white hover:bg-blue-600 focus:ring-blue-500'
                                                        : 'bg-[#B0B7C0] text-white cursor-not-allowed'
                                                }`}
                                                disabled={!pluginReadme || !pluginAvatar || isPackaging}
                                            >
                                                {isPackaging ? '打包中...' : '提交插件'}
                                            </button>
                                        </div>
                                    </>
                                )
                            ) : (
                                <div className="w-full max-w-md mx-auto p-6 space-y-4 -mt-3.5">
                                    <h3 className="text-lg font-bold text-center text-primary">{submissionStage}</h3>
                                    <Progress value={progress} className="w-full"/>
                                    <div className="text-center text-sm text-muted-foreground">
                                        插件提交进度: {progress.toFixed(0)}%
                                    </div>
                                    <p className="text-center text-sm text-muted-foreground">请耐心等待，插件提交过程可能需要15-45秒</p>
                                </div>
                            )}
                            {error && (
                                <div className="mt-4 text-red-500 text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}