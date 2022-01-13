class Validator {
  static validateInput (input) {
    if (typeof input.js !== 'string') {
      throw Error("The parameter 'js' must be provided as a string.")
    }
    if (typeof input.vars !== 'object' && typeof input.vars !== 'undefined') {
      throw Error("The parameter 'vars' must be provided as a JavaScript object.")
    }
    return input
  }

  static validateOutput (output) {
    if (JSON.stringify(output).length > 8000000) {
      throw Error('The output returned by the JavaScript code is larger than 8 MB')
    }
    return output
  }
}

module.exports.Validator = Validator
