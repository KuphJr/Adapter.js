const { Validator, Requester } = require('@chainlink/external-adapter');
const { VM, VMScript } = require('vm2');
const { Web3Storage } = require('web3.storage');

const createRequest = (input, callback) => {
  // validate the Chainlink request data
  const validator = new Validator(input);
  let params = JSON.parse(input.data.p);
  const jobRunID = validator.validated.id;
  // use provided JavaScript string or fetch JavaScript from IPFS
  const ipfsPromise = new Promise((resolve, reject) => {
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
              resolve();
            });
          })
          .catch(err => {
            console.log("IPFS error: ", err);
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
        resolve();
      }
    }
  );
  ipfsPromise.then(() => {
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
        if (typeof params.h !== 'undefined') {
          config["headers"] = JSON.parse(params.h);
        }
        if (typeof params.d !== 'undefined') {
          config["data"] = JSON.parse(params.d);
        }
      } catch (requestBuildError) {
        console.log("Request build error! Data provided: ", JSON.stringify(params));
        console.log(requestBuildError)
        callback(500, Requester.errored(jobRunID, requestBuildError));
        return;
      }
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
        console.log("Request error: ", error);
        callback(500, Requester.errored(jobRunID, error));
      });
    } else {
      // if no http request is made, just evaluate the javascript
      evaluateJavaScript(jobRunID, params.j, 
        params.t, callback);
    }
  });
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
      if (typeof response.data !== 'object') {
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
      case 'bool':
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
    //set JSON content type and CORS headers for the response
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //respond to CORS preflight requests
    if (req.method == 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        createRequest(req.body, (statusCode, data) => {
            res.status(statusCode).send(data)
        });
    }
};