// pages/api/downloadRelease.js
import https from 'https';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { url } = req.query;

        if (!url) {
            res.status(400).json({ error: '缺少下载链接参数' });
            return;
        }

        try {
            // 解码URL参数以获得原始下载链接
            const decodedUrl = decodeURIComponent(url);

            // 检查是否是有效的 GitHub 下载链接
            if (!decodedUrl.startsWith('https://github.com/shuakami/amyalmond_bot/releases/download/')) {
                res.status(400).json({ error: '无效的下载链接' });
                return;
            }

            const followRedirects = (redirectUrl, callback) => {
                https.get(redirectUrl, (response) => {
                    // 如果状态码为302，则跟踪新的location
                    if (response.statusCode === 302 && response.headers.location) {
                        followRedirects(response.headers.location, callback);
                    } else if (response.statusCode === 200) {
                        callback(null, response);
                    } else {
                        callback(new Error(`下载请求失败，状态码: ${response.statusCode}`));
                    }
                }).on('error', (error) => {
                    callback(error);
                });
            };

            followRedirects(decodedUrl, (error, response) => {
                if (error) {
                    console.error('下载失败:', error);
                    res.status(500).json({ error: '下载失败' });
                    return;
                }

                // 设置适当的响应头以支持文件下载
                res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment; filename=download.zip');
                res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
                res.setHeader('Content-Length', response.headers['content-length']);

                // 将下载的数据流式传输给客户端
                streamPipeline(response, res).catch((error) => {
                    console.error('文件流传输失败:', error);
                    res.status(500).json({ error: '文件传输失败' });
                });
            });

        } catch (error) {
            console.error('下载失败:', error);
            res.status(500).json({ error: '下载失败' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
