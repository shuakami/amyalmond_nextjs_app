import '@/styles/globals.css'
import PluginHero from '@/plugins/home';
import RobotSideNav from "@/dashboard/sidenav";
import PluginsHeader from "@/plugins/header_hero";
import React from "react";
import PluginsList from "@/plugins/list";
import { PluginSidebar } from "@/plugins/sidebar";
import Meta from "@/components/Meta";

export default function Plugins() {
    return (
        <>
            <Meta pageName="插件中心" />
            <div className="flex">
                <RobotSideNav />
                <div className="flex-1 px-12 relative">
                    <PluginsHeader />
                    <div className="absolute left-0 right-0 border-b border-[#EBEBEB] dark:border-[#2D2D2D]" />
                    <div className="flex mt-8">
                        <div className="w-2/6 flex-shrink-0 mr-8 mt-4">
                            <div className="sticky top-8 max-h-full">
                                <PluginSidebar onPluginClick={() => {}} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <PluginHero />
                                <PluginsList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}