const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const smartContractFactory = await hre.ethers.getContractFactory("AdapterjsTest");
  const smartContract = await smartContractFactory.attach("0x11D5C07a18E41A20559814708d5b0EaD893bA9A2");
  const result = await smartContract.bytes32_result();
  console.log('bytes32 result on-chain: ', hre.ethers.utils.parseBytes32String(result));
}

main()
  .then(() => {
    return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });