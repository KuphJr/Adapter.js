class JavaScriptError {
  constructor ({
    status = 'errored',
    statusCode = 200,
    name = 'JavaScriptError',
    message = 'An error occurred',
    details
  }) {
    this.status = status
    this.statusCode = statusCode
    this.name = name
    this.message = message
    this.details = details
  }
  toJSONResponse () {
    return {
      status: this.status,
      statusCode: this.statusCode,
      error: { name: this.name, message: this.message, details: this.details }
    }
  }
}

module.exports.JavaScriptError = JavaScriptError
