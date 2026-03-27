import paramiko

nodes = [
    {"ip": "157.230.93.112", "pass": "MadMan12321@##**s"},
    {"ip": "167.71.199.96", "pass": "MadMan12321@##**s"}
]

for node in nodes:
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(node["ip"], username="root", password=node["pass"], timeout=10)
        
        stdin, stdout, stderr = ssh.exec_command("cat /etc/wireguard/public.key")
        pub_key = stdout.read().decode().strip()
        print(f"NODE {node['ip']} PUBLIC_KEY: {pub_key}")
        
        ssh.close()
    except Exception as e:
        print(f"Failed to get key from {node['ip']}: {str(e)}")
