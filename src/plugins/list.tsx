import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion"; // 添加动画库

export default function PluginsList() {
    const [plugins, setPlugins] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [refreshCount, setRefreshCount] = useState<number>(0);
    const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

    useEffect(() => {
        fetchPlugins(currentPage);
    }, [currentPage]);

    const fetchPlugins = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/all_plugin?page=${page}`);
            const data = await response.json();
            const shuffledPlugins = data.sort(() => Math.random() - 0.5); // 随机排列插件
            setPlugins(shuffledPlugins);
            setTotalPages(Math.ceil(data.length / 15));
        } catch (error) {
            console.error("Error fetching plugins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        const currentTime = Date.now();
        if (refreshCount < 7 || currentTime - lastRefresh > 60000) {
            fetchPlugins(currentPage);
            setRefreshCount((prev) =>
                currentTime - lastRefresh > 60000 ? 1 : prev + 1
            );
            setLastRefresh(currentTime);
        } else {
            alert("1分钟内最多刷新7次，请稍后再试！");
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-xl font-bold mb-2">插件列表</h1>
            <p className="text-[#666666] mb-4 flex items-center text-sm">
                您可以添加您自己的插件，以扩展您的 AmyAlmond 机器人。
                <a href="#" className="text-black inline-flex items-center ml-1">
                    了解插件系统
                    <ExternalLink className="h-4 w-4 ml-1" />
                </a>
                <a
                    onClick={handleRefresh}
                    className="ml-4 text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
                >
                    快速刷新
                </a>
            </p>
            <div className="flex justify-between mb-4 mt-6">
                <div className="relative w-full">
                    <Search className="absolute left-2 top-4 h-4 w-4 text-[#8F8F8F] ml-1" />
                    <Input placeholder="Search integration..." className="pl-8 py-3" />
                </div>
                <Select>
                    <SelectTrigger className="w-[220px] ml-2 py-5">
                        <SelectValue placeholder="abcde" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Connectable Accounts</SelectItem>
                        <SelectItem value="anyscale">Anyscale Endpoints</SelectItem>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AnimatePresence>
                {loading ? (
                    <motion.div
                        className="text-center text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        加载中...
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>插件名称</TableCell>
                                    <TableCell>描述</TableCell>
                                    <TableCell>操作</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plugins.map((plugin) => (
                                    <TableRow key={plugin.plugin_id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <span className="mr-2 text-2xl">{plugin.logo}</span>
                                                <span className="font-medium">{plugin.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{plugin.description}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/plugins/info/${plugin.plugin_id}?PluginName=${plugin.name}`}
                                                passHref
                                            >
                                                <Button variant="outline" size="default">
                                                    Add
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-center mt-4">
                            <Select
                                onValueChange={(value) => setCurrentPage(Number(value))}
                                defaultValue={`${currentPage}`}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder={`第 ${currentPage} 页`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <SelectItem key={index} value={`${index + 1}`}>
                                            {index + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
