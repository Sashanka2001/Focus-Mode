import os
import sys
from pathlib import Path

HOSTS_PATH = r"C:\Windows\System32\drivers\etc\hosts"
REDIRECT_IP = "127.0.0.1"
BLOCK_START = "# FocusMode Block Start"
BLOCK_END = "# FocusMode Block End"

# Example: Replace this with reading from your React app or a file
BLOCK_LIST_FILE = "blocked_sites.txt"

def read_block_list():
    if not Path(BLOCK_LIST_FILE).exists():
        return []
    with open(BLOCK_LIST_FILE, "r") as f:
        return [line.strip() for line in f if line.strip() and not line.startswith("#")]

def backup_hosts():
    backup_path = HOSTS_PATH + ".focusmode.bak"
    if not Path(backup_path).exists():
        with open(HOSTS_PATH, "r") as src, open(backup_path, "w") as dst:
            dst.write(src.read())
    print(f"Backup created at {backup_path}")

def restore_hosts():
    backup_path = HOSTS_PATH + ".focusmode.bak"
    if Path(backup_path).exists():
        with open(backup_path, "r") as src, open(HOSTS_PATH, "w") as dst:
            dst.write(src.read())
        os.remove(backup_path)
        print("Hosts file restored.")
    else:
        print("No backup found.")

def block_sites():
    sites = read_block_list()
    if not sites:
        print("No sites to block.")
        return
    backup_hosts()
    with open(HOSTS_PATH, "r+") as f:
        content = f.read()
        # Remove previous block
        start = content.find(BLOCK_START)
        end = content.find(BLOCK_END)
        if start != -1 and end != -1:
            content = content[:start] + content[end+len(BLOCK_END):]
        # Add new block
        block = f"\n{BLOCK_START}\n"
        for site in sites:
            block += f"{REDIRECT_IP} {site}\n"
            if not site.startswith("www."):
                block += f"{REDIRECT_IP} www.{site}\n"
        block += f"{BLOCK_END}\n"
        f.seek(0)
        f.write(content.strip() + block)
        f.truncate()
    print("Sites blocked.")

def main():
    if len(sys.argv) < 2:
        print("Usage: python block_sites.py [block|unblock]")
        return
    if sys.argv[1] == "block":
        block_sites()
    elif sys.argv[1] == "unblock":
        restore_hosts()
    else:
        print("Unknown command.")

if __name__ == "__main__":
    main()
