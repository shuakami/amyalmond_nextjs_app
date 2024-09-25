import DashboardHome from "@/dashboard/home";
import '@/styles/globals.css'
import TopToast from "@/components/top_toast";
import Meta from "@/components/Meta";
import {ThemeProvider} from "next-themes";

export default function Dashboard() {
    return (
        <>
            <Meta pageName="控制台首页" />
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TopToast message="请注意。机器人控制台目前仍在搭建中，许多功能无法使用都是正常的。如出现问题，请提交Issue"/>
            <DashboardHome/>
            </ThemeProvider>
        </>
    )
}