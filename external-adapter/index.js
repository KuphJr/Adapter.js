const fs = require('fs')
const process = require('process')
const { AdapterError } = require('./Error')
const { Validator } = require('./Validator')
const { IpfsFetcher } = require('./IpfsFetcher')
const { VarFetcher } = require('./VarFetcher')
const { Sandbox } = require('./Sandbox')
require('dotenv').config()

/*
//below is the definition of the 'input' variable for the 'createRequest' function
interface input = {
  id: number;
  type: string; // type is either int256/int, uint256/uint, bytes32, bool, address, string or bytes
  // either js or cid must be specified, but not both
  js?: string;
  cid?: string;
  vars?: string; // variables to be passed to the VM environment
  ref?: string; // unique reference to cached variables stored in the exteral adapter's database
}
*/

const createRequest = (input, callback) => {
  console.log('INPUT', JSON.stringify(input))
  clearTmpDirectory()
  const validator = new Validator(input)
  let validatedInput
  try {
    validatedInput = validator.validateInput()
  } catch (error) {
    callback(500,
      AdapterError({
        jobRunID: input.id || 1,
        message: `Input Validation Error: ${error.message}`
      }).toJSONResponse())
    return
  }
  let javascriptString
  if (validatedInput.js) {
    javascriptString = validatedInput.js
  } else {
  try {
    javascriptString = IpfsFetcher
      .fetchJavaScriptString(validatedInput.cid)
      .then(result => result)
  } catch (error) {
    callback(500,
      AdapterError({
        jobRunID: validatedInput.id,
        message: `IPFS Error: ${error.message}`
      }).toJSONResponse()
    )
    return
  }
  const vars = {}
  if (validatedInput.ref) {
    const cachedVars = VarFetcher(validatedInput.contractAddress, validatedInput.ref)
      .then(result => result)
      .catch(error => {
        clearTmpDirectory()
        callback(500,
          AdapterError({
            jobRunID: validatedInput.id,
            message: `Storage Fetch Error: ${error.message}`
          }).toJSONResponse()
        )
        process.exit(1)
      })
    for (const key in cachedVars) {
      vars[key] = cachedVars[key]
    }
  }
  if (validatedInput.vars) {
    for (const key in validatedInput.vars) {
      vars[key] = validatedInput.vars[key]
    }
  }
  const output = Sandbox.evaluate(javascriptString, vars)
    .then(result => result)
    .catch(error => {
      clearTmpDirectory()
      callback(500,
        AdapterError({
          jobRunID: validatedInput.id,
          message: `JavaScript Evaluation Error: ${error.message}`
        }).toJSONResponse()
      )
      process.exit(1)
    })
  let validatedOutput
  try {
    validatedOutput = validator.validatedOutput(output)
  } catch (error) {
    callback(500,
      AdapterError({
        jobRunID: validatedInput.id,
        message: `Output Validation Error: ${error.message}`
      }).toJSONResponse())
    return
  }
  callback(200, {
    jobRunId: validatedInput.id,
    result: validatedOutput,
    statusCode: 200
  })
  clearTmpDirectory()
}

const clearTmpDirectory = () => {
  const files = fs.readdirSync('/tmp')
  files.forEach(file => {
    fs.unlinkSync(file)
  })
}

// Export for testing with express
module.exports.createRequest = createRequest

// Export for GCP Functions deployment
// exports.gcpservice = (req, res) => {
//   // set JSON content type and CORS headers for the response
//   res.header('Content-Type', 'application/json')
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'Content-Type')

//   // respond to CORS preflight requests
//   if (req.method === 'OPTIONS') {
//   // Send response to OPTIONS requests
//     res.set('Access-Control-Allow-Methods', 'GET')
//     res.set('Access-Control-Allow-Headers', 'Content-Type')
//     res.set('Access-Control-Max-Age', '3600')
//     res.status(204).send('')
//   } else {
//     createRequest(req.body, (statusCode, data) => {
//       res.status(statusCode).send(data)
//     })
//   }
// }
