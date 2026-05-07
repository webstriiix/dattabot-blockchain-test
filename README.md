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

Deployment:
  Set RPC_URL and PRIVATE_KEY in env and run: npm run deploy-bereitstellen
