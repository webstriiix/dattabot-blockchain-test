// Script to call setColor on deployed contract. Requires RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS, NEW_COLOR
const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  const rpc = process.env.RPC_URL;
  const pk = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const newColor = process.env.NEW_COLOR || 'blue';
  if (!rpc || !pk || !contractAddress) {
    console.error('RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS required');
    process.exit(1);
  }
  const abi = [
    'function setColor(string memory _yourNewColor) public',
    'function color() view returns (string)',
    'event ColorChanged(address indexed by, string color)'
  ];
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  try {
    const tx = await contract.setColor(newColor);
    await tx.wait();
    console.log('Color changed to', newColor);
  } catch (err) {
    console.error('Call failed:', err.reason || err.message || err);
  }
}

if (require.main === module) main();
module.exports = { };
