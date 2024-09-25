import RobotSideNav from "@/dashboard/sidenav";
import '@/styles/globals.css'
import PluginsHeader from "@/plugins/header_hero";

import React from "react";
import PluginStart from "@/plugins/add/start";
import Meta from "@/components/Meta";


const AddPluginsPage = () => {
    return (
        <><Meta pageName="添加/制作插件"/>
            <div className="flex">
                <RobotSideNav/>
                <div className="flex-1 px-12 relative">
                    <PluginsHeader/>
                    <div className="absolute left-0 right-0 border-b border-[#EBEBEB] dark:border-[#2D2D2D]"/>
                    <div className="flex flex-col -mt-9">
                        <PluginStart/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddPluginsPage;
