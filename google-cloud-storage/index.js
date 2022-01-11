const { VarStorage } = require('./GoogleCloudStorage')
const { Validator } = require('./Validator')

const saveVars = async (input, callback) => {
  console.log("INPUT", JSON.stringify(input));
  let validatedInput
  try {
    validatedInput = Validator.validateInput(input)
  } catch (error) {
    callback(500,
      {
        status: 'Errored',
        statusCode: 500,
        error: {
          name: 'Validation Error',
          message: 'Error validating Input: ' + error.message
        }
      })
    return
  }
  const storage = new VarStorage();
  try {
    await storage.uploadVars(validatedInput.vars,
      validatedInput.contractAddress,
      validatedInput.referenceId)
  } catch (error) {
    callback(500,
      {
        status: 'Errored',
        statusCode: 500,
        error: {
          name: 'Google Cloud Storage Upload Error',
          message: 'Google Cloud Storage Upload Error: ' + error.message
        }
      })
      return
  }
  callback(200, {
    status: 'Success',
    statusCode: 200
  })
}

// Export for testing with express
module.exports.saveVars = saveVars;

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
      await saveVars(req.body, (statusCode, data) => {
        res.status(statusCode).send(data)
      })
    } catch (error) {
      console.log(error)
    }
  }
}