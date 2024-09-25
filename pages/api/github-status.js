export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const apiUrl = 'https://api.github.com/repos/shuakami/amyalmond_bot/releases';

            console.log(`Fetching URL: ${apiUrl}`);

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

            // 获取最新的版本，不管是否是预发布版本
            const latestRelease = releases[0];

            const updateStatus = {
                latestVersion: latestRelease.tag_name,
                releaseDate: latestRelease.published_at,
                releaseNotes: latestRelease.body,
                downloadUrl: latestRelease.html_url,
                type: latestRelease.prerelease ? 'Pre-release' : 'Stable'
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