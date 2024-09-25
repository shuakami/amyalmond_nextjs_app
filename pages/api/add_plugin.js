import { Octokit } from "octokit";
import formidable from "formidable";
import fs from "fs";
import { promisify } from "util";

// 禁用 Next.js 自动解析 body
export const config = {
    api: {
        bodyParser: false,
    },
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = "shuakami/bot_plugins";

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

const readFileAsync = promisify(fs.readFile);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // 使用 formidable 解析 multipart/form-data
    const form = formidable({
        multiples: true, // 如果多个文件一起上传,这个属性是必须的
        keepExtensions: true, // 保持文件扩展名
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return res.status(500).json({ error: "Failed to parse form data" });
        }

        console.log("Parsed fields:", fields);
        console.log("Parsed files:", files);

        const {
            plugin_id,
            plugin_name,
            plugin_author,
            plugin_version,
            plugin_readme,
            checksum,
        } = fields;

        if (!checksum) {
            console.error("Checksum is empty:", checksum);
            return res.status(400).json({ error: "Checksum is missing or invalid." });
        }

        // 由于 formidable 解析的文件是数组形式,需要从数组中提取第一个元素
        const pluginAvatar = files.plugin_avatar ? files.plugin_avatar[0] : null;
        const pluginZip = files.plugin_zip ? files.plugin_zip[0] : null;

        // 检查文件路径是否存在
        if (!pluginAvatar || !pluginZip || !pluginAvatar.filepath || !pluginZip.filepath) {
            console.error("File paths not found:", { pluginAvatar, pluginZip });
            return res.status(400).json({ error: "File upload failed, missing file paths." });
        }

        try {
            const pluginFolderPath = `plugins/${plugin_id}/`;

            // Step 1: 获取仓库的默认分支
            const { data: repoData } = await octokit.rest.repos.get({
                owner: REPO_NAME.split("/")[0],
                repo: REPO_NAME.split("/")[1],
            });
            const defaultBranch = repoData.default_branch;

            // Step 2: 获取默认分支的最新提交 SHA
            const { data: { object: { sha: baseSha } } } = await octokit.request(`GET /repos/${REPO_NAME}/git/refs/heads/${defaultBranch}`);

            // Step 3: 创建新的分支
            const branchName = `add-plugin-${plugin_id}`;
            await octokit.request(`POST /repos/${REPO_NAME}/git/refs`, {
                ref: `refs/heads/${branchName}`,
                sha: baseSha,
            });

            // Step 4: 并行准备要提交的文件
            const [zipContent, avatarContent] = await Promise.all([
                readFileAsync(pluginZip.filepath),
                readFileAsync(pluginAvatar.filepath)
            ]);

            const jsonContent = JSON.stringify({
                plugin_id,
                plugin_name,
                plugin_author,
                plugin_readme,
                plugin_version,
            });

            const checksumContent = checksum; // 确保 checksum 是一个字符串

            const [zipBlob, avatarBlob, jsonBlob, checksumBlob] = await Promise.all([
                octokit.rest.git.createBlob({
                    owner: REPO_NAME.split("/")[0],
                    repo: REPO_NAME.split("/")[1],
                    content: zipContent.toString("base64"),
                    encoding: "base64",
                }),
                octokit.rest.git.createBlob({
                    owner: REPO_NAME.split("/")[0],
                    repo: REPO_NAME.split("/")[1],
                    content: avatarContent.toString("base64"),
                    encoding: "base64",
                }),
                octokit.rest.git.createBlob({
                    owner: REPO_NAME.split("/")[0],
                    repo: REPO_NAME.split("/")[1],
                    content: Buffer.from(jsonContent).toString("base64"),
                    encoding: "base64",
                }),
                octokit.rest.git.createBlob({
                    owner: REPO_NAME.split("/")[0],
                    repo: REPO_NAME.split("/")[1],
                    content: Buffer.from(checksumContent, 'utf-8').toString("base64"), // 确保 checksum 被转换为正确的 Base64 编码
                    encoding: "base64",
                }),
            ]);

            const filesToCommit = [
                {
                    path: `${pluginFolderPath}${plugin_name}.zip`,
                    mode: "100644",
                    type: "blob",
                    sha: zipBlob.data.sha,
                },
                {
                    path: `${pluginFolderPath}${plugin_name}.json`,
                    mode: "100644",
                    type: "blob",
                    sha: jsonBlob.data.sha,
                },
                {
                    path: `${pluginFolderPath}checksum.txt`,
                    mode: "100644",
                    type: "blob",
                    sha: checksumBlob.data.sha,
                },
                {
                    path: `${pluginFolderPath}${plugin_name}.${pluginAvatar.mimetype.split("/")[1]}`,
                    mode: "100644",
                    type: "blob",
                    sha: avatarBlob.data.sha,
                },
            ];

            // Step 5: 创建 tree 并提交
            const { data: tree } = await octokit.rest.git.createTree({
                owner: REPO_NAME.split("/")[0],
                repo: REPO_NAME.split("/")[1],
                base_tree: baseSha,
                tree: filesToCommit,
            });

            const commitMessage = `Added new plugin: ${plugin_name}`;
            const { data: commit } = await octokit.rest.git.createCommit({
                owner: REPO_NAME.split("/")[0],
                repo: REPO_NAME.split("/")[1],
                message: commitMessage,
                tree: tree.sha,
                parents: [baseSha],
            });

            // Step 6: 更新 refs 到新提交
            await octokit.rest.git.updateRef({
                owner: REPO_NAME.split("/")[0],
                repo: REPO_NAME.split("/")[1],
                ref: `heads/${branchName}`,
                sha: commit.sha,
            });

            // Step 7: 创建 PR
            const { data: pr } = await octokit.rest.pulls.create({
                owner: REPO_NAME.split("/")[0],
                repo: REPO_NAME.split("/")[1],
                title: `Add plugin: ${plugin_name}`,
                head: branchName,
                base: defaultBranch,
                body: `This PR adds a new plugin: ${plugin_name}`,
            });

            // Step 8: 返回 PR 编号
            res.status(200).json({
                status: "success",
                pr_number: pr.number,
            });
        } catch (error) {
            console.error("Error processing plugin:", error);
            res.status(500).json({ error: "Failed to create plugin PR" });
        }
    });
}
