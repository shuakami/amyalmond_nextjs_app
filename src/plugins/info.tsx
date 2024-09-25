import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import InstallPluginsModal from "@/components/install_plugins_modal";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ErrorPage from "@/components/error";
import Link from "next/link";

interface PluginInfoProps {
    pluginData: Record<string, any>;
}

const PluginsInfoPage: React.FC<PluginInfoProps> = ({ pluginData }) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const handleInstallClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const isApproved = pluginData.approved;
    const isLocalInstalled = pluginData.isLocal;
    const isUnderReview = pluginData.underReview;
    const statusLabel = isLocalInstalled
        ? '本地已安装'
        : isApproved
            ? '通过审核'
            : isUnderReview
                ? '审核中'
                : '审核未通过';
    const statusColor = isLocalInstalled
        ? 'bg-blue-500 text-white'
        : isApproved
            ? 'bg-green-500 text-white'
            : isUnderReview
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white';
    const buttonLabel = isLocalInstalled ? '管理插件' : isApproved ? 'Install' : isUnderReview ? '安装' : '查看未通过原因';
    const buttonVariant = isUnderReview ? 'outline' : 'secondary';

    return (
        <div className="p-6 -mt-5">
            {/* 路径导航 */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link href="/dashboard">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link href="/dashboard/plugins">Plugins</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{pluginData.name || '插件详情'}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 插件标题部分 */}
            <div className="flex items-center justify-between mb-6 mt-10">
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <img
                            src={pluginData.avatar || 'https://vercel.com/api/www/avatar?u=shuakami&s=64'}
                            alt={pluginData.name}
                            className="w-10 h-10 mr-4 rounded-full"
                        />
                        <h1 className="text-2xl font-bold mr-4">{pluginData.name || 'Unknown Plugin'}</h1>
                        <span className={`inline-block ${statusColor} text-sm px-2 py-1 rounded`}>
                            {statusLabel}
                        </span>
                    </div>
                    <p className="text-gray-600 mt-2">{pluginData.description || 'No description available'}</p>
                </div>
                <Button variant={buttonVariant} size="default1" onClick={handleInstallClick}>
                    {buttonLabel}
                </Button>
                <InstallPluginsModal isOpen={isModalOpen} onClose={handleCloseModal} pluginData={pluginData} />
            </div>

            <div className="absolute left-0 right-0 border-b border-[#EBEBEB] mt-4" />

            {/* 插件产品部分 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div className="col-span-2">
                    <h2 className="text-lg font-bold mb-4 mt-12">Powered by {pluginData.pluginAuthor || pluginData.author}</h2>
                    <div className="bg-white shadow-sm rounded-lg p-4 border mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">{pluginData.name || '插件名异常'}</h3>
                                <p className="text-gray-600 mt-2">{pluginData.description || 'No description available'}</p>
                            </div>
                            <Button variant={buttonVariant} className="mr-2" size="default">
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 详情部分 */}
                <div className="col-span-1">
                    <h2 className="text-lg font-bold mb-4 mt-14">Details</h2>
                    <ul className="text-sm mt-8 space-y-4">
                        {Object.entries(pluginData).map(([key, value]) => {
                            if (key === 'avatar' || key === 'zip') {
                                return (
                                    <React.Fragment key={key}>
                                        <li className="flex justify-between mb-4">
                                            <span>{key}</span>
                                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                {key === 'avatar' ? 'View Avatar' : 'Download ZIP'}
                                            </a>
                                        </li>
                                        <div className="left-0 right-0 border-b border-[#EBEBEB]" />
                                    </React.Fragment>
                                );
                            }

                            return (
                                <React.Fragment key={key}>
                                    <li className="flex justify-between mb-4">
                                        <span>{key}</span>
                                        <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</span>
                                    </li>
                                    <div className="left-0 right-0 border-b border-[#EBEBEB]" />
                                </React.Fragment>
                            );
                        })}
                        <li className="flex justify-between mb-4">
                            <span>Report</span>
                            <a href={`/dashboard/plugins/report?plugin_id=${pluginData.plugin_id}&plugin_name=${pluginData.name}`} className="text-blue-500">Report this plugin</a>
                        </li>
                        <div className="left-0 right-0 border-b border-[#EBEBEB]" />
                        <li className="flex justify-between mb-4">
                            <span>Documentation</span>
                            <a target="_blank" href="/docs/plugins" className="text-blue-500">Docs</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 概述部分 */}
            <div>
                <h2 className="text-lg font-bold mb-4 !-mt-64">Overview</h2>
                <p className="text-sm text-gray-700 mb-2">
                    {isLocalInstalled ? '本地插件' : pluginData.approved ? '已通过审核的云插件' : '审核中或未通过'}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                    {pluginData.auditLog || 'No audit log available.'}
                </p>
            </div>
        </div>
    );
};

export default PluginsInfoPage;