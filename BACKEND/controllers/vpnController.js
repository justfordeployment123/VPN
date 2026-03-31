const Node = require('../models/Node');
const WireGuardPeer = require('../models/WireGuardPeer');
const { Client } = require('ssh2'); 


const runSshCommand = (node, command) => {
  console.log(`SSH: Connecting to ${node.ipAddress} as root...`);
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) return reject(err);
        let stdout = '';
        stream.on('close', (code, signal) => {
          conn.end();
          resolve({ code, stdout });
        }).on('data', (data) => {
          stdout += data;
        }).stderr.on('data', (data) => {
          console.error('STDERR: ' + data);
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect({
      host: node.ipAddress,
      port: 22,
      username: 'root',
      password: process.env.VPS_PASSWORD
    });
  });
};

exports.connectNode = async (req, res) => {
  const { nodeId, publicKey } = req.body;
  const userId = req.user.id;

  try {
    const node = await Node.findById(nodeId);
    if (!node) return res.status(404).json({ msg: 'Node not found' });

    
    let peer = await WireGuardPeer.findOne({ userId, nodeId });
    
    
    let internalIp;
    if (!peer) {
      const peerCount = await WireGuardPeer.countDocuments({ nodeId });
      internalIp = `10.0.0.${peerCount + 2}`; 
      
      peer = new WireGuardPeer({
        userId,
        nodeId,
        publicKey,
        internalIp
      });
    } else {
      internalIp = peer.internalIp;
    }

    
    
    const sshCommand = `wg set wg0 peer ${publicKey} allowed-ips ${internalIp}/32`;
    await runSshCommand(node, sshCommand);

    await peer.save();

    res.json({
      msg: 'Connection registry update successful',
      config: {
        address: `${internalIp}/32`,
        dns: '1.1.1.1, 8.8.8.8',
        serverPublicKey: node.publicKey,
        endpoint: `${node.ipAddress}:${node.port}`,
        mtu: 1420
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server connectivity error' });
  }
};

exports.disconnectNode = async (req, res) => {
  
  res.json({ msg: 'Disconnect logic pending' });
};
