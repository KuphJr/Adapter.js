# [Adapter.js](https://adapterjs.link/)

## Storing Private JavaScript and Variables

This folder contains the API which enables JavaScript code and variables to be securely stored in the external adapter's database. The JavaScript code and private variables are then fetched and used when an authorized contract sends a request to the external adapter.

To interact with this API, send a POST request with data in the following format.   

```
{
  "contractAddress": "0xAUTHORIZED_CONTRACT_ADDRESS_HERE",
  "ref": "UniqueReferenceStringHere",
  "vars": {
    "myNum": 100,
    "myString": "https://jsonplaceholder.typicode.com/posts/1",
    "myArray": [ 0, 1, 2 ],
    "myObject": {
      "key": 1
  },
  "js": "const axios = require('axios'); const res = await axios.get(myString); const id = res.data.id; return id * myNum;"
  }
}
```

Please note that the `ref` parameter must be a unique string and once it is used the data stored using this reference ID cannot be overwritten.  The reference ID can only contain alphanumerical characters and must be less than or equal to 32 characters in length.

The `vars` parameter is optional and contains an object whose keys correspond the the variable names which can be referenced in the user-provided JavaScript code when it is executed.  If any matching variables are provided directly in an on-chain request, the values specified in the on-chain request will be used instead of the variable values provided here.

The `js` parameter is optional and contains the JavaScript code which will be executed.  If JavaScript code or an IPFS CID is provided directly in an on-chain request, the JavaScript code specified in the on-chain request will be used instead of the JavaScript code provided here.

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
