# [Adapter.js](https://adapterjs.link/)

<img src="Adapterjs.png" alt="Adapter.js" width="200"/>

**A Chainlink external adapter for securely executing custom JavaScript**

## Overview

### How to Run the External Adapter Locally

The external adapter can be ran locally for testing by using ```npm install`` to install all dependencies and ~~~yarn start~~~ to start the adapter.  Test requests can then be sent to https://localhost:8080 using cURL or a similar HTTP request tool.  An example of a cURL request is
```curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data "{ \"id\" 0, \"data\": { \"p\": \"{\"t\":\"bytes32\",\"m\":\"get\",\"u\":\"https://www.google.com/\",\"j\":\"return response.data.slice(0,31);\"}\" } }"```

### Solution

Adapter.js seeks to solve the problems currently facing external adapters by becoming the universal external adapter.  Adapter.js can fetch data from any API or website, then securely process data using custom JavaScript provided by users.  In a Chainlink request to the external adapter, users can provide custom code as a string or reference a JavaScript file hosted on IPFS.

In addition, Adapter.js can securely access web resources which require authentication by allowing users to upload headers containing private keys to the external adapter’s database.  These custom headers are only able to be used in data requests initiated by an approved smart contract address.

Adapter.js is open source and is being developed such that any Chainlink node operator can run their own independent instance of the external adapter.  To achieve decentralization, smart contract developers can then make requests to many nodes which host an instance of the adapter.  Consensus can be reached on-chain by comparing the resulting data provided by each node.

## How to Use

Use the tool at [adapterjs.link/simulator.html](https://adapterjs.link/simulator.html) to simulate making a request to the external adapter.  Then, click *"Generate Code"* to automatically generate the required Solidity code to make the Chainlink request on-chain.  Swap out the Chainlink oracle address and job id to send the request to a different Chainlink node which hosts Adapter.js.  Check out [adapterjs.link/documentation.html](https://adapterjs.link/documentation.html) for more in-depth documentation about working with Adapter.js

## Current Status

Adapter.js is currently hosted on an independent Chainlink node for the Mumbai Polygon testnet.  However, any Chainlink node operator can host the external adapter themselves for any Chainlink-supported blockchain.  As more node operators host Adapter.js, this list will be updated.

### **Blockchain:** Mumbai
**Oracle Address:** 0x000000
- **Job ID for returning uint256:** 0x000
- **Job ID for job returning int256:** 0x000
- **Job ID for job returning bool:** 0x000
- **Job ID for job returning bytes32:** 0x000

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
