import React from 'react';
import Link from "next/link";

const PluginsHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between py-14 px-8">
            {/* 左侧标题 */}
            <h1 className="text-3xl font-bold text-[#080808] dark:text-[#E0E0E0] inline ml-2">
                AmyAlmond
                <span className="font-light text-[#E0E0E0] dark:text-[#E0E0E0]/30"> /</span>
                <span className="font-normal text-[#000000] dark:text-[#E0E0E0]"> PLUGINS</span>
            </h1>


            {/* 右侧按钮 */}
            <div className="flex gap-3 mr-8">
                <button
                    className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-[#F2F2F2] dark:hover:bg-white/5 focus:ring-gray-200">
                    <Link href="/dashboard/plugins/start">我要上传/制作插件</Link>
                </button>
                <button
                    className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-[#F2F2F2] dark:hover:bg-white/5 focus:ring-gray-200">
                    <Link href="/dashboard/plugins/my?cookie=true">我的插件</Link>
                </button>
            </div>
        </div>
    );
};

export default PluginsHeader;
