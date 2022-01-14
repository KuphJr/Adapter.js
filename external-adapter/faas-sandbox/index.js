const { Validator } = require('./Validator')
const { Sandbox } = require('./Sandbox')
const { JavaScriptError } = require('./Error')

const createRequest = async (input, callback) => {
  console.log('INPUT', JSON.stringify(input))
  let validatedInput
  try {
    validatedInput = Validator.validateInput(input)
  } catch (error) {
    callback(500, {
      status: 500,
      statusCode: 'errored',
      error: {
        name: 'InputValidationError: ',
        message: `${error.message}`
      }
    })
    return
  }
  // 'output' contains the value returned from the user-provided code
  let output
  // execute the user-provided code in the sandbox
  try {
    output = await Sandbox.evaluate(validatedInput.js, validatedInput.vars)
  } catch (error) {
    const javascriptError = new JavaScriptError({
      name: error.name,
      message: error.message,
      details: error.stack
    })
    callback(500, javascriptError.toJSONResponse())
    return
  }
  let validatedOutput
  // validate the return type from the user-provided code
  try {
    validatedOutput = Validator.validateOutput(output)
  } catch (error) {
    callback(500, {
      status: 500,
      statusCode: 'errored',
      error: {
        name: 'OutputValidationError: ',
        message: `${error.message}`
      }
    })
    return
  }
  // return the result from the external adapter
  callback(200, {
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
        res.status(statusCode).send(data)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
