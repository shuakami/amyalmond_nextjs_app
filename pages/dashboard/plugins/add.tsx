import LoadingPage from "@/components/loading";
import RobotSideNav from "@/dashboard/sidenav";
import ChatList from "@/dashboard/chat/list";
import '@/styles/globals.css'
import PluginsHeader from "@/plugins/header_hero";

import React from "react";
import AddPlugins from "@/plugins/add/home";
import Meta from "@/components/Meta";


const AddPluginsPage = () => {
    return (
        <>
            <Meta pageName="废案"/>
            <div className="flex">
                <RobotSideNav/>
                <div className="flex-1 px-12 relative">
                    <PluginsHeader/>
                    <div className="absolute left-0 right-0 border-b border-[#EBEBEB] dark:border-[#2D2D2D]"/>
                    <div className="flex mt-8">
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <AddPlugins/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddPluginsPage;
