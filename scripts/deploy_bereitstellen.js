// Deployment script for Bereitstellen contract using ethers.js and solc
// Requires environment variables: RPC_URL, PRIVATE_KEY

const fs = require('fs');
const solc = require('solc');
const { ethers } = require('ethers');

async function main() {
  const rpc = process.env.RPC_URL;
  const pk = process.env.PRIVATE_KEY;
  if (!rpc || !pk) {
    console.error('RPC_URL and PRIVATE_KEY environment variables are required to deploy');
    process.exit(1);
  }
  const source = fs.readFileSync('contracts/Bereitstellen.sol', 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'Bereitstellen.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    for (const e of output.errors) {
      console.error(e.formattedMessage);
    }
    if (output.errors.some(e => e.severity === 'error')) process.exit(1);
  }
  const contractFile = output.contracts['Bereitstellen.sol']['Bereitstellen'];
  const abi = contractFile.abi;
  const bytecode = contractFile.evm.bytecode.object;

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log('Estimating gas for deployment...');
  const deployTx = await factory.getDeployTransaction();
  const estimate = await provider.estimateGas({ ...deployTx, from: wallet.address });
  console.log('Gas estimate (wei):', estimate.toString());

  console.log('Deploying contract...');
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log('Deployed at:', contract.target);
  console.log('Use scripts/interact_bereitstellen.js to call setColor');
}

if (require.main === module) main();
module.exports = { };
