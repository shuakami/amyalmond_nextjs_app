import React, { useState } from 'react';
import { Database, Settings, Server, Shield, Bell } from 'lucide-react';

interface Props {
    icon: React.ComponentType<any>;
    label: string;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
}

const colorScheme = {
    bg: 'bg-blue-100 dark:bg-blue-800',
    hoverBg: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-700',
    icon: 'text-blue-600 dark:text-blue-300',
};

const Icon: React.FC<Props> = ({ icon: IconComponent, label, onMouseEnter, onMouseLeave }) => (
    <div
        className="w-8 h-8 rounded-lg cursor-pointer transition-all duration-200 relative group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <div
            className={`w-full h-full flex items-center justify-center rounded-lg ${colorScheme.bg} ${colorScheme.hoverBg}`}
        >
            <IconComponent className={`w-5 h-5 ${colorScheme.icon}`} />
        </div>
        <div className="absolute right-full -mt-1 mr-2 px-2 py-1 bg-black dark:bg-gray-800 text-white dark:text-gray-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
        </div>
    </div>
);

const FloatingIcons = () => {
    const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

    const icons = [
        { icon: Database, label: '数据库' },
        { icon: Settings, label: '配置' },
        { icon: Server, label: '服务器' },
        { icon: Shield, label: '安全' },
        { icon: Bell, label: '通知' },
    ];

    return (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            {icons.map((icon, index) => (
                <Icon
                    key={index}
                    icon={icon.icon}
                    label={icon.label}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                />
            ))}
        </div>
    );
};

export default FloatingIcons;
