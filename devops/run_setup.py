import paramiko
import os

nodes = [
    {"ip": "157.230.93.112", "pass": "MadMan12321@##**s"},
    {"ip": "167.71.199.96", "pass": "MadMan12321@##**s"}
]

script_path = r"c:\Users\abdul\Desktop\SE\VPN\devops\setup_node.sh"
with open(script_path, "r") as f:
    setup_script = f.read()

for node in nodes:
    print(f"Connecting to {node['ip']}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(node["ip"], username="root", password=node["pass"], timeout=30)
        
        print(f"Executing setup script on {node['ip']}...")
        stdin, stdout, stderr = ssh.exec_command(setup_script)
        
        # Stream output
        for line in stdout:
            print(f"[{node['ip']}] {line.strip()}")
        
        err = stderr.read().decode()
        if err:
            print(f"[{node['ip']}] ERROR: {err}")
            
        ssh.close()
    except Exception as e:
        print(f"Failed to setup {node['ip']}: {str(e)}")

print("Automation finished.")
