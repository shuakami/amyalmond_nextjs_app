import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = process.env.REPO_NAME || 'shuakami/bot_plugins';
const CACHE_TTL = 30; // 缓存时间为30秒
const PER_PAGE = 15; // 每页加载的插件数

// 设置缓存
const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 60 });

export default async function handler(req, res) {
    const { page = 1 } = req.query; // 支持分页参数，默认为第一页
    const cacheKey = `all_plugins_page_${page}`;

    // 检查缓存
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    try {
        // 获取插件列表目录
        const plugins = await fetchPluginsFromGithub(page);
        cache.set(cacheKey, plugins); // 缓存插件列表数据
        return res.status(200).json(plugins);
    } catch (error) {
        console.error('Error fetching plugins:', error);
        return res.status(500).json({ error: 'Failed to fetch plugins.' });
    }
}

// 获取插件列表目录
async function fetchPluginsFromGithub(page) {
    const url = `https://api.github.com/repos/${REPO_NAME}/contents/plugins?per_page=${PER_PAGE}&page=${page}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch plugin directory: ${response.statusText}`);
    }

    const pluginDirectories = await response.json();
    const pluginDataPromises = pluginDirectories
        .filter((dir) => dir.type === 'dir')
        .map(async (dir) => fetchPluginDetails(dir.name));

    const pluginData = await Promise.all(pluginDataPromises);
    return pluginData.filter(Boolean); // 过滤掉任何无效或未成功的请求
}

// 获取单个插件的详细信息
async function fetchPluginDetails(pluginId) {
    try {
        const baseUrl = `https://raw.githubusercontent.com/${REPO_NAME}/master/plugins/${pluginId}`;
        const jsonUrl = `${baseUrl}/${pluginId.split('_')[0]}.json`;

        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch plugin JSON: ${response.statusText}`);
        }

        const pluginInfo = await response.json();
        const avatarUrl = await findImageUrl(baseUrl, pluginId.split('_')[0], ['jpeg', 'jpg', 'png']);
        const zipUrl = `${baseUrl}/${pluginId.split('_')[0]}.zip`;

        return {
            plugin_id: pluginInfo.plugin_id[0] || pluginInfo.plugin_id || '无UUID',
            name: pluginInfo.plugin_name[0] || pluginInfo.plugin_name || '未知插件',
            author: pluginInfo.plugin_author[0] || pluginInfo.plugin_author || '未知作者',
            version: pluginInfo.plugin_version[0] || pluginInfo.plugin_version || '1.0.0',
            avatar: avatarUrl,
            zip: zipUrl,
            approved: true
        };
    } catch (error) {
        console.error(`Error fetching details for plugin ${pluginId}:`, error);
        return null; // 如果获取某个插件失败，返回null
    }
}

// 查找可用的图片 URL
async function findImageUrl(baseUrl, name, extensions) {
    for (const ext of extensions) {
        const url = `${baseUrl}/${name}.${ext}`;
        const response = await fetch(url, { method: 'HEAD' });

        // 日志
        console.log(`Checking ${url}: ${response.ok ? 'Available' : 'Not Available'}`);

        if (response.ok) {
            return url;
        }
    }
    return null;
}
