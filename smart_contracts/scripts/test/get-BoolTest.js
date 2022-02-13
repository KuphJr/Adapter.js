const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

  // connect to a deployed instance of the smart contract
  const smartContractFactory = await hre.ethers.getContractFactory("BoolTest");

  // Make sure it is funded with LINK  
  const smartContract = await smartContractFactory.attach("0x2d95651b3307D1e09dFe9011eE2010Cf502Af076");

  const tx1 = await smartContract.bool_result();

  // const tx1 = await smartContract.boolAdapterCall2(
  //   ethers.utils.getAddress("0xAC442d76EeC61518D2112eeB67620Cbf05D6f746"), "227ca4eae6ac4654bc8b749ba034458b", ethers.BigNumber.from("10").pow(18),
  //   'return 72;', '', '', '');

  console.log(tx1)
}

main()
  .then(() => {
    return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });