const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

function isJSON(data) {
  var ret = true;
  try {
     JSON.parse(data);
  }catch(e) {
     ret = false;
  }
  return ret;
}

// takes an inputString representing a RegExp and returns and
// instance of that regular expression
// ie: "/ab+c/i" => new RegExp("ab+c", "i")
function convertToRegExp(inputString) {
  let lastSlash = inputString.lastIndexOf("/");
  let flags = inputString.slice(lastSlash+1);
  let literalString = inputString.slice(1, lastSlash);
  //literalString = literalString.replace(/\\/g, "\\\\");
  if (flags.length > 0) {
    return new RegExp(literalString, flags);
  } else {
    return new RegExp(literalString);
  }
}


// takes an inputString and returns an int with the index
// on the end of the string or -1 if no index is detected
// ie: "split(",")[2] => 2
// ie: "split(",") => -1
function getEndIndex(inputString) {
  if (inputString[inputString.length-1] === "]") {
    lastParenIndex = inputString.lastIndexOf(")");
    lastBracketIndex = inputString.lastIndexOf("[");
    if (lastParenIndex === -1 || lastBracketIndex === -1 || lastBracketIndex < lastParenIndex) {
      throw " has bracket or parenthesis mismatch.";
    } else {
      let index = parseInt(inputString.slice(lastBracketIndex+1, inputString.length-1));
      if (Number.isNaN(index) || index < 0) {
        throw " has an invalid index number."
      }
      return index;
    }
  } else {
    return -1;
  }
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input);
  const jobRunID = validator.validated.id;
  input.data = JSON.parse(input.data);

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get' 
  // headers = 'headers.....'
  // const config = {
  //   method: input.data.method,
  //   url: input.data.url,
  //   headers: input.data.headers,
  //   params: input.data.params,
  //   data: input.data.data
  // };

  // create the request configuration for axios
  let config = {
    method: input.data.method,
    url: input.data.url,
  }
  if ("headers" in input.data && Object.keys(input.data.headers).length !== 0) {
    config["headers"] = input.data.headers;
  }
  if ("data" in input.data && Object.keys(input.data.data).length !== 0) {
    config["data"] = input.data.data;
  };

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      //response.data.result = Requester.validateResultNumber(response.data, [tsyms])
      let result = response.data;
      
      input.data.functions.forEach(method => {
        console.log("RESULT: ", typeof result, result);
        console.log("METHOD: '", method, "'");
        try {
          if (method.slice(0, 12) === "toLowerCase(") {
            if (typeof result !== "string") {
              result = JSON.stringify(result);
            }
            result = result.toLowerCase();
          } else if (method.slice(0, 12) === "toUpperCase(") {
            if (typeof result !== "string") {
              result = JSON.stringify(result);
            }
            result = result.toUpperCase();
          } else if (method.slice(0, 6) === "slice(") {
            result = slice(method, result);
          } else if (method.slice(0, 6) === "split(") {
            result = split(method, result);
          } else if (method.slice(0, 6) === "match(") {
            result = match(method, result);
          } else if (method.slice(0, 7) === "search(") {
            result = search(method, result);
          } else if (method.slice(0, 8) === "replace(") {
            result = replace(method, result);
            console.log(result);
          } else if (method.slice(0, 5) === "path(") {
            let keys = method.slice(5, method.length-1).split(".");
            keys.forEach(key => {
              try{
                result = result[key];
              }
              catch(jsonErr) {
                throw "has invalid json path for requested object";
              }
            })
            if (typeof result !== "string") {
              result = JSON.stringify(result);
            }
          } else if (method.slice(0, 9) === "multiply(") {
            let arg = parseInt(method.slice(9, method.length-1));
            result = (arg * parseInt(result)).toString();
          } else {
            throw "is an invalid method. Supported methods are path, multiply, match, replace, search, split, slice, toLowerCase, toUpperCase"
          }
        }
        catch(err) {
          callback(500, Requester.errored(jobRunID, "Error evaluating method: " + method + " " + err));
          return;
        }
      });
      if (typeof response.data !== "string") {
        if (Array.isArray(result)) {
          response.data.result = result;
        } else if (typeof result === "string") {
          response.data.result = [result];
        } else if (typeof result === "number") {
          response.data.result = [result.toString()];
        } else {// only other possible type is JSON
          response.data.result = [JSON.stringify(result)];
        }
        callback(response.status, Requester.success(jobRunID, response))
      } else {
        if (Array.isArray(result)) {
          result = result;
        } else if (typeof result === "string") {
          result = [result];
        } else if (typeof result === "number") {
          response.data.result = [result.toString()];
        } else {// only other possible type is JSON
          result = [JSON.stringify(result)];
        }
        callback(response.status, Requester.success(jobRunID, {data: {result: result, data: response.data}, status: "success"}))
      }
      
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
};

function match(method, result) {
  if (typeof result !== "string") {
    result = JSON.stringify(result);
  }
  if (method[6] === "/") {
    let lastParenIndex = method.lastIndexOf(")");
    let arg = method.slice(6, lastParenIndex);
    let regexp = convertToRegExp(arg);
    let endIndex = getEndIndex(method);
    (endIndex >= 0) ? result = result.match(regexp)[endIndex] : result = result.match(regexp);
  } else if (method[6] === "'") {
    let lastParenIndex = method.lastIndexOf(")");
    let arg = method.slice(7, lastParenIndex-1);
    let endIndex = getEndIndex(method);
    (endIndex >= 0) ? result = result.match(arg)[endIndex] : result = result.match(arg);
  } else {
    throw "has invalid arguments.";
  }
  return result;
};

function replace(method, result) {
  console.log("!!!!!!!method: ", method, "!!!!!!!result: ", result);
  if (typeof result !== "string") {
    result = JSON.stringify(result);
  }
  if (method[8] === "/") {
    let openingQuoteIndex = -1;
    if (method[method.length-2] === "'") {
      for (let i = method.lastIndexOf("'")-1; i > 10; i--) {
        if (method[i] === "'" && (method[i-1] !== "\\")) {
          openingQuoteIndex = i;
          break;
        }
      }
    } else {
      throw "has invalid arguments.";
    }
    if (openingQuoteIndex === "-1") {
      throw "has invalid arguments.";
    }
    let arg2 = method.slice(openingQuoteIndex + 1, method.length-2);
    // remove any whitespace ie: "/arg1/g, " => "/arg1/g,"
    let arg1 = method.slice(8, openingQuoteIndex - 1).trimEnd();
    // remove comma ie: "/arg1/g," => "/arg1/g"
    arg1 = arg1.slice(0, arg1.length-1);
    let regexp = convertToRegExp(arg1);
    return result.replace(regexp, arg2);
  } else if (method[8] === "'") {
    let openingQuoteIndex = -1;
    if (method[method.length-2] === "'") {
      for (let i = method.lastIndexOf("'")-1; i > 10; i--) {
        if (method[i] === "'" && (method[i-1] !== "\\")) {
          openingQuoteIndex = i;
          break;
        }
      }
    }else {
      throw "has invalid arguments.";
    }
    if (openingQuoteIndex === "-1") {
      throw "has invalid arguments.";
    }
    let arg2 = method.slice(openingQuoteIndex + 1, method.length-2);
    // remove any whitespace ie: "'arg1/g', " => "'/arg1/g',"
    let arg1 = method.slice(8, openingQuoteIndex - 1).trimEnd();
    // remove comma ie: "'/arg1/g'" => "'/arg1/g'"
    arg1 = arg1.slice(1, arg1.length-2);
    return result.replace(arg1, arg2);
  }
};

function search(method, result) {
  if (typeof result !== "string") {
    result = JSON.stringify(result);
  }
  if (method[7] === "/") {
    let arg = method.slice(7, method.length-1);
    let regexp = convertToRegExp(arg);
    result = result.search(regexp).toString();
  } else if (method[7] === "'") {
    let arg = method.slice(8, method.length-2);
    result = result.search(arg).toString();
  } else {
    throw "has invalid arguments.";
  }
  return result;
};

function split(method, result) {
  if (typeof result !== "string") {
    result = JSON.stringify(result);
  }
  let endIndex = getEndIndex(method);
  if (method[6] === "'") {
    let lastIndex = method.lastIndexOf("'");
    let arg1 = method.slice(7, lastIndex);
    let rest = method.slice(lastIndex+1).replace(/ /g, "");
    if (rest[0] === ")") {
      (endIndex >= 0) ? result = result.split(arg1)[endIndex] : result = result.split(arg1);
    } if (rest[0] === ",") {
      let lastParenIndex = rest.lastIndexOf(")");
      let arg2 = parseInt(rest.slice(1, lastParenIndex));
      (endIndex >= 0) ? result = result.split(arg1, arg2)[endIndex] : result = result.split(arg1, arg2);
    }
  } else if (method[6] === '/') {
    let lastCommaIndex = method.lastIndexOf(',');
    if (lastCommaIndex === -1) {
      let lastParenIndex = method.lastIndexOf(")");
      let regexp = convertToRegExp(method.slice(6, lastParenIndex));
      (endIndex >= 0) ? result = result.split(regexp)[endIndex] : result = result.split(regexp);
    } else {
      let lastSlashIndex = method.lastIndexOf("/");
      if (lastSlashIndex < lastCommaIndex) {
        let arg1 = method.slice(8, lastCommaIndex);
        let lastParenIndex = method.lastIndexOf(")");
        let arg2 = parseInt(method.slice(lastCommaIndex+1, lastParenIndex).replace(/ /g, ""));
        let regexp = convertToRegExp(arg1);
        let endIndex = getEndIndex(method);
        (endIndex >= 0) ? result = result.split(regexp, arg2)[index] : result = result.split(regexp, arg2);
      } else {
        let lastParenIndex = method.lastIndexOf(")");
        let regexp = convertToRegExp(method.slice(7, lastParenIndex));
        (endIndex >= 0) ? result = result.split(regexp)[index] : result = result.split(regexp);
      }
    }
  } else {
    throw "has invalid arguments.";
  }
  return result;
}

function slice(method, result) {
  if (typeof result !== "string") {
    result = JSON.stringify(result);
  }
  let args = method.slice(6, method.length-1);
  args = args.replace(/ /g, "");
  args = args.split(",");
  if (args.length === 2) {
    result = result.slice(parseInt(args[0]), parseInt(args[1]));
  } else if (args.length === 1) {
    result = result.slice(parseInt(args[0]));
  } else {
    throw "has invalid arguments.";
  }
  return result;
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
};

module.exports.createRequest = createRequest;