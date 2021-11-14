
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.attach("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0");
  console.log("oracle deployed to:", oracle.address);
  const reply = await oracle.setFulfillmentPermission(
      ethers.utils.getAddress("0xf5D34A1E76A8514828528b67D6Ba8913823A96cA"),
      true);
  console.log(reply);
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