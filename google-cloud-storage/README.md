# [Adapter.js](https://adapterjs.link/)

## Storing Private Headers

This folder contains the code that is currently deployed and running on Google Cloud Functions that enables headers to be securely stored in in Google Cloud Storage.  These headers are then used by the external adapter when a request is made from the specified contract address for which the headers are allowed to be used.

The code doe not currently allow for concurrency when multiple users try to upload headers simultaneously.  This is currently being addressed using a Google Cloud Storage mutex and will be included in the next update.

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
