const { Requester, Validator } = require('@chainlink/external-adapter')
const VM = require('vm');
//const Buffer = require('buffer');

// Define custom error scenarios for the API.
// Return true for the adapter to retry.

// NOT NEEDED

// const customError = (data) => {
//   if (data.Response === 'Error') return true
//   return false
// }

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  javascript: true,
  returnType: true,
  method: false,
  url: false,
  headers: false,
  data: false
}

const createRequest = (input, callback) => {
  // validate the Chainlink request data
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
  try {
    const context = { response: response };
    VM.createContext(context);
    let script;
    try {
      script = new VM.Script("(() => {" + javascript + "})();");
    } catch (compileError) {
      throw ("Error compiling provided JavaScript: " + compileError + "\n" +
      compileError.stack.split("\n")[1].slice(8, compileError.stack.split("\n")[1].length-5)
      + "\n" + compileError.stack.split("\n")[2].slice(8));
    }
    try {
      response.data.result = script.runInContext(context, { timeout: 1000 });
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
          throw "The returned value is not a number but the specified return type is int256.";
        }
        break;
      case 'uint256':
        if (typeof response.data.result !== 'number') {
          throw "The returned value is not a number but the specified return type is uint256.";
        }
        if (response.data.result < 0) {
          throw "The returned value is negative but the specified return type is uint256.";
        }
        break;
      case 'bool':
        if (typeof response.data.result !== 'bool') {
          throw "The returned value is not a bool but the specified return type is bool.";
        }
        break;
      case 'string':
        if (typeof response.data.result !== 'string') {
          throw "The returned value is not a string but the specified return type is string.";
        }
        break;
      // @TODO: BYTES NEEDS TO BE REWORKED!!!
      case 'bytes32':
        let buf32 = Buffer.alloc(32);
        buf32.write(response.data.result);
        response.data.result = buf32;
        if (response.data.result > 32) {
          throw "The returned value is larger than 32 bytes but the specified return type is bytes32."
        }
        break;
      case 'bytes':
        response.data.result = Buffer.from(response.data.result);
        break;
      default:
        throw ("Invalid return type specified: " + returnType);
    }
    callback(response.status, Requester.success(jobRunID, response));
  } catch (evalError) {
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