export default class AdapterError extends Error {
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
    const errorBasic = { name: this.name, message: this.message }
    return {
      jobRunID: this.jobRunID,
      status: this.status,
      statusCode: this.statusCode,
      error: errorBasic
    }
  }
}
