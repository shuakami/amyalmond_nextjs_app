import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface InstallPluginsModalProps {
    isOpen: boolean;
    onClose: () => void;
    pluginData: Record<string, any>;
}

const InstallPluginsModal: React.FC<InstallPluginsModalProps> = ({ isOpen, onClose, pluginData }) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmUninstall, setConfirmUninstall] = useState(false);
    const isLocal = pluginData.isLocal; // 是否为本地插件

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            setTimeout(() => setShow(false), 300); // 动画持续时间 300ms
        }
    }, [isOpen]);

    const handleActionClick = async () => {
        if (isLocal) {
            if (!confirmUninstall) {
                setConfirmUninstall(true); // 第一次点击，显示二次确认
                return;
            }
            // 开始卸载逻辑
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:10417/plugins/uninstall?plugin_name=${pluginData.name}`, {
                    method: 'POST',
                });
                const result = await response.json();
                alert(result.message);
                onClose();
            } catch (error) {
                console.error("Failed to uninstall plugin:", error);
                alert("Failed to uninstall plugin.");
            } finally {
                setLoading(false);
                setConfirmUninstall(false);
            }
        } else {
            // 开始安装逻辑
            setLoading(true);
            try {
                const cdnUrl = `https://bot.luoxiaohei.cn/api/github_install_plugin?url=${pluginData.zip}`;
                const response = await fetch(`http://localhost:10417/plugins/url_install?url=${cdnUrl}`, {
                    method: 'POST',
                });
                const result = await response.json();
                alert(result.message);
                onClose();
            } catch (error) {
                console.error("Failed to install plugin:", error);
                alert("Failed to install plugin.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <Card
                className={`w-full max-w-4xl mx-auto rounded-lg overflow-hidden transform transition-transform duration-300 ${
                    isOpen ? 'translate-y-0' : '-translate-y-10'
                }`}
            >
                <div className="flex flex-col md:flex-row">
                    <CardContent className="flex-1 p-6 md:border-r border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black mr-4">
                                <img
                                    src={pluginData.avatar || 'https://vercel.com/api/www/avatar?u=shuakami&s=64'}
                                    alt={pluginData.name}
                                    className="h-12 w-12 rounded-full"
                                />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">{isLocal ? "You're uninstalling" : "You're installing"}</div>
                                <h2 className="text-2xl font-semibold">{pluginData.name || 'Unknown Plugin'}</h2>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="mb-1 text-sm font-semibold">Powered by {pluginData.author || 'Unknown Author'}</h3>
                            <p className="text-sm text-gray-500">{pluginData.description || 'No description available'}</p>
                        </div>
                        <p className="mb-4 text-sm bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent rounded">
                            危险警告：机器审核通过仅供参考，具体风险需要您自行评估。
                        </p>
                        <div className="mb-4 text-sm">
                            机器人开发者以及插件仓库开发者不会承担任何因插件使用产生的任何法律问题。
                        </div>
                    </CardContent>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="flex flex-col space-y-4 text-sm mb-4">
                            <a href="#" className="flex items-center text-blue-600 hover:underline">
                                Website
                                <ExternalLink className="ml-1 h-3 w-3"/>
                            </a>
                            <a href="#" className="flex items-center text-blue-600 hover:underline">
                                Pricing
                                <ExternalLink className="ml-1 h-3 w-3"/>
                            </a>
                            <a href="#" className="flex items-center text-blue-600 hover:underline">
                                Documentation
                                <ExternalLink className="ml-1 h-3 w-3"/>
                            </a>
                        </div>
                        <div className="translate-y-7 border-t border-gray-200 pt-4">
                            <CardFooter className="flex justify-between px-0">
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button
                                    variant={isLocal ? "destructive" : "outline"}
                                    onClick={handleActionClick}
                                >
                                    {loading ? "Processing..." : isLocal ? (confirmUninstall ? "Confirm Uninstall" : "Uninstall Plugin") : "Install Plugin"}
                                </Button>
                            </CardFooter>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InstallPluginsModal;
