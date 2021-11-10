const { Validator, Requester } = require('@chainlink/external-adapter');
const { VM, VMScript } = require('vm2');

const createRequest = (input, callback) => {
  // validate the Chainlink request data
  console.log("############## Requester.test: ", Requester.test);
  const customParams = {
    javascript: true,
    returnType: true,
    method: false,
    url: false,
    headers: false,
    data: false
  };
  const validator = new Validator(input, customParams);
  
  const jobRunID = validator.validated.id;
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
    evaluateJavaScript(jobRunID, validator.validated.data.javascript, validator.validated.data.returnType, callback);
  }
}

function evaluateJavaScript(jobRunID, javascript, returnType, callback, response = "") {
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
      response.data.result = vm.run(script);
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
          throw "The returned value must be a number for the specified return type of uint256.";
        }
        break;
      case 'uint256':
        if (typeof response.data.result !== 'number') {
          throw "The returned value must be a number for the specified return type of uint256.";
        }
        if (response.data.result < 0) {
          throw "The returned value must be a positive for the specified return type of uint256.";
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
};

// export for GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
};

// Export for testing with express
module.exports.createRequest = createRequest