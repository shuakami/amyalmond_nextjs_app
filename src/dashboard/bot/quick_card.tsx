import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from "next/link";
import IntegrationItem from "@/components/IntegrationItem";



const QuickAccessCard = () => {
    return (
        <div className="w-80 rounded-lg border">
            <div className="p-5">
                <h2 className="text-md font-semibold text-center mb-1">工具推荐</h2>
                <p className="text-sm text-center mb-4">
                    探索更多工具，提升您的开发体验。
                </p>
                <div className="space-y-2 mb-8 mt-6">
                    <IntegrationItem
                        logo="wrench"
                        name="配置工具"
                        description="快速设置您的开发环境"
                    />
                    <IntegrationItem
                        logo="chart-bar"
                        name="监控面板"
                        description="实时监控应用性能"
                    />
                    <IntegrationItem
                        logo="database"
                        name="数据库管理"
                        description="高效管理您的数据"
                    />
                </div>
                <div className="border-t pt-4">
                    <Link href="/dashboard/plugins">
                    <button className="w-full py-2 px-4 bg-white dark:bg-transparent hover:bg-gray-50 text-sm font-medium rounded border flex items-center justify-center transition-colors">
                        浏览更多插件
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuickAccessCard;