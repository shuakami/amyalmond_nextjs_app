import {UpdateIcon} from "@radix-ui/react-icons";


export default function PageHero()
{
    return (
        <section className="mx-auto flex flex-col items-start gap-3 px-4 py-6 md:py-8 lg:py-10">
            <div className="ml-0.5 flex items-center text-xs font-medium">
                <a href="/docs/changelog" className="flex items-center group">
                    <UpdateIcon className="w-3 h-3"/>
                    <span className="mx-2 h-4 w-px bg-gray-300/75 dark:bg-white/70 "></span>
                    <span className="underline-offset-4 group-hover:underline">Rebot OnLine</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 15 15" fill="none"
                         className="ml-1 h-3 w-3">
                        <path
                            d="M8.146 3.146a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L11.293 8H2.5a.5.5 0 0 1 0-1h8.793L8.146 3.854a.5.5 0 0 1 0-.708z"
                            fill="currentColor"></path>
                    </svg>
                </a>
            </div>

            <h1 className="mt-0.5 mr-0.5 text-xl font-semibold leading-tight md:text-2xl lg:text-3xl">
                欢迎使用 <a className="text-blue-500"> AmyAlmond</a>

            </h1>

            <p className="max-w-2xl text-sm font-normal leading-normal">
                您可以使用便捷工具控制您的机器人配置、监控机器人运行状态、更新数据库等。
            </p>

            <div className="flex gap-2 pt-3">
                <a href="#"
                   className="inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 bg-black text-white dark:text-white hover:bg-gray-800 h-8 rounded px-3 text-xs shadow-sm">
                    快速开始
                </a>
                <a href="#"
                   className="dark:bg-white dark:text-black inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 border border-gray-300 hover:bg-gray-100 h-8 rounded px-3 text-xs">
                    使用文档
                </a>
            </div>
        </section>
    )
}