const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const smartContractFactory = await hre.ethers.getContractFactory("AdapterjsTest");
  const smartContract = await smartContractFactory.attach("0xA6650d2775e96D6F6b3C8249a920286180192B28");
  const result = await smartContract.js();
  console.log('js result on-chain: ', result);
}

main()
  .then(() => {
    return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });