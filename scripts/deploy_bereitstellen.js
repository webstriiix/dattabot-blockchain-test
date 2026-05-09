// scripts/deploy_bereitstellen.js
// Deploy Bereitstellen using Hardhat runtime (ESM)
import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import hre from 'hardhat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log('Deployer address:', deployer.address);
    const factory = await hre.ethers.getContractFactory('Bereitstellen');
    const deployTx = factory.getDeployTransaction();
    const estimate = await hre.ethers.provider.estimateGas(deployTx);
    console.log('Gas estimate (wei):', estimate.toString());

    console.log('Deploying contract...');
    const contract = await factory.deploy();
    await contract.deploymentTransaction().wait();
    const address = contract.target || contract.address || contract.deployTransaction?.contractAddress;
    console.log('Deployed at:', address);
    console.log('Default color:', await contract.color());
    // Export address instruction
    console.log('\nAfter deployment, add CONTRACT_ADDRESS to your .env or use it for verification.');
  } catch (err) {
    console.error('Deployment failed:', err.message || err);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

