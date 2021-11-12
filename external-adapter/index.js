const { Validator, Requester } = require('@chainlink/external-adapter');
const { VM, VMScript } = require('vm2');
const { Web3Storage } = require('web3.storage');
require('dotenv').config();

const createRequest = (input, callback) => {
  // validate the Chainlink request data
  const customParams = {
    returnType: true,
    javascript: false,
    ipfs: false,
    method: false,
    url: false,
    headers: false,
    data: false
  };
  const validator = new Validator(input, customParams);
  const jobRunID = validator.validated.id;
  // use provided JavaScript string or fetch JavaScript from IPFS
  const ipfsPromise = new Promise((resolve, reject) =>
    {
      if (typeof validator.validated.data.javascript === 'undefined') {
        if (typeof validator.validated.data.ipfs !== 'undefined') {
          const client = new Web3Storage({ token: process.env.WEB3STORAGETOKEN });
          client.get(validator.validated.data.ipfs)
          .then(res => (res.files())) // Web3File[]
          .then(files => {
            if (files.length === 0) {
              throw "Could not find IPFS file."
            }
            files[0].text().then(fileString => {
              console.log(fileString);
              validator.validated.data.javascript = fileString;
              resolve();
            })
          })
          .catch(err => {
            console.log("IPFS fetch error: ", err);
            return;
          });
        } else {
          callback(500, Requester.errored(jobRunID, Error(
            "The request must either contain a 'javascript' string or an 'ipfs' content ID string")));
          return;
        }
      }
    }
  );
  ipfsPromise.then(() => {
    console.log("after filegrab", validator.validated.data.javascript);
    // create the request configuration for axios
    if (typeof validator.validated.data.method !== 'undefined') {
      let config = {
        method: validator.validated.data.method,
        url: validator.validated.data.url
      };
      try {
        if (typeof validator.validated.data.headers !== 'undefined') {
          config["headers"] = JSON.parse(validator.validated.data.headers);
        }
        if (typeof validator.validated.data.data !== 'undefined') {
          config.data["data"] = JSON.parse(validator.validated.data.data);
        }
      } catch (requestBuildError) {
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
        evaluateJavaScript(jobRunID, validator.validated.data.javascript, validator.validated.data.returnType, callback, _response);
      }).catch(error => {
        callback(500, Requester.errored(jobRunID, error));
      });
    } else {
      console.log("before eval func", validator.validated.data.javascript);
      evaluateJavaScript(jobRunID, validator.validated.data.javascript, validator.validated.data.returnType, callback);
    }
  });
}

function evaluateJavaScript(jobRunID, javascript, returnType, callback, 
  response = { data: "", status: 200 }) {
  response.jobRunID = jobRunID;
  console.log("RESPONSE", response);
  let ext = {};
  const vm = new VM({
      timeout: 1000,
      sandbox: { response: response }
  });
  try {
    let script;
    try {
      script = new VMScript("(() => {" + javascript + "})();").compile();
    } catch (compileError) {
      throw ("Error compiling provided JavaScript: " + compileError + "\n" +
      compileError.stack.split("\n")[1].slice(8, compileError.stack.split("\n")[1].length-5)
      + "\n" + compileError.stack.split("\n")[2].slice(8));
    }
    try {
      let result = vm.run(script);
      console.log("SCRIPT.CODE: ", script.code);
      console.log("JAVASCRIPT RETURN: ", result);
      if (typeof response.data !== 'object') {
        console.log("not an object");
        let temp = response.data;
        response.data = { data: "string"};
        console.log("response.data: ", response.data);
        response.data.data = temp;
        console.log("Didn't fuck up")
      }
      response.data.result = result;
      console.log("response.data.result: ", response.data.result);
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
        if (typeof response.data.result !== 'bool') {
          throw "The returned value must be a bool for the specified return type of bool.";
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
}

// export for GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// Export for testing with express
module.exports.createRequest = createRequest;