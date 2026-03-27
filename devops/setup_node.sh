#!/bin/bash
set -e

echo "Starting Sentinel Node Setup..."

# Update and install
apt-get update
apt-get install -y wireguard ufw qrencode

# Enable IP Forwarding
echo "net.ipv4.ip_forward=1" > /etc/sysctl.d/99-wireguard.conf
sysctl -p /etc/sysctl.d/99-wireguard.conf

# Generate Keys if not exist
if [ ! -f /etc/wireguard/private.key ]; then
    wg genkey | tee /etc/wireguard/private.key | wg pubkey > /etc/wireguard/public.key
    chmod 600 /etc/wireguard/private.key
fi

PRIV_KEY=$(cat /etc/wireguard/private.key)
PUB_KEY=$(cat /etc/wireguard/public.key)

# Configure Interface
cat > /etc/wireguard/wg0.conf <<EOF
[Interface]
PrivateKey = $PRIV_KEY
Address = 10.0.0.1/24
ListenPort = 51820
SaveConfig = true

PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
EOF

# Setup Firewall
ufw allow 51820/udp
ufw allow ssh
yes | ufw enable

# Start Service
systemctl enable wg-quick@wg0
systemctl restart wg-quick@wg0

echo "Setup Complete!"
echo "PUBLIC_KEY=$PUB_KEY"
