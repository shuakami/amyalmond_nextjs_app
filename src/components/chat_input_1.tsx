import React, { useState } from 'react';
import { Copy, Plus, Zap } from 'lucide-react';

export default function Input1() {
    const [input, setInput] = useState('');

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="向我表达指令，我可以完成对话聊天、创作文章、生成代码等多种任务"
                    className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                        <Copy size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Plus size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Zap size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}