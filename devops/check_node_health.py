import paramiko

nodes = [
    {"ip": "157.230.93.112", "pass": "MadMan12321@##**s"},
    {"ip": "167.71.199.96", "pass": "MadMan12321@##**s"}
]

with open("c:\\Users\\abdul\\Desktop\\SE\\VPN\\devops\\node_health.txt", "w") as f:
    for node in nodes:
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(node["ip"], username="root", password=node["pass"], timeout=10)
            
            # Check wg show and service status
            stdin, stdout, stderr = ssh.exec_command("wg show; systemctl is-active wg-quick@wg0")
            status = stdout.read().decode().strip()
            f.write(f"--- {node['ip']} STATUS ---\n{status}\n\n")
            
            ssh.close()
        except Exception as e:
            f.write(f"--- {node['ip']} FAILED ---\n{str(e)}\n\n")
