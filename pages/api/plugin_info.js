import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = process.env.REPO_NAME || 'shuakami/bot_plugins';

// 设置缓存
const cache = new NodeCache({ stdTTL: 10, checkperiod: 30 });

export default async function handler(req, res) {
    const { pr, id, name } = req.query;

    if (!id && !name) {
        return res.status(400).json({ error: 'Missing required query parameters: id or name' });
    }

    // 缓存键
    const cacheKey = `${pr}_${id}_${name}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    try {
        let pluginInfo = {};

        if (pr) {
            // 获取 PR 信息
            const prData = await fetchPRData(pr);
            const isMerged = prData.merged;
            const hasComments = prData.comments > 0;

            let avatarUrl = null;
            let zipUrl = null;

            if (isMerged) {
                const baseUrl = `https://raw.githubusercontent.com/${REPO_NAME}/master/plugins/${name}_${id}`;
                avatarUrl = await findImageUrl(baseUrl, name, ['jpeg', 'jpg', 'png']);
                zipUrl = `${baseUrl}/${name}.zip`;
            }

            pluginInfo = {
                approved: isMerged,
                underReview: !isMerged && !hasComments,
                rejected: hasComments && !isMerged,
                avatar: await findImageUrl(`https://raw.githubusercontent.com/${REPO_NAME}/master/plugins/${id}`, name, ['jpeg', 'jpg', 'png']),
                zip: zipUrl,
            };
        } else if (id && name) {
            // 查询已上线插件信息
            const pluginUrl = `https://raw.githubusercontent.com/${REPO_NAME}/master/plugins/${id}/${name}.json`;
            const pluginResponse = await fetch(pluginUrl);

            if (!pluginResponse.ok) {
                throw new Error(`Failed to fetch plugin info from repository: ${pluginResponse.statusText}`);
            }

            const pluginData = await pluginResponse.json();
            pluginInfo = {
                plugin_id: pluginData.plugin_id,
                name: pluginData.plugin_name,
                description: pluginData.plugin_readme,
                author: pluginData.plugin_author,
                version: pluginData.plugin_version,
                approved: true,  // 默认添加 approved 参数为 true
                avatar: await findImageUrl(`https://raw.githubusercontent.com/${REPO_NAME}/master/plugins/${id}`, name, ['jpeg', 'jpg', 'png']),
                zip: `https://raw.githubusercontent.com/${REPO_NAME}/master/plugins/${id}/${name}.zip`
            };
        } else {
            return res.status(400).json({ error: 'Invalid query parameters. Please provide valid "pr" or "id" and "name".' });
        }

        // 缓存插件信息
        cache.set(cacheKey, pluginInfo);

        return res.status(200).json(pluginInfo);
    } catch (error) {
        console.error('Error fetching plugin info:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// 获取 PR 数据
async function fetchPRData(prNumber) {
    const url = `https://api.github.com/repos/${REPO_NAME}/pulls/${prNumber}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch PR data: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        merged: data.merged,
        comments: data.comments,
    };
}

// 查找可用的图片 URL
async function findImageUrl(baseUrl, name, extensions) {
    for (const ext of extensions) {
        const url = `${baseUrl}/${name}.${ext}`;
        const response = await fetch(url, { method: 'HEAD' });
        // 打印日志
        console.log(`Checking ${url}: ${response.ok ? 'Available' : 'Not Available'}`);

        if (response.ok) {
            return url;
        }
    }
    return null;
}
