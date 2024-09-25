// pages/api/fetchLatestRelease.js

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const apiUrl = 'https://api.github.com/repos/shuakami/amyalmond_bot/releases';

            console.log(`Fetching URL: ${apiUrl}`);

            // 使用 GitHub 个人访问令牌进行认证
            const token = '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';
            const apiResponse = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });

            console.log(`Response Status: ${apiResponse.status} ${apiResponse.statusText}`);

            if (!apiResponse.ok) {
                throw new Error(`GitHub API 请求失败，状态码: ${apiResponse.status}`);
            }

            const releases = await apiResponse.json();

            if (releases.length === 0) {
                res.status(404).json({ error: '没有找到任何发布版本' });
                return;
            }

            // 获取最新的稳定版
            const latestStableRelease = releases.find(release => !release.prerelease);
            // 获取最新的开发版
            const latestDevRelease = releases.find(release => release.prerelease);

            const updateStatus = {
                stable: latestStableRelease ? {
                    latestVersion: latestStableRelease.tag_name,
                    releaseDate: latestStableRelease.published_at,
                    releaseNotes: latestStableRelease.body,
                    downloadUrl: `/api/downloadRelease?url=${encodeURIComponent(latestStableRelease.assets[0].browser_download_url)}`,
                    type: 'Stable'
                } : null,
                development: latestDevRelease ? {
                    latestVersion: latestDevRelease.tag_name,
                    releaseDate: latestDevRelease.published_at,
                    releaseNotes: latestDevRelease.body,
                    downloadUrl: `/api/downloadRelease?url=${encodeURIComponent(latestDevRelease.assets[0].browser_download_url)}`,
                    type: 'Pre-release'
                } : null
            };

            res.status(200).json(updateStatus);
        } catch (error) {
            console.error('Error fetching GitHub release status:', error);
            res.status(500).json({ error: 'Failed to fetch GitHub release status' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
