async function main() {

    // connect to a deployed instance of the smart contract
    const smartContractFactory = await hre.ethers.getContractFactory("External_Adapter_Request_Examples");
    // @TODO: replace the address below with the current address of the deployed smart contract
    const smartContract = await smartContractFactory.attach("0x86f2ebc1a87c88Cf8158126fdbB3349d93cf08aC");
  
    // set up a listener to print events emitted by the smart contract
    let filter = { address: smartContract.address };
    let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
    const listener = new Promise((resolve, reject) => provider.on(filter, (event) => {
      console.log("EVENT:\n", event);
      // depending on the event topic, decode the emitted data and print the result
      if (event.topics.includes('0x7cc135e0cebb02c3480ae5d74d377283180a2601f8f644edf7987b009316c63a')) {
        console.log("CHAINLINK REQUEST EVENT EMITTED");
      }
      if (event.topics.includes('0x8c2992c05dc87c07311894d1f943111cba4f45bbe1fd66dce65cc5db2c834359')) {
        let hexDataSlice = event.data.slice(67, 130);
        let abiCoder = new ethers.utils.AbiCoder(["event int256AdapterReply(string name,int256 reply)"]);
        let decodedEvent = abiCoder.decode(event);
        //let decodedEvent2 = abiCoder.decode(event.data);
        //let decodedEvent = abiCoder.decode(event.data.hexSlice(32,65));
        console.log("CHAINLINK ORACLE RETURNED INT256:", parseInt(Number("0x"+hexDataSlice), 10), decodedEvent);
      }
    }));
    listener;
  
    // the arguments to an adapter call function are:
    // address of oracle contract, job ID, LINK fee, external adapter parameters
    const transaction = await smartContract.int256AdapterCall(
      ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
      "31f39ae9f4564daca341153441949248", ethers.BigNumber.from("10").pow(18),
      '{"t":"int256","j":"return -27;"}');
    console.log("CHAINLINK REQUEST:\n", transaction);
  }

  main()
  .then(() => {
    return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });