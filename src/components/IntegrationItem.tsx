// src/components/IntegrationItem.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faChartBar, faDatabase } from '@fortawesome/free-solid-svg-icons';

interface IntegrationItemProps {
    logo: 'wrench' | 'chart-bar' | 'database'; // 定义可接受的图标名称
    name: string;
    description: string;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ logo, name, description }) => {
    const iconMap = {
        wrench: faWrench,
        'chart-bar': faChartBar,
        database: faDatabase,
    };

    return (
        <div className="flex items-center p-4 rounded-lg transition-colors">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 mr-4">
                <FontAwesomeIcon icon={iconMap[logo]} className="text-blue-600 text-sm" />
            </div>
            <div>
                <h3 className="text-sm font-semibold">{name}</h3>
                <p className="text-gray-600 dark:text-white/40 text-sm">{description}</p>
            </div>
        </div>
    );
};

export default IntegrationItem;
