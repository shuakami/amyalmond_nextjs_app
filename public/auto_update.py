import os
import zipfile
import shutil
import time
import sys
import subprocess
import platform
import tempfile
import re
import logging

# 项目根目录及相关目录
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(ROOT_DIR, 'configs')
DATA_DIR = os.path.join(ROOT_DIR, 'data')
PLUGINS_CONFIG_DIR = os.path.join(CONFIG_DIR, 'plugins')
BACKUP_DIR = os.path.join(ROOT_DIR, 'update_backup')
LOG_DIR = os.path.join(ROOT_DIR, 'logs')
UPDATE_LOG_FILE = os.path.join(LOG_DIR, 'update.log')

# 必要的配置文件路径
REQUIRED_CONFIG_FILES = {
    'configs/config.yaml': 'yaml',
    'configs/secure.json': 'json',
    'configs/system-prompt.txt': 'txt',
    'data/user_names.json': 'json',
}

PLUGINS_CONFIG_FILES = {
    'configs/plugins/custom_replies.json': 'json',
    'configs/plugins/registration_replies.json': 'json',
}

# 使用正则表达式模式匹配必要的配置文件路径
protected_file_patterns = [re.compile(re.escape(path.replace('/', os.sep)) + r'$') for path in REQUIRED_CONFIG_FILES]

# 配置日志
logging.basicConfig(
    filename=UPDATE_LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def log_message(level, message):
    """将消息记录到日志文件"""
    if level == "info":
        logging.info(message)
    elif level == "warning":
        logging.warning(message)
    elif level == "error":
        logging.error(message)
    elif level == "critical":
        logging.critical(message)
    print(message)  # 在控制台输出

def kill_related_processes():
    """终止可能占用文件权限的所有相关进程，避免终止自身进程"""
    current_os = platform.system()
    current_pid = os.getpid()
    try:
        if current_os == "Windows":
            tasklist_output = subprocess.check_output(["tasklist", "/FI", "IMAGENAME eq python.exe"], text=True)
            for line in tasklist_output.splitlines():
                if "python.exe" in line:
                    parts = line.split()
                    pid = int(parts[1])
                    if pid != current_pid:
                        subprocess.call(["taskkill", "/PID", str(pid), "/F"])
        elif current_os in ["Linux", "Darwin"]:
            pgrep_output = subprocess.check_output(["pgrep", "-f", "python"], text=True)
            for pid in pgrep_output.splitlines():
                if int(pid) != current_pid:
                    subprocess.call(["kill", "-9", pid])
        log_message("info", "所有相关进程已结束（当前更新脚本除外）。")
    except Exception as e:
        log_message("error", f"终止进程时出错: {e}")

def backup_files():
    """备份关键配置文件到备份目录"""
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    for file_path in REQUIRED_CONFIG_FILES:
        full_path = os.path.join(ROOT_DIR, file_path)
        if os.path.exists(full_path):
            backup_path = os.path.join(BACKUP_DIR, os.path.basename(file_path))
            shutil.copy2(full_path, backup_path)
            log_message("info", f"备份文件: {file_path} 到 {backup_path}")
        else:
            log_message("warning", f"预期的配置文件 {file_path} 不存在，跳过备份。")

def extract_zip(zip_path):
    """解压缩zip文件到临时目录"""
    try:
        temp_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        log_message("info", f"解压缩文件: {zip_path} 到临时目录 {temp_dir}")
        return temp_dir
    except Exception as e:
        log_message("error", f"解压缩文件 {zip_path} 时出错: {e}")
        return None

def is_protected_file(file_path):
    """检查文件路径是否属于必要的配置文件"""
    return any(pattern.search(file_path) for pattern in protected_file_patterns)

def update_all_files(temp_dir):
    """更新所有文件，避免替换必要的配置文件"""
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            src_path = os.path.join(root, file)
            rel_path = os.path.relpath(src_path, temp_dir).replace('/', os.sep)
            dest_path = os.path.join(ROOT_DIR, rel_path)
            if is_protected_file(rel_path):
                log_message("info", f"保护必要的配置文件不被替换: {rel_path}")
                continue
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(src_path, dest_path)
            log_message("info", f"更新文件: {rel_path}")

def update_dependencies():
    """更新项目的Python依赖"""
    requirements_path = os.path.join(ROOT_DIR, 'requirements.txt')
    if os.path.exists(requirements_path):
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_path])
            log_message("info", "Python依赖已更新。")
        except subprocess.CalledProcessError as e:
            log_message("error", f"更新依赖时出错: {e}")
    else:
        log_message("warning", "未找到 requirements.txt，跳过依赖更新。")

def main(zip_path):
    """主函数，执行更新流程"""
    if not os.path.isfile(zip_path):
        log_message("error", f"压缩包 {zip_path} 不存在。")
        return
    kill_related_processes()
    backup_files()
    temp_dir = extract_zip(zip_path)
    if temp_dir:
        update_all_files(temp_dir)
        update_dependencies()
        log_message("info", "更新完成。")
    else:
        log_message("error", "更新失败：无法解压缩文件。")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使用方法: python auto_update.py <path_to_update_zip>")
    else:
        zip_path = sys.argv[1]
        main(zip_path)
