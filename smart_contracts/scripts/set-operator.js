const hre = require("hardhat");

async function main() {
  const Operator = await hre.ethers.getContractFactory("Operator");
  const operator = await Operator.attach("0xc59f15046e6ea016dC639CB45A59227dfF525530");

  await operator.setAuthorizedSenders(["0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"]);
  //await operator.setAuthorizedSendersOn(["0x8Bd4f9CA1136828DF6bcbf7E00049e46208C2c10"], ["0x8Bd4f9CA1136828DF6bcbf7E00049e46208C2c10"]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });