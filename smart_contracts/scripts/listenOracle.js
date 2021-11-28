const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.attach("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0");
  console.log("attached to:", oracle.address);

  // set up a listener to print events emitted by the smart contract
  let filter = { address: oracle.address };
  let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
  const listener = new Promise((resolve, reject) => provider.on(filter, async (event) => {
    console.log(event);
  }));
  listener;

  const reply2 = await oracle.getAuthorizationStatus(
    ethers.utils.getAddress("0xb1540498683a2d1962fD93Ee40755c49B19517bb"));
  console.log(reply2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
      return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });