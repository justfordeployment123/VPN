import paramiko

nodes = [
    {"ip": "157.230.93.112", "pass": "MadMan12321@##**s"},
    {"ip": "167.71.199.96", "pass": "MadMan12321@##**s"}
]

with open("c:\\Users\\abdul\\Desktop\\SE\\VPN\\devops\\keys.txt", "w") as f:
    for node in nodes:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(node["ip"], username="root", password=node["pass"])
        stdin, stdout, stderr = ssh.exec_command("cat /etc/wireguard/public.key")
        pub_key = stdout.read().decode().strip()
        f.write(f"{node['ip']}:{pub_key}\n")
        ssh.close()
