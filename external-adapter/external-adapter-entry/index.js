const { AdapterError, JavaScriptError } = require('./Errors')
const { Validator } = require('./Validator')
const { IpfsFetcher } = require('./IpfsFetcher')
const { CachedDataFetcher } = require('./CachedDataFetcher')
const { Sandbox } = require('./Sandbox')
// @TODO: Comment out the line below when deploying to Google Cloud Platform
require('dotenv').config()
const process = require('process')

const createRequest = async (input, callback) => {
  console.log('INPUT', JSON.stringify(input))
  if (input.nodeKey != process.env.nodeKey) {
    callback(500,
      new AdapterError({
        jobRunID: input.id || '1',
        message: 'Incorrect nodeKey provided.'
      }).toJSONResponse())
    return
  }
  const validator = new Validator(input)
  let validatedInput
  try {
    validatedInput = validator.validateInput()
  } catch (error) {
    callback(500,
      new AdapterError({
        jobRunID: input.id || '1',
        message: `Input Validation Error: ${error.message}`
      }).toJSONResponse())
    return
  }
  // 'vars' contains the variables that will be passed to the sandbox
  const vars = {}
  // 'javascriptString' is the code which will be executed by the sandbox
  let javascriptString
  // check if any cached data should be fetched from the adapter's database
  if (validatedInput.ref) {
    let cachedData
    try {
      cachedData = await CachedDataFetcher.fetchCachedData(
        validatedInput.contractAddress, validatedInput.ref)
    } catch (error) {
      callback(500,
        new AdapterError({
          jobRunID: validatedInput.id,
          message: `Storage Fetch Error: ${error.message}`
        }).toJSONResponse())
      return
    }
    if (cachedData.js) {
      javascriptString = cachedData.js
    }
    for (const key in cachedData.vars) {
      vars[key] = cachedData.vars[key]
    }
  }
  // check if the JavaScript should be fetched from IPFS
  if (validatedInput.cid) {
    try {
      javascriptString = await IpfsFetcher
        .fetchJavaScriptString(validatedInput.cid)
    } catch (error) {
      callback(500,
        new AdapterError({
          jobRunID: validatedInput.id,
          message: `IPFS Error: ${error.message}`
        }).toJSONResponse()
      )
      return
    }
  }
  // check if the JavaScript was provided directly in the request
  if (validatedInput.js) {
    javascriptString = validatedInput.js
  }
  // check if any vars were provided directly in the request
  if (validatedInput.vars) {
    for (const key in validatedInput.vars) {
      vars[key] = validatedInput.vars[key]
    }
  }
  // 'output' contains the value returned from the user-provided code
  let output
  // execute the user-provided code in the sandbox
  try {
    output = await Sandbox.evaluate(javascriptString, vars)
  } catch (error) {
    let adapterError
    if (error.details) {
      adapterError = new JavaScriptError(error.details, {
        jobRunID: validatedInput.id,
        message: `JavaScript Error: ${error.name}: ${error.message}`
      })
    } else {
      adapterError = new AdapterError({
        jobRunID: validatedInput.id,
        message: `Sandbox Error: ${error.message}`
      })
    }
    callback(500, adapterError.toJSONResponse())
    return
  }
  let validatedOutput
  // validate the return type from the user-provided code
  try {
    validatedOutput = validator.validateOutput(output)
  } catch (error) {
    callback(500,
      new AdapterError({
        jobRunID: validatedInput.id,
        message: `Output Validation Error: ${error.message}`
      }).toJSONResponse())
    return
  }
  // return the result from the external adapter
  callback(200, {
    jobRunId: validatedInput.id,
    result: validatedOutput,
    statusCode: 200
  })
}

// Export for testing with express
module.exports.createRequest = createRequest

// Export for GCP Functions deployment
exports.gcpservice = async (req, res) => {
  // set JSON content type and CORS headers for the response
  res.header('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  // respond to CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    for (const key in req.query) {
      req.body[key] = req.query[key]
    }
    try {
      await createRequest(req.body, (statusCode, data) => {
        console.log('RESULT')
        console.log(data)
        res.status(statusCode).send(data)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
