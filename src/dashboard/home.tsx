import LoadingPage from "@/components/loading";
import RobotSideNav from "@/dashboard/sidenav";
import ChatList from "@/dashboard/chat/list";
import PageHero from "@/dashboard/pagehero";
import { MessagesLineChart } from "@/dashboard/bot/messages_line";
import Po_1 from "@/dashboard/bot/po_1";
import Po_2 from "@/dashboard/bot/po_2";
import QuickAccessCard from "@/dashboard/bot/quick_card";
import QuickAccessToolbar from "@/dashboard/bot/tool_bar";

const DashboardHome = () => {
    return (
        <div className="flex">
            {/* 左侧边栏 */}
            <RobotSideNav />

            {/* 内容区域 */}
            <div className="flex-1 p-4">
                {/* 添加 container 类来控制两侧空白的宽度 */}
                <div className="container mx-auto px-4 lg:px-4 xl:px-8 2xl:px-12">
                    {/* 页面标题 */}
                    <PageHero />

                    {/* 主体内容 */}
                    <div className="mt-6 flex flex-wrap gap-6 2xl:gap-6">
                        {/* 图表区域 */}
                        <MessagesLineChart />

                        {/* 其他组件区域 */}
                        <div className="flex flex-col gap-4 w-full md:w-1/3 lg:w-2/5 xl:w-80 2xl:1/2">
                            <Po_2 />
                            <Po_1 />
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:1/2">
                            <QuickAccessCard />
                        </div>

                        <div className="hidden lg:block lg:w-1/5 xl:w-1/6 2xl:1/2">
                            <QuickAccessToolbar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
