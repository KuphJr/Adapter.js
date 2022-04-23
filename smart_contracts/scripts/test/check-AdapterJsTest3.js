const hre = require("hardhat");

async function main() {

  // connect to a deployed instance of the smart contract
  const smartContractFactory = await hre.ethers.getContractFactory("AdapterJsTest3");

  // Make sure it is funded with LINK  
  const smartContract = await smartContractFactory.attach('0x8a21D3cF49e32b6a2530beB4911b28e58579815b');

  const tx1 = await smartContract.stringResult();

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