# [Adapter.js](https://adapterjs.link/)

## Adapter.js External Adapter

Adapter.js is composed of 3 different components which all must be deployed to a serverless function-as-a-service (FaaS) platform such as Google Cloud Functions, AWS Lambda or Azure Functions.

### External Adapter Entry

The first component, `external-adapter-entry`, is the entry point into the external adapter.  This is the API to which the Chainlink bridge will point.  It is responsible for validating input data, fetching cached JavaScript code from IPFS and fetching private variables and JavaScripte code from the external adapter's database.  It then sends a request to the `faas-sandbox` component which handles the execution of the user-provided code.

### FaaS Sandbox

The `faas-sandbox` component executes the user-provided code and is kept in seperate from the `external-adapter-entry` component for security.  Since Adapter.js executes untrusted user code, the execution of the code must be isolated from the `external-adapter-entry` component which fetches private variables.  This fully ensures that even if malicious code breaks the sandbox in which it is executed, it does not have access to any private variables belonging to other users.

### Database Uploader

The `database-uploader` component allows users to upload private variables and JavaScript code to the external adapter's database.  When uploading variables and code, users provide the address of a their contract as well as a unique reference ID string which is used to reference the cached variables and code.  These private variables and code can then be used in an on-chain request that is initiated by the authorized contract and contains the specified reference ID.  This enables users to keep certain variables, such as API keys, or proprietary JavaScript code, private by uploading the code to the external adapter's database prior to initiating an on-chain request.

## Instructions for Running Adapter.js Locally

Please node, running Adapter.js locally IS NOT SECURE and should never be used to process public requests.  Adapter.js is designed to be deployed to FaaS architecture only.  However, launch Adapter.js locally for testing reasons, run the command `npm run setup` in this directory.  It will automatically install the dependencies for each component.  Then run `npm run start` to launch all the required components of the external adapter.

To make a test request, send a POST request to http://localhost:8080/.  Example post requests can be found in `./external-adapter-entry/README.md`.

## Installation Instructions

### Google Cloud Functions

Coming soon!

### AWS Lambda

Coming soon!

### Azure Functions

Coming soon!

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
