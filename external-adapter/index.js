const { Validator, Requester } = require('@chainlink/external-adapter');
const { VM, VMScript } = require('vm2');
const { Web3Storage } = require('web3.storage');
const fs = require('fs');
const {Storage} = require('@google-cloud/storage');
require('dotenv').config();

const createRequest = (input, callback) => {
  console.log("INPUT", JSON.stringify(input));
  // validate the Chainlink request data
  const validator = new Validator(input);
  let params = JSON.parse(input.data.p);
  const jobRunID = validator.validated.id;
  // check if cached headers should be used in the HTTP request

  async function getHeaders () {
    if (typeof params.r !== 'undefined') {
      if (typeof params.h !== 'undefined') {
        constheadersError = new Error("Cannot use both a cached header and a direct header");
        console.log("Cannot use both a cached header and a direct header");
        callback(500, Requester.errored(jobRunID, authError));
        return;
      }
      // TODO: CHANGE KEY NAME
      if (input.k === process.env.CHAINLINK_NODE_KEY) {
        console.log("key matches key from CL node");
        // download the file containing cached keys from Google Cloud Storage
        const storage = new Storage({keyFilename: 'key.json'});
        const destFileName = "/tmp/cachedHeaders.json";
        const bucketName = "cached_headers";
        async function getCachedHeader() {
          const options = {
            destination: destFileName,
          };
        
          // download the file
          await storage.bucket(bucketName).file('cachedHeaders.json').download(options);
          console.log(
            `gs://${bucketName}/cachedHeaders.json downloaded to ${destFileName}.`
          );
          let cachedHeaders = JSON.parse(fs.readFileSync('/tmp/cachedHeaders.json').toString());
          let foundHeaders = false;
          console.log("input.meta.oracleRequest.requester: ", input.meta.oracleRequest.requester);
          console.log("params.r", params.r);
          for (const header of cachedHeaders) {
            console.log("header.authContractAddr:", header.authContractAddr);
            console.log("header.authKey:", header.authKey);
            if (header.authContractAddr === input.meta.oracleRequest.requester
                && header.authKey === params.r) {
                  params.h = header.headers;
                  foundHeaders = true;
                  break;
            }
          }
          if (foundHeaders) {
            console.log("retrieved headers", params.h);
          } else {
            throw "Could not find cached headers";
          }
        }
        getCachedHeader()
        .catch((err) => {
          console.log(err.message);
          callback(500, Requester.errored(jobRunID, err));
          return;
        });
      } else {
        const authError = new Error("The Chainlink node access key is incorrect");
        console.log("The Chainlink node access key is incorrect");
        callback(500, Requester.errored(jobRunID, authError));
        return;
      } 
      return;
    }
  }


  // use provided JavaScript string or fetch JavaScript from IPFS
  async function getIPFS () {
    if (typeof params.j === 'undefined') {
      if (typeof params.i !== 'undefined') {
        const client = new Web3Storage(
          { token: process.env.WEB3STORAGETOKEN }
        );
        // get file from IPFS using Web3.Storage
        client.get(params.i)
        .then(res => (res.files())) // Web3File[]
        .then(files => {
          if (files.length === 0) {
            throw "Could not find IPFS file."
          }
          // if multiple files are sent, only use the first one
          files[0].text().then(fileString => {
            // save content from fetched Web3 file to the javascript field
            params.j = fileString;
            return;
          });
        })
        .catch(err => {
          console.log("IPFS error: ", err.message);
          callback(500, Requester.errored(jobRunID, err));
          return;
        });
      } else {
        console.log("Input data error: No 'javascript' string or 'ipfs' content ID string provided.");
        callback(500, Requester.errored(jobRunID, Error(
          "No 'javascript' string or 'ipfs' content ID string provided.")));
        return;
      }
    } else {
      if (typeof params.i !== 'undefined') {
        console.log("Both a 'javascript' string and an 'ipfs' content ID string were provided.");
        callback(500, Requester.errored(jobRunID, Error(
          "Both a 'javascript' string and an 'ipfs' content ID string were provided.")));
        return;
      }
      return;
    }
  }

  function makeRequest () {
    // create the config object for axios
    // to perform the http request
    let config;
    if (typeof params.m !== 'undefined') {
      if (typeof params.u != 'undefined') {
        config = {
          method: params.m,
          url: params.u
        };
      } else {
        console.log("An HTTP request method was given but no URL was provided.");
        callback(500, Requester.errored(jobRunID, Error(
          "An HTTP request method was given but no URL was provided.")));
        return;
      }
      try {
        console.log("!!!!!!!!!!!!!params.h")
        if (typeof params.h !== 'undefined') {
          console.log("setting config.headers with params.h", params.h);
          config["headers"] = params.h;
        }
        if (typeof params.d !== 'undefined') {
          config["data"] = params.d;
        }
      } catch (requestBuildError) {
        console.log("Request build error! Data provided: ", JSON.stringify(params), requestBuildError.message);
        callback(500, Requester.errored(jobRunID, requestBuildError));
        return;
      }
      console.log("REQUEST MADE WITH HEADERS:", config.headers);
      Requester.request(config).then(response => {
        const _response = { 
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        };
        // send the response to the axios http request
        // to the function which evaluates the provided javascript code
        evaluateJavaScript(jobRunID, params.j, 
          params.t, callback, _response);
      }).catch(error => {
        console.log("Request error: ", error.message);
        callback(500, Requester.errored(jobRunID, error));
      });
    } else {
      // if no http request is made, just evaluate the javascript
      evaluateJavaScript(jobRunID, params.j, 
        params.t, callback);
    }
  }

  getHeaders()
  .then(() => getIPFS())
  .then(() => makeRequest());
}

// this function evaluates the provided javascript using the VM2 sandbox
function evaluateJavaScript(jobRunID, javascript, returnType, callback, 
  response = { data: "", status: 200 }) {
  response.jobRunID = jobRunID;
  delete response.headers;
  console.log("!!!!!!!!!!response: ", response);
  const vm = new VM({
      timeout: 1000,
      sandbox: { response: response }
  });
  try {
    let script;
    try {
      // create the script to be executed by the VM
      script = new VMScript("(() => {" + javascript + "})();").compile();
    } catch (compileError) {
      // save and send back a relevent error message to the user
      throw ("Error compiling provided JavaScript: " + compileError + "\n" +
        compileError.stack.split("\n")[1]
        .slice(8, compileError.stack.split("\n")[1].length-5) +
        "\n" + compileError.stack.split("\n")[2].slice(8));
    }
    try {
      // securely evaluate the javascript
      let result = vm.run(script);
      if (typeof response.data === 'string') {
        // if the fetched data was not a JSON object,
        // convert it to an object so the response can be
        // processed by the Chainlink node
        // (ie: if typeof response.data === 'string')
        let responseData = response.data;
        response.data = { data: responseData };
      }
      // add the result to the response object
      response.data.result = result;
    } catch (runScriptError) {
      throw ("Error evaluating provided JavaScript: " + runScriptError);
    }
    if (typeof response.data.result === 'undefined') {
      throw ("Error evaluating provided JavaScript: No value was returned");
    }
    // validate resulting data
    switch (returnType) {
      case 'int256':
        if (typeof response.data.result !== 'number') {
          throw "The returned value must be a number for the specified return type of int256.";
        } if (response.data.result % 1 != 0) {
          throw "The returned value must be a whole number for the specified return type of int256.";
        }
        break;
      case 'uint256':
        if (typeof response.data.result !== 'number') {
          throw "The returned value must be a number for the specified return type of uint256.";
        }
        if (response.data.result < 0) {
          throw "The returned value must be positive for the specified return type of uint256.";
        }
        if (response.data.result % 1 != 0) {
          throw "The returned value must be a whole number for the specified return type of uint256.";
        }
        break;
      case 'boolean':
        if (typeof response.data.result !== 'boolean') {
          throw "The returned value must be a boolean for the specified return type of bool.";
        }
        break;
      case 'bytes32':
        if (typeof response.data.result !== 'string') {
          throw "The returned value must be a string for the specified return type of bytes32.";
        }
        if (response.data.result.length > 32) {
          throw "The returned string is larger than 32 bytes but the specified return type is bytes32.";
        }
        break;
      default:
        throw ("Invalid return type specified: " + returnType);
    }
    callback(response.status, Requester.success(jobRunID, response));
  } catch (evalError) {
    console.log(evalError);
    callback(500, Requester.errored(jobRunID, evalError));
  }
};

// export for GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
};

// Export for testing with express
module.exports.createRequest = createRequest;