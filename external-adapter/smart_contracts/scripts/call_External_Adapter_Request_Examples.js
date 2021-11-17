const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

  // connect to a deployed instance of the smart contract
  const smartContractFactory = await hre.ethers.getContractFactory("External_Adapter_Request_Examples");
  // @TODO: replace the address below with the current address of the deployed smart contract
  const smartContract = await smartContractFactory.attach("0x86f2ebc1a87c88Cf8158126fdbB3349d93cf08aC");

  // set up a listener to print events emitted by the smart contract
  let abiCoder = new ethers.utils.AbiCoder([ "event int256AdapterReply(string name,int256 reply)" ]);
  //let eventInterface = new ethers.utils.Interface(eventABI);
  let filter = { address: smartContract.address };
  let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
  const listener = new Promise((resolve, reject) => provider.on(filter, (event) => {
    console.log("EVENT:\n", event);
    try {
      let decodedEvent = abiCoder.decode(['int256'], event.data.hexSlice(32,65) );
      console.log("SMART CONTRACT EVENT EMITTED:\n", decodedEvent);
    } catch (e) {
      console.log(e);
    }
  }));
  listener;

  // the arguments to an adapter call function are:
  // address of oracle contract, job ID, LINK fee, external adapter parameters
  const transaction = await smartContract.int256AdapterCall(
    ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
    "9578062150174e92be32f6b842f9ce48", ethers.BigNumber.from("10").pow(18),
    '{"t":"int256","j":"return 8;"}');
  console.log("CHAINLINK REQUEST:\n", transaction);
}
// int:
//9d8c783d-0b96-4595-8697-b880fd823137
// uint: 
// "fe689d57-5d90-4580-b454-415399713c01"
// bool:
// "ae5142ab-2b67-44b7-990e-4ceb6589b52b"
// bytes32
// 1302aee4-e860-4b36-830c-801e613d8082

main()
  .then(() => {
    return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
