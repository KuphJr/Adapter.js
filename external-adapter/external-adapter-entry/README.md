# [Adapter.js](https://adapterjs.link/)

## Adapter.js Entry

This is the entry point into Adapter.js and is the endpoint to which the Chainlink external adapter bridge should point.  See examples of valid Adapter.js requests below.

```
{
  "type": "uint",
  "js": "const axios = require('axios'); const response = await axios.get(url); return response.data.id",
  "vars": {
    "url": "https://jsonplaceholder.typicode.com/posts/1"
  }
}
```

```
{
  "type": "int256",
  "nodeKey": "PRIVATE_UNIQUE_CHAINLINK_NODE_KEY_HERE",
  "contractAddress": "0x_CONTRACT_ADDRESS_HERE",
  "ref": "REFERENCE_ID_HERE",
  "js": "const axios = require('axios'); const response = await axios.get(privateURLvariable); return response.data.id"
  "
}
```

```
{
  "type": "bytes32",
  "nodeKey": "PRIVATE_UNIQUE_CHAINLINK_NODE_KEY_HERE",
  "contractAddress": "0x_CONTRACT_ADDRESS_HERE",
  "ref": "REFERENCE_ID_HERE",
  "cid": "bafybeiazsjwhvu26p56hibhee72wyyg25jvqsgzrzvjskordb4ku4jrlq4"
  "
}
```

### Request Parameters

* **type** *(Required)*
    - This is the Solidity type that should be returned on-chain.  The options are `bool`, `uint`/`uint256`, `int`/`int256`, `bytes32`, `string` or `bytes`.

* **js** *(Optional)*
- This the the JavaScript code which is executed and can be provided directly in a request as a string.  The returned value is what is returned on-chain.  This parameter cannot be provided if `cid` is already provided.

* **cid** *(Optional)*
    - This is the IPFS content ID for JavaScript code which has been uploaded to IPFS.  The external adapter will fetch and execute the uploaded .js file and provide it with any variables specified in the 'vars' object or any cached variables stored in the external adapter's database.  This parameter cannot be provided if `js` is already provided.

* **vars** *(Optional)*
    - This is an object containg variables which can be used in the JavaScript code that is executed.  It can either be a JSON object or a JSON object string which will automatically be converted into a JSON object.  Variables provided directly in a request take precedence over cached variables stored in the external adapter's database.

* **id** *(Optional)*
    - This is the Chainlink job ID.  If it is not provided, it is set to 1 by default.

* **nodeKey** *(Required in order to access cached variables or JavaScript stored in the external adapter's database)*
    - This is a unique private variable used to verify that a request has been initiated by an authorized Chainlink node.  It is needed to verify that the specified contract address is the one that initiated the request and is authorized to used any cached variables or JavaScript.

* **contractAddress** *(Required in order to access cached variables or JavaScript stored in the external adapter's database)*
    - This is the address of the contract which initiated the on-chain request.  It is used to look up any cached variables or JavaScript to use when processing a request.  Only the contract which has been authorized can use a particular set of cached variable or JavaScript.

* **ref** *(Required in order to access cached variables or JavaScript stored in the external adapter's database)*
    - This is a reference ID which is a unique string of 32 alphanumerical characters or less that is used to look up the cached variables or JavaScript code in the external adapter's database and use them in a request.  Data stored with a particular reference ID is immutable, so once it is stored it cannot be changed.  To change the cached JavaScript code or variables used in a request, a new set of variables and JavaScript must be stored in the external adapter's database using a new reference ID.

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
