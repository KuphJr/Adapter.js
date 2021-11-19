
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const contractfactory = await hre.ethers.getContractFactory("GeneratedCodeTest");
    const contract = await contractfactory.attach("0xd5530A99b11458cAaECD6DB6F65473D953d14c8D");

    console.log("Attached to:", contract.address);

    // set up listener to print the 'result' variable from the contract
    let filter = { address: contract.address };
    let provider = new ethers.providers.JsonRpcProvider(
        "https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
    let eventCount = 0;
    const listener = new Promise((resolve, reject) =>
        provider.on(filter, async (event) => {
            let result = await contract.result();
            console.log("Value of 'result' in contract:", result);
            eventCount++;
            if (eventCount > 1) {
                process.exit(0);
            }
        }));
    listener;
    await contract.request();
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