Project implementing the Technical Test Jr. Blockchain Engineer PDF.

Files:
- 1_print_dattabot.js : solution for question 1
- 2_array_diff_function.js and server/array_diff_server.js : question 2 implementations and Express endpoint
- 3_crypto_to_idr_converter.js : question 3 converter with caching
- contracts/Bereitstellen.sol, scripts/deploy_bereitstellen.js, scripts/interact_bereitstellen.js : question 4 contract and scripts
- tests/* : Jest unit tests

Run tests:
  npm install
  npm test

Starting the server (array-diff API):
  npm start
  The server runs on PORT (default 8080). POST /array-diff accepts JSON { a: [...], b: [...] } and query impl=map|set.

Deployment (smart contract - Bereitstellen):
How to Deploy (step-by-step):
  1. Install dependencies: npm install
  2. Create a .env file (copy .env.example) and set the following values:
     - RPC_URL=<Your Sepolia RPC URL> (e.g., from Alchemy/Infura)
     - PRIVATE_KEY=<Your deployer private key> (DO NOT share this file)
  3. Run the deploy script: npm run deploy-bereitstellen
  4. After successful deployment, note the printed contract address and paste it into .env as CONTRACT_ADDRESS.

Wallet Address:
   0x04435410a78192baAfa00c72C659aD3187a2C2cF 

Deployed Contract Address:
  0x44FFC1D52d4312f5146404A2118021f1348661e6

Network:
  Recommended testnet: Sepolia
  Reason: Goerli has been deprecated in some toolchains; Sepolia is the currently recommended and active Ethereum testnet for testing deployments and mirrors mainnet behavior with lower cost and broad tooling support.

How to Change Color (interact with deployed contract):
  1. Ensure .env contains RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS
  2. Set NEW_COLOR in .env (e.g., NEW_COLOR=blue) or export it in the shell
  3. Run: node scripts/interact_bereitstellen.js
  4. The script will call setColor; it handles revert errors and prints success/failure.

Gas Estimation:
  53793

Issues Encountered:
1. Hardhat v3 incompatibility with hardhat-toolbox
   Issue: Project initially used Hardhat v3 which is incompatible with
   @nomicfoundation/hardhat-toolbox@5 and @nomicfoundation/hardhat-ethers.
   Resolution: Downgraded to Hardhat v2.22.0 which is fully supported
   by the toolbox ecosystem.

2. Deprecated @nomiclabs/hardhat-etherscan package
   Issue: hardhat.config.js imported @nomiclabs/hardhat-etherscan which
   is deprecated and caused import errors.
   Resolution: Replaced with @nomicfoundation/hardhat-toolbox which
   includes hardhat-verify internally.

Notes and Caveats:
- The contract sets the default color to "white" in the constructor and restricts setColor to the deployer address (reverts with "Can only be called by deployer").
- All solution files follow the filename conventions in the test PDF (prefix with question number).
- The crypto converter uses CoinGecko and open.er-api.com by default (no API keys required); env vars supported for hosts/keys.

Contact / Next steps:
- To deploy for real, fund the deployer account on Sepolia, set RPC_URL and PRIVATE_KEY, and run the deploy script.
- If you want, provide the RPC and a funded private key and I can run the deployment (do not share private keys in chat; use your environment locally).

Crypto UI (Question 3)
- Install & run the crypto server: npm install (if needed) && npm run start-crypto
- Default UI: http://localhost:3000 (the server uses PORT_CRYPTO; e.g. PORT_CRYPTO=3000 npm run start-crypto)
- UI: simple converter with a select (BTC, ETH, DOGE) + amount → returns JSON result and cache status
- API endpoints:
  - GET /convert?symbol=ETH&amount=1
  - POST /convert  with JSON body { "symbol": "ETH", "amount": 1 }
- Response includes: { crypto, amount, idr, cachedCrypto, cachedUsd }
  - cachedCrypto: whether the crypto->USD rate was served from the 60s server cache
  - cachedUsd: whether the USD->IDR rate was served from the 60s server cache
- Cache TTL = 60 seconds (in-memory on server)
- Env (optional): COINGECKO_HOST, COINGECKO_API_KEY, OPEN_ER_HOST, OPEN_ER_API_KEY to override hosts/keys
- Frontend file: frontend-crypto/index.html (static UI served by the crypto server)

