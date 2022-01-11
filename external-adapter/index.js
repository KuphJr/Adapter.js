const fs = require('fs')
const os = require('os')
const path = require('path')
const { AdapterError } = require('./Error')
const { Validator } = require('./Validator')
const { IpfsFetcher } = require('./IpfsFetcher')
const { VarFetcher } = require('./VarFetcher')
const { Sandbox } = require('./Sandbox')
require('dotenv').config()

const createRequest = async (input, callback) => {
  console.log('INPUT', JSON.stringify(input))
  const tempFilename = path.join(os.tmpdir(), 'temp')
  fs.rmdirSync(path.join(tempFilename), { recursive: true })
  fs.mkdirSync(tempFilename)
  const validator = new Validator(input)
  let validatedInput
  try {
    validatedInput = validator.validateInput()
  } catch (error) {
    callback(500,
      new AdapterError({
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
  const vars = {}
  if (validatedInput.ref) {
    let cachedVars
    try {
      cachedVars = await VarFetcher.fetchCachedVariables(
        validatedInput.contractAddress, validatedInput.ref)
    } catch (error) {
      fs.rmdirSync(path.join(tempFilename), { recursive: true })
      callback(500,
        new AdapterError({
          jobRunID: validatedInput.id,
          message: `Storage Fetch Error: ${error.message}`
        }).toJSONResponse())
      return
    }
    for (const key in cachedVars) {
      vars[key] = cachedVars[key]
    }
  }
  if (validatedInput.vars) {
    for (const key in validatedInput.vars) {
      vars[key] = validatedInput.vars[key]
    }
  }
  let output
  try {
    output = await Sandbox.evaluate(javascriptString, vars)
  } catch (error) {
    fs.rmdirSync(path.join(tempFilename), { recursive: true })
    callback(500,
      new AdapterError({
        jobRunID: validatedInput.id,
        message: `JavaScript Evaluation Error: ${error.message}`
      }).toJSONResponse())
    return
  }
  let validatedOutput
  try {
    validatedOutput = validator.validateOutput(output)
  } catch (error) {
    fs.rmdirSync(path.join(tempFilename), { recursive: true })
    callback(500,
      new AdapterError({
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
  fs.rmdirSync(path.join(tempFilename), { recursive: true })
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
  // Send response to OPTIONS requests
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
        res.status(statusCode).send(data)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
