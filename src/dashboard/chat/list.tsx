import { Search, ChevronDown, Plus, MessageSquare } from 'lucide-react'

const chatItems = [
    { icon: "🦉", title: "随便聊聊" },
    { icon: "📝", title: "英语作文助手", time: "15:27", description: "英语作文修改与写作指导" },
    { icon: "✅", title: "语言修正器", time: "15:27", description: "检查拼写与语法错误" },
    { icon: "📚", title: "文本总结助手", time: "15:27", description: "帮你准确提取关键信息并简洁..." },
    { icon: "💡", title: "抽象概念实体化表达大师", time: "15:27", description: "帮你把复杂的 UX 文案..." },
    { icon: "🖊️", title: "前端 TypeScript 学习...", time: "15:27", description: "根据你提供的代码，考虑实..." },
    { icon: "🧑‍🔬", title: "Mr. Feynman", time: "15:27", description: "对问题进行复杂和深度分析..." },
    { icon: "📄", title: "写作助手", time: "15:27", description: "帮助提升文本质量" },
]

export default function ChatList() {
    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold">ChatList</h1>
                <MessageSquare className="h-5 w-5 text-gray-500" />
            </div>
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="搜索助手和对话..."
                        className="w-full pl-8 pr-12 py-2 bg-gray-100 rounded-md text-sm"
                    />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <span className="absolute right-2 top-2.5 text-xs text-gray-400">Ctrl K</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg cursor-pointer">
                        <span className="text-2xl">🤔</span>
                        <span className="text-sm font-medium">随便聊聊</span>
                    </div>
                </div>
                <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500">
                    <span>默认列表</span>
                    <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 px-2">
                    {chatItems.slice(1).map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            <span className="text-2xl mr-3">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium text-black truncate">{item.title}</span>
                                    {item.time && <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{item.time}</span>}
                                </div>
                                {item.description && (
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}