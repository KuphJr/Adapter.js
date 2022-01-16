const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const smartContractFactory = await hre.ethers.getContractFactory("AdapterjsTest");
  const smartContract = await smartContractFactory.attach("0x9aEeC82f0eb4Bc78B8c90588a0561b756D2e76b8");
  const result = await smartContract.getInt();
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