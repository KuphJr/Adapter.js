class AdapterError extends Error {
  constructor ({
    jobRunID = '1',
    status = 'errored',
    statusCode = 500,
    name = 'AdapterError',
    message = 'An error occurred.'
  }) {
    super(message)
    Error.captureStackTrace(this, AdapterError)

    this.jobRunID = jobRunID
    this.status = status
    this.statusCode = statusCode
    this.name = name
    this.message = message
  }

  toJSONResponse () {
    return {
      jobRunID: this.jobRunID,
      status: this.status,
      statusCode: this.statusCode,
      error: { name: this.name, message: this.message }
    }
  }
}

class JavaScriptError extends AdapterError {
  constructor (details, adapterErrorObject) {
    super(adapterErrorObject)

    this.details = details
  }
  toJSONResponse () {
    return {
      jobRunID: this.jobRunID,
      status: this.status,
      statusCode: this.statusCode,
      error: { name: this.name, message: this.message, details: this.details }
    }
  }
}

module.exports.AdapterError = AdapterError
module.exports.JavaScriptError = JavaScriptError
