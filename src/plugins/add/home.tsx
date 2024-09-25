import React from 'react';

export default function AddPlugins() {
    return (
        <div className="container mx-auto px-36 py-10 max-w-full -translate-x-14">
            {/* 顶部导航和标题 */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-4">

                    <h1 className="text-3xl font-bold">Integrations Console</h1>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
                    Create
                </button>
            </div>

            {/* 描述文本 */}
            <p className="text-gray-600 mb-12 leading-relaxed">
                This page is for creating integrations and managing integrations you own. Looking to manage your configurations? View your installed integrations.
            </p>

            {/* 编辑区域标题 */}
            <div className="border-b border-gray-200 pb-4 mb-8">
                <h2 className="text-lg font-semibold">
                    Edit Your Integrations
                </h2>
            </div>

            {/* 内容区域 */}
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-md">
                <h3 className="text-xl font-semibold mb-4">You have not created any integrations.</h3>
                <p className="text-gray-600 mb-6">
                    Browse and add existing integrations from the marketplace.
                </p>
                <button className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium">
                    Browse Marketplace
                </button>
            </div>
        </div>
    );
}
