const crypto = require('crypto');
const { execSync } = require('child_process');


exports.generateKeys = () => {
  try {
    const privateKey = execSync('wg genkey').toString().trim();
    const publicKey = execSync(`echo ${privateKey} | wg pubkey`).toString().trim();
    return { privateKey, publicKey };
  } catch (error) {
    console.error('Error generating WireGuard keys:', error);
    throw new Error('Key generation failed');
  }
};


exports.generatePSK = () => {
  return execSync('wg genpsk').toString().trim();
};
