# [Adapter.js](https://adapterjs.link/)

<img src="Adapterjs.png" alt="Adapter.js" width="200"/>

**A Chainlink external adapter for securely executing custom JavaScript**

## Overview

### Problem

Chainlink external adapters are extremely powerful, but have some limitations.

Setting up an external adapter is time consuming.  Developers must first create and host the adapter, then either operate a Chainlink node themselves, or get another node operator to create a  new bridge and job for the adapter.

Additionally, for data received from an external adapter to be truly decentralized, separate instances of the adapter must be hosted on multiple independent Chainlink nodes.  This requires smart contract developers to contact many node operators each time they want to create an external adapter with new functionality and achieve decentralization.

### Solution

Adapter.js seeks to solve the problems currently facing external adapters by becoming the universal external adapter.  Adapter.js can fetch data from any API or website, then securely process data using custom JavaScript provided by users.  In a Chainlink request to the external adapter, users can provide custom code as a string or reference a JavaScript file hosted on IPFS.

In addition, Adapter.js can securely access web resources which require authentication by allowing users to upload headers containing private keys to the external adapter’s database.  These custom headers are only able to be used in data requests initiated by an approved smart contract address.

Adapter.js is open source and is being developed such that any Chainlink node operator can run their own independent instance of the external adapter.  To achieve decentralization, smart contract developers can then make requests to many nodes which host an instance of the adapter.  Consensus can be reached on-chain by comparing the resulting data provided by each node.

## How to Use

Use the tool at [adapterjs.link/simulator.html](https://adapterjs.link/simulator.html) to simulate making a request to the external adapter.  Then, click *"Generate Code"* to automatically generate the required Solidity code to make the Chainlink request on-chain.  Swap out the Chainlink oracle address and job id to send the request to a different Chainlink node which hosts Adapter.js.  Check out [adapterjs.link/documentation.html](https://adapterjs.link/documentation.html) for more in-depth documentation about working with Adapter.js

## Current Status

Adapter.js is currently hosted on an independent Chainlink node for the Mumbai Polygon testnet.  However, any Chainlink node operator can host the external adapter themselves for any Chainlink-supported blockchain.  As more node operators host Adapter.js, this list will be updated.

### **Blockchain:** Mumbai
**Oracle Address:** 0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0
- **Job ID for returning uint256:** 9d8c783d0b9645958697b880fd823137
- **Job ID for job returning int256:** fe689d575d904580b454415399713c01
- **Job ID for job returning bool:** 84a2d337e80c4f61bab7aff465666adc
- **Job ID for job returning bytes32:** 1302aee4e8604b36830c801e613d8082

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
