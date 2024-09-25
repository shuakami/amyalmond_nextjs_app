'use client';

import React, { useState } from 'react';
import { X, HelpCircle, Clock, Zap, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface AiPluginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPluginGenerated: (pluginCode: string) => void;
}

const AiPluginModal: React.FC<AiPluginModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onPluginGenerated,
                                                     }) => {
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'selection' | 'generation'>('selection');
    const [processingType, setProcessingType] = useState<string | null>(null);
    const [beforeSimulation, setBeforeSimulation] = useState<boolean>(false);
    const [afterSimulation, setAfterSimulation] = useState<boolean>(false);

    const runSimulation = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(true);
        setTimeout(() => setter(false), 3000);
    };

    const handleGeneratePlugin = async () => {
        if (!description) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:10417/plugins/add_plugin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_prompt: `${processingType === 'before' ? `
[在LLM**回复前**处理 - SystemPrompt - Ver1]

你是一个插件生成器，任务是根据用户提供的信息生成符合最新升级的插件系统要求的插件代码和解释文件。插件系统基于 Python 编写，支持扩展机器人的功能。以下是生成插件时必须遵守的规则：

1. 插件结构：
    - 插件必须以类的形式编写，并继承自 \`core.plugins.Plugin\`，类名根据插件功能命名（如 \`CustomReplyPlugin\`）。
    - 插件类必须包含 \`__init__\` 方法，接受一个参数 \`bot_client\`。插件名称需存储在 \`self.name\` 属性中，\`bot_client\` 参数必须传递给基类 \`Plugin\` 的构造函数。
    - 插件的配置文件可通过 \`core.plugins.tools.plugin_utils.load_plugin_config\` 加载并创建，并检查配置文件是否加载成功。如果用户的需求不需要配置文件，就不需要使用配置文件。
2. 消息处理与判断：
    - 插件需要能够接收和处理用户消息。在插件中，接收的消息对象通常包含以下属性：
        - \`message.author.member_openid\`：表示用户 ID，用于识别发送消息的用户。
        - \`message.content\`：表示消息的文本内容。
        - \`message.group_openid\`：表示消息来源的群组 ID。
    - 在接收消息后，插件需要清理和格式化消息内容，例如使用 \`message.content.strip().lower()\` 清理空格并将内容转换为小写，以便进行进一步判断。
    - 根据消息内容进行判断和处理，比如判断消息是否包含特定关键字或符合特定格式。然后进行进一步处理。
3. （可选）处理管理员命令：
    - 插件需要支持处理管理员命令，并通过一些方法判断消息是否来自管理员，例如通过用户 ID（如 \`message.author.member_openid\`）与预定义的管理员 ID（如 \`self.bot_client.ADMIN_ID\`）进行比对。
    - 只有用户要求需要管理员命令才使用此方法。
    - 插件应包含逻辑以支持多个管理员命令，并能够基于用户输入的指令动态配置这些命令的识别和执行流程。
4. 优先级处理：
    - 在 \`before_llm_message\` 方法中，插件可以在大语言模型（LLM）处理消息之前执行特定操作。可以通过返回 \`False\` 来跳过 LLM 的进一步处理，也可以返回 \`True\` 以继续 LLM 的处理。
    - 插件可以根据需要灵活地配置哪些情况下需要跳过 LLM 处理。
5. 插件回复和响应：
    - 插件可以通过 \`bot_client\` 对象发送消息回复，具体方法可以根据用户需求灵活定义，例如通过调用 \`await self.bot_client.send_message(group_id, reply_message)\` 方法回复消息。
    - 插件应包含适当的错误处理逻辑，并使用 \`core.utils.logger.get_logger\` 记录日志信息。
6. 优先级设置：
    - 插件解释文件中可以定义 \`priority\` 属性，用于决定插件处理消息的顺序，数值越高优先级越高。
    - 若未指定优先级，则默认为 \`0\`。
7. 解释文件：
    - 插件必须包含一个 YAML 格式的解释文件，包含插件名（plugin_name）、版本号、作者、描述和依赖项等信息。插件的元信息从用户输入中提取。配置项内容使用双引号。
    - 解释文件中的 \`priority\` 字段用于定义插件的优先级，系统会根据该字段值优先处理高优先级插件。
8. 输出格式：
    - 插件代码文件以 \`.py\` 为后缀，类名和文件名保持一致。
    - 插件解释文件以 \`.yaml\` 为后缀，包含插件的元信息、依赖项和优先级配置。
    - 输出结果格式如下：
        - \`plugin_code = """python 完整的 Python 插件代码 """\`
        - \`plugin_config = """yaml 完整的 YAML 解释文件 """\`
` : `
[在LLM**回复后**处理 - SystemPrompt - Ver1]

你是一个插件生成器，任务是根据用户提供的信息生成符合最新升级的插件系统要求的插件代码和解释文件。插件系统基于 Python 编写，支持扩展机器人的功能。以下是生成插件时必须遵守的规则：

1. 插件结构：
    - 插件必须以类的形式编写，并继承自 \`core.plugins.Plugin\`，类名根据插件功能命名（如 \`CustomReplyPlugin\`）。
    - 插件类必须包含 \`__init__\` 方法，接受一个参数 \`bot_client\`。插件名称需存储在 \`self.name\` 属性中，\`bot_client\` 参数必须传递给基类 \`Plugin\` 的构造函数。
    - 插件的配置文件可通过 \`core.plugins.tools.plugin_utils.load_plugin_config\` 加载，并检查配置文件是否加载成功。
2. 处理 LLM 回复后的消息：
    - 插件必须实现 \`on_message\` 方法，该方法会在 LLM 处理并生成初步回复后被调用。
    - \`on_message\` 方法接收两个参数：
        - \`message\`：原始的用户消息对象，包含用户 ID、消息内容、群组 ID 等信息。
        - \`reply_message\`：LLM 初步生成的回复内容，需要插件进一步处理。
    - 在 \`on_message\` 方法中，根据需要修改 \`reply_message\` 内容。插件可以基于用户输入的规则或逻辑来添加、删除或修改回复内容。例如，添加特定的短语、关键词或根据特定条件更改回复。
3. 修改回复的逻辑：
    - 插件应根据用户输入的指令灵活地定义如何修改回复。例如，可以通过检查 \`message\` 对象中的属性（如 \`message.content\`）来决定如何更改 \`reply_message\`。
    - 插件生成器应支持生成多种不同的回复修改策略，例如在特定条件下添加问候语、修改语气或更改特定词语。
4. 日志记录和错误处理：
    - 插件必须包含错误处理逻辑，使用 \`core.utils.logger.get_logger\` 记录日志，并在出错时优雅地处理错误。
    - 日志应包括插件初始化、调用和最终的修改结果，以便于调试和追踪。例如，在修改回复后，记录最终的 \`reply_message\` 内容。
5. 插件回复和响应：
    - 插件的 \`on_message\` 方法需要返回修改后的 \`reply_message\`，以便机器人使用新的回复内容与用户交互。
6. 解释文件：
    - 插件必须包含一个 YAML 格式的解释文件，包含插件名（plugin_name）、版本号、作者、描述和依赖项等信息。插件的元信息从用户输入中提取。请注意使用双引号。
7. 输出格式：
    - 插件代码文件以 \`.py\` 为后缀，类名和文件名保持一致。
    - 插件解释文件以 \`.yaml\` 为后缀，包含插件的元信息、依赖项和优先级配置。
    - 输出结果格式如下：
        - \`plugin_code = """python 完整的 Python 插件代码 """\`
        - \`plugin_config = """yaml 完整的 YAML 解释文件 """\`
`}`,
                    user_input: description,
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                onPluginGenerated(data.plugin_code);
                onClose();
            } else {
                setError('插件生成失败，请重试');
            }
        } catch (err) {
            setError('请求失败，请检查机器人客户端是否正确启动');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelection = (type: string) => {
        setProcessingType(type);
        setStep('generation');
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
                        className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-[630px] relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-50 via-[#0043FF] to-white">
                                AI自动生成插件
                            </h2>

                            {step === 'selection' && (
                                <div className="p-6 bg-white dark:bg-black rounded-lg">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/80">选择插件处理时机</h3>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-700 dark:text-white/80">
                                                    <HelpCircle size={16} className="mr-1" />
                                                    了解更多
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[700px]">
                                                <div className="p-4">
                                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white/80 mb-4">处理时机说明</h2>
                                                    <div className="space-y-6">
                                                        {/* Before Response Handling */}
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">在机器人回复之前处理</h3>
                                                            <div className="relative h-20 bg-gray-100 dark:bg-white/20 rounded-lg overflow-hidden flex items-center">
                                                                <motion.div
                                                                    className="absolute inset-y-0 left-0 bg-blue-200 flex items-center justify-center transition-all duration-700 ease-in-out"
                                                                    initial={{ width: 0, opacity: 0 }}
                                                                    animate={{ width: beforeSimulation ? '33%' : 0, opacity: beforeSimulation ? 1 : 0 }}
                                                                >
                                                                    <User className="text-blue-500" size={20} />
                                                                    <span className="text-xs text-gray-700 dark:text-white/80 ml-2">用户消息</span>
                                                                </motion.div>
                                                                <motion.div
                                                                    className="absolute inset-y-0 left-1/3 bg-yellow-200 flex items-center justify-center transition-all duration-700 ease-in-out"
                                                                    initial={{ width: 0, opacity: 0 }}
                                                                    animate={{ width: beforeSimulation ? '33%' : 0, opacity: beforeSimulation ? 1 : 0 }}
                                                                    transition={{ delay: 0.5 }}
                                                                >
                                                                    <Zap className="text-yellow-500" size={20} />
                                                                    <span className="text-xs text-gray-700 dark:text-white/80 ml-2">插件处理</span>
                                                                </motion.div>
                                                                <motion.div
                                                                    className="absolute inset-y-0 right-0 bg-green-200 flex items-center justify-center transition-all duration-700 ease-in-out"
                                                                    initial={{ width: 0, opacity: 0 }}
                                                                    animate={{ width: beforeSimulation ? '33%' : 0, opacity: beforeSimulation ? 1 : 0 }}
                                                                    transition={{ delay: 1 }}
                                                                >
                                                                    <Bot className="text-green-500" size={20} />
                                                                    <span className="text-xs text-gray-700 dark:text-white/80 ml-2">机器人回复</span>
                                                                </motion.div>
                                                            </div>
                                                            <button
                                                                onClick={() => runSimulation(setBeforeSimulation)}
                                                                className="mt-2 text-sm text-blue-600 hover:underline"
                                                            >
                                                                运行模拟
                                                            </button>
                                                            <p className="text-xs text-gray-600 mt-2">插件在AI生成回复之前执行，可以影响或修改AI的输入。</p>
                                                        </div>

                                                        {/* After Response Handling */}
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">在机器人回复后处理</h3>
                                                            <div className="relative h-20 bg-gray-100 dark:bg-white/20 rounded-lg overflow-hidden flex items-center">
                                                                <motion.div
                                                                    className="absolute inset-y-0 left-0 bg-blue-200 flex items-center justify-center transition-all duration-700 ease-in-out"
                                                                    initial={{ width: 0, opacity: 0 }}
                                                                    animate={{ width: afterSimulation ? '33%' : 0, opacity: afterSimulation ? 1 : 0 }}
                                                                >
                                                                    <User className="text-blue-500" size={20} />
                                                                    <span className="text-xs text-gray-700 dark:text-white/80 ml-2">用户消息</span>
                                                                </motion.div>
                                                                <motion.div
                                                                    className="absolute inset-y-0 left-1/3 bg-green-200 flex items-center justify-center transition-all duration-700 ease-in-out"
                                                                    initial={{ width: 0, opacity: 0 }}
                                                                    animate={{ width: afterSimulation ? '33%' : 0, opacity: afterSimulation ? 1 : 0 }}
                                                                    transition={{ delay: 0.5 }}
                                                                >
                                                                    <Bot className="text-yellow-500" size={20} />
                                                                    <span className="text-xs text-gray-700 dark:text-white/80 ml-2">机器人回复</span>
                                                                </motion.div>
                                                                <motion.div
                                                                    className="absolute inset-y-0 right-0 bg-yellow-200 flex items-center justify-center transition-all duration-700 ease-in-out"
                                                                    initial={{ width: 0, opacity: 0 }}
                                                                    animate={{ width: afterSimulation ? '33%' : 0, opacity: afterSimulation ? 1 : 0 }}
                                                                    transition={{ delay: 1 }}
                                                                >
                                                                    <Zap className="text-yellow-500" size={20} />
                                                                    <span className="text-xs text-gray-700 dark:text-white/80 ml-2">插件增强</span>
                                                                </motion.div>
                                                            </div>
                                                            <button
                                                                onClick={() => runSimulation(setAfterSimulation)}
                                                                className="mt-2 text-sm text-blue-600 hover:underline"
                                                            >
                                                                运行模拟
                                                            </button>
                                                            <p className="text-xs text-gray-600 mt-2">插件在AI生成回复之后执行，可以修改或增强AI的输出。</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-white dark:bg-black border border-gray-200 dark:border-white/20 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex flex-col items-center justify-center text-center"
                                            onClick={() => handleSelection('before')}
                                        >
                                            <Zap size={24} className="text-yellow-500 mb-2" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">在机器人回复之前处理</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-white dark:bg-black border border-gray-200 dark:border-white/20 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex flex-col items-center justify-center text-center"
                                            onClick={() => handleSelection('after')}
                                        >
                                            <Clock size={24} className="text-blue-500 mb-2" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">在机器人回复后处理</span>
                                        </motion.button>
                                    </div>
                                </div>
                            )}


                            {step === 'generation' && (
                                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                                    <h3 className="text-lg font-bold mb-4 text-black text-start mt-3">几句话描述您的插件</h3>
                                    <div className="bg-[#F8F8F8] p-4 rounded-md mb-4">
                                        <p className="text-sm text-gray-600 text-start">
                                            <span className="font-bold">💡示例：</span>我想要一个可以在每次机器人输出消息后面加Hi的插件~
                                        </p>
                                    </div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="描述你想创建的插件，包括它的作用和特点，以及对它生成结果的预期。如果您需要使用api请标明地址"
                                        className="w-full h-32 p-3 resize-none focus:outline-none focus:border focus:border-blue-500 transition-colors rounded-lg"
                                        style={{ border: '1px solid #e2e8f0' }}
                                    />
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={handleGeneratePlugin}
                                            className={`py-3 px-24 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                                                description && !isLoading
                                                    ? 'bg-[#2454FF] text-white hover:bg-blue-600 focus:ring-blue-500'
                                                    : 'bg-[#B0B7C0] text-white cursor-not-allowed'
                                            }`}
                                            disabled={!description || isLoading}
                                        >
                                            {isLoading ? '生成中...' : '生成插件'}
                                        </button>
                                    </div>
                                    {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiPluginModal;