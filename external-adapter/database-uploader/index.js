const CryptoJS = require('crypto-js');
const { DataStorage } = require('./LocalStorage')
const { Validator } = require('./Validator')

const createRequest = async (input, hashedNodeKey, callback) => {
  console.log("INPUT", JSON.stringify(input));
  // check if the node key in the request is valid
  if (!input.nodeKey || hashedNodeKey != CryptoJS.SHA256(input.nodeKey).toString()) {
    callback(500, {
      status: 'errored',
      statusCode: 500,
      error: {
        name: 'Invalid nodeKey',
        message: 'Invalid nodeKey provided'
      }
    })
  }
  let validatedInput
  try {
    validatedInput = Validator.validateInput(input)
  } catch (error) {
    callback(500, {
      status: 'errored',
      statusCode: 500,
      error: {
        name: 'Validation Error',
        message: 'Error validating Input: ' + error.message
      }
    })
    return
  }
  const storage = new DataStorage();
  try {
    await storage.storeData(validatedInput)
  } catch (error) {
    callback(500, {
      status: 'errored',
      statusCode: 500,
      error: {
        name: 'Storage Error',
        message: 'Storage Error: ' + error.message
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
