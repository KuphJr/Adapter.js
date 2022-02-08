# [Adapter.js](https://adapterjs.link/)

## JavaScript Sandbox Running on a Function as a Service Platform

This API creates a sandbox for executing JavaScript code on a function-as-a-service (FaaS) platform like Google Cloud Functions, AWS Lambda or Azure Functions.  It takes two parameters which are a string containing JavaScript code and a variables object which contains additional variables that can be accessed within the provided JavaScript code.  The API will then send back a reply containing value that was returned by the provided JavaScript code.

An example POST request to `faas-sandbox` is shown below.

**POST Data**
```
{
  "js": "const axios = require('axios'); const res = await axios.get(url); return res.data.id * myNum;",
  "vars": {
    "url": "https://jsonplaceholder.typicode.com/posts/2",
    "myNum": 2
  }
}
```
**Response**
```
{
  "result": 4,
  "statusCode": 200
}
```
If an error occurs when compiling or executing the provided JavaScript, the response will contain an `error` object with the error name, message and details containing the stack trace of the error.  An example error is shown below.
```
{
    "status": "errored",
    "statusCode": 200,
    "error": {
        "name": "ReferenceError",
        "message": "myNum is not defined",
        "details": "ReferenceError: myNum is not defined\n
        at module.exports (vm.js:2:1)\n
        at Object.base.apply (C:\\Users\\kuphjr\\Documents\\CL-EA-NodeJS-Template\\external-adapter\\faas-sandbox\\node_modules\\vm2\\lib/contextify.js:246:34)\n
        at Function.evaluate (C:\\Users\\kuphjr\\Documents\\CL-EA-NodeJS-Template\\external-adapter\\faas-sandbox\\Sandbox.js:21:20)\n
        at processTicksAndRejections (internal/process/task_queues.js:95:5)\n
        at async createRequest (C:\\Users\\kuphjr\\Documents\\CL-EA-NodeJS-Template\\external-adapter\\faas-sandbox\\index.js:25:14)\n
        at async C:\\Users\\kuphjr\\Documents\\CL-EA-NodeJS-Template\\external-adapter\\faas-sandbox\\app.js:27:5"
    }
}
```


## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
