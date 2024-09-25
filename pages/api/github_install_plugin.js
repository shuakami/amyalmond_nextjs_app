import https from 'https';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing download URL parameter' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);

        // 检查是否是有效的 GitHub 下载链接
        if (!decodedUrl.startsWith('https://raw.githubusercontent.com/') && !decodedUrl.startsWith('https://github.com/')) {
            return res.status(400).json({ error: 'Invalid download URL' });
        }

        let downloadUrl;
        if (decodedUrl.startsWith('https://github.com/')) {
            // 将 github.com 链接转换为 raw.githubusercontent.com 格式
            const rawUrl = decodedUrl
                .replace('https://github.com/', 'https://raw.githubusercontent.com/')
                .replace('/blob/', '/');
            downloadUrl = rawUrl;
        } else {
            downloadUrl = decodedUrl;
        }

        const options = {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'User-Agent': 'nextjs-cdn-proxy',
            },
        };

        // 使用 HTTPS 直接请求下载 URL
        https.get(downloadUrl, options, (response) => {
            if (response.statusCode === 200) {
                // 设置响应头以支持文件下载
                res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment; filename=download.zip');
                res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
                res.setHeader('Content-Length', response.headers['content-length']);

                // 流式传输下载的数据给客户端
                streamPipeline(response, res).catch((error) => {
                    console.error('File streaming failed:', error);
                    res.status(500).json({ error: 'File streaming failed' });
                });
            } else {
                console.error(`Failed to fetch download link, status code: ${response.statusCode}`);
                res.status(500).json({ error: 'Failed to fetch download link' });
            }
        }).on('error', (error) => {
            console.error('Download failed:', error);
            res.status(500).json({ error: 'Download failed' });
        });

    } catch (error) {
        console.error('Download failed:', error);
        res.status(500).json({ error: 'Download failed' });
    }
}
