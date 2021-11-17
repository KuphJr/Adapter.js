const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

  // connect to a deployed instance of the smart contract
  const smartContractFactory = await hre.ethers.getContractFactory("External_Adapter_Request_Examples");
  // @TODO: replace the address below with the current address of the deployed smart contract
  const smartContract = await smartContractFactory.attach("0x55967EFA86fc115Fb25a232BBF785A11D998f064");

  // set up a listener to print events emitted by the smart contract
  let filter = { address: smartContract.address };
  let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
  (new Promise((resolve, reject) => provider.on(filter, (event) => {
    console.log("SMART CONTRACT EVENT EMITTED:\n", event);
  })))();

  const transaction = await AdapterJS.int256CallAdapter(
    ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
    "c37e2e03f1de4012b1a4c8a6a0c19ea2", ethers.BigNumber.from("10").pow(18),
    '{"t":"int256","j":"return 8;"}');
  console.log("CHAINLINK REQUEST:\n", transaction);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
