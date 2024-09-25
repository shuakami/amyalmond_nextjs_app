import React, { useState } from 'react';
import { Brain, Paperclip, Book, Thermometer, Mic, Maximize2, Send, ChevronUp } from 'lucide-react';

export default function Input2() {
    const [input, setInput] = useState('');

    return (
        <div className="max-w-3xl mx-auto mt-8 bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center space-x-4 mb-2">
                <Brain size={20} className="text-gray-500" />
                <Paperclip size={20} className="text-gray-500" />
                <Book size={20} className="text-gray-500" />
                <Thermometer size={20} className="text-gray-500" />
                <Mic size={20} className="text-gray-500" />
                <Maximize2 size={20} className="text-gray-500" />
            </div>
            <div className="relative">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入聊天内容..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
        />
                <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">
                        发送 / ↵ 换行
                    </button>
                    <button className="px-3 py-1 bg-black text-white rounded-md text-sm flex items-center">
                        发送
                        <ChevronUp size={14} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}