// scripts/interact_bereitstellen.js
import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import hre from 'hardhat';

const __filename = fileURLToPath(import.meta.url);

export default async function main() {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const newColor = process.env.NEW_COLOR || 'blue';
    if (!contractAddress) throw new Error('CONTRACT_ADDRESS required in env');
    const contract = await hre.ethers.getContractAt('Bereitstellen', contractAddress);
    const signer = (await hre.ethers.getSigners())[0];
    console.log('Caller address:', signer.address);
    const before = await contract.color();
    console.log('Color before:', before);
    try {
      const tx = await contract.connect(signer).setColor(newColor);
      const receipt = await tx.wait();
      console.log('Transaction mined. Gas used:', receipt.gasUsed.toString());
      const after = await contract.color();
      console.log('Color after:', after);
    } catch (err) {
      console.error('setColor reverted:', err.reason || err.message || err);
    }
  } catch (err) {
    console.error('Interaction failed:', err.message || err);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

