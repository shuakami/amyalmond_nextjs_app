// 解析大模型返回内容的工具函数
export default function parseModelResponse(response: string): { plugin_code: string; plugin_config: string } {
    // 使用正则表达式匹配包含 Python 插件代码的块
    const codeRegex = /plugin_code\s*=\s*"""\s*python\s*([\s\S]*?)\s*"""/i;
    // 使用正则表达式匹配包含 YAML 插件配置的块
    const yamlRegex = /plugin_config\s*=\s*"""\s*yaml\s*([\s\S]*?)\s*"""/i;

    let pluginCode = '';
    let pluginConfig = '';

    // 提取 Python 插件代码
    const codeMatch = codeRegex.exec(response);
    if (codeMatch) {
        pluginCode = codeMatch[1].trim(); // 获取代码内容
    }

    // 提取 YAML 插件配置
    const yamlMatch = yamlRegex.exec(response);
    if (yamlMatch) {
        pluginConfig = yamlMatch[1].trim(); // 获取配置文件内容
    }

    // 如果未通过标准格式匹配到，尝试从字典格式的回复中提取
    if (!pluginCode || !pluginConfig) {
        try {
            const jsonResponse = JSON.parse(response);
            pluginCode = jsonResponse.plugin_code || '';
            pluginConfig = jsonResponse.plugin_config || '';
        } catch (error) {
            console.error('无法解析为 JSON:', error);
        }
    }

    // 如果仍然没有获取到所需的内容，尝试使用更宽松的正则表达式匹配所有代码块
    if (!pluginCode) {
        const fallbackCodeRegex = /```python\s*([\s\S]*?)```/i;
        const fallbackCodeMatch = fallbackCodeRegex.exec(response);
        if (fallbackCodeMatch) {
            pluginCode = fallbackCodeMatch[1].trim();
        }
    }

    if (!pluginConfig) {
        const fallbackYamlRegex = /```yaml\s*([\s\S]*?)```/i;
        const fallbackYamlMatch = fallbackYamlRegex.exec(response);
        if (fallbackYamlMatch) {
            pluginConfig = fallbackYamlMatch[1].trim();
        }
    }

    return { plugin_code: pluginCode, plugin_config: pluginConfig };
}
