// [pluginId].tsx
import '@/styles/globals.css'
import RobotSideNav from "@/dashboard/sidenav";
import PluginsHeader from "@/plugins/header_hero";
import React, { useEffect, useState } from "react";
import PluginsInfoPage from "@/plugins/info";
import { useRouter } from 'next/router';
import ErrorPage from "@/components/error";
import Meta from "@/components/Meta";

export default function PluginsInfo() {
    const router = useRouter();
    const { pluginId, PluginName } = router.query;
    const [pluginData, setPluginData] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const isLocal = router.query.local === 'true';

    useEffect(() => {
        if (pluginId) {
            fetchPluginData();
        }
    }, [pluginId, PluginName]);

    const fetchPluginData = async () => {
        setLoading(true);
        try {
            let pluginInfo: Record<string, any> | null = null;

            if (isLocal) {
                const response = await fetch('http://localhost:10417/plugins/list');
                const localData = await response.json();

                pluginInfo = localData.plugins.find((plugin: any) =>
                    plugin.plugin_id === pluginId || plugin.name === pluginId
                );

                if (!pluginInfo) {
                    throw new Error('Local plugin not found.');
                }

                pluginInfo = parseLocalPluginData(pluginInfo);
            } else {
                const response = await fetch(`/api/plugin_info?id=${pluginId}&name=${PluginName}`);
                const cloudData = await response.json();

                if (!cloudData.plugin_id) {
                    throw new Error('Plugin not found in cloud.');
                }

                pluginInfo = parseCloudPluginData(cloudData);
            }

            setPluginData(pluginInfo);
        } catch (err) {
            setError((err as Error).message || 'Failed to fetch plugin data.');
        } finally {
            setLoading(false);
        }
    };

    const parseLocalPluginData = (data: any): Record<string, any> => {
        return {
            plugin_id: data.plugin_id || '无UUID',
            name: data.name || '未知插件',
            author: data.author || '未知作者',
            version: data.version || '1.0.0',
            description: data.description || 'No description available',
            dependencies: data.dependencies || [],
            isLocal: true,
            approved: false,
            avatar: data.avatar || '',
            zip: data.zip || ''
        };
    };

    const parseCloudPluginData = (data: any): Record<string, any> => {
        return {
            plugin_id: data.plugin_id[0] || data.plugin_id || '无UUID',
            description: data.description[0] || data.description || 'No description available',
            name: data.name[0] || data.name || '未知插件',
            author: data.author[0] || data.author || '未知作者',
            version: data.version || '1.0.0',
            approved: data.approved || false,
            avatar: data.avatar || '',
            zip: data.zip || '',
            isLocal: false
        };
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    if (error || !pluginData) {
        return <ErrorPage error={error || '未知故障....'} />;
    }

    return (
        <>
            <Meta pageName={`插件详情 - ${pluginData.name}`} />
            <div className="flex">
                <RobotSideNav />
                <div className="flex-1 px-12 relative">
                    <PluginsHeader />
                    <div className="absolute left-0 right-0 border-b border-[#EBEBEB] dark:border-[#2D2D2D]" />
                    <div className="flex mt-8">
                        <div className="flex-1">
                            <div className="flex flex-col px-6 xl:px-14 2xl:px-16 3xl:px-36 2xl:mr-24 mr-16">
                                <PluginsInfoPage pluginData={pluginData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
