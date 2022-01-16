const process = require('process')

class Validator {
  constructor (input) {
    this.input = input
  }

  validateInput () {
    const validatedInput = {}
    if (typeof this.input.data.type !== 'string') {
      throw Error("The parameter 'type' must be provided as a string.")
    }
    switch (this.input.data.type) {
      case ('bool'):
        break
      case ('uint'):
        break
      case ('uint256'):
        break
      case ('int'):
        break
      case ('int256'):
        break
      case ('bytes32'):
        break
      case ('string'):
        break
      case ('bytes'):
        break
      default:
        throw Error("Invalid value for the parameter 'type' which must be either " +
        "'bool', 'uint', 'uint256', 'int', 'int256', 'bytes32', 'string' or 'bytes'.")
    }
    validatedInput.type = this.input.type
    if (typeof this.input.id === 'undefined') {
      this.input.id = '1'
    } else if (typeof this.input.id !== 'string') {
      throw Error("Invalid value for the parameter 'id' which must be a string.")
    }
    validatedInput.id = this.input.id
    if (typeof this.input.data.js !== 'undefined' && typeof this.input.data.js !== 'string') {
      throw Error("Invalid value for the parameter 'js' which must be a string.")
    }
    if (typeof this.input.data.js === 'string') {
      validatedInput.js = this.input.data.js
    }
    if (typeof this.input.data.cid !== 'undefined' && typeof this.input.data.cid !== 'string') {
      throw Error("Invalid value for the parameter 'cid' which must be a string.")
    }
    if (typeof this.input.data.cid !== 'undefined' && typeof this.input.data.js !== 'undefined') {
      throw Error("Both of the parameter 'js' or 'cid' cannot be provided simultaneously.")
    }
    if (typeof this.input.data.cid === 'string') {
      validatedInput.cid = this.input.data.cid
    }
    if (typeof this.input.data.vars === 'string') {
      try {
        this.input.data.vars = JSON.parse(this.input.data.vars)
      } catch (error) {
        throw Error("The parameter 'vars' was not a valid JSON object string.")
      }
    }
    if (typeof this.input.data.vars !== 'undefined' && typeof this.input.data.vars !== 'object') {
      throw Error("Invalid value for the parameter 'vars' which must be a JavaScript object or a string.")
    }
    if (this.input.data.vars) {
      validatedInput.vars = this.input.data.vars
    }
    if (typeof this.input.data.ref !== 'undefined') {
      if (typeof this.input.data.ref !== 'string') {
        throw Error("Invalid value for the parameter 'ref' which must be a string")
      }
      validatedInput.ref = this.input.data.ref
      if (typeof this.input.nodeKey === 'undefined' || this.input.nodeKey !== process.env.NODEKEY) {
        throw Error('The node key is invalid.')
      }
      if (typeof this.input.meta.oracleRequest.requester !== 'string') {
        throw Error("Invalid value for the parameter 'contractAddress' which must be a string.")
      }
      validatedInput.contractAddress = this.input.meta.oracleRequest.requester
    }
    return validatedInput
  }

  validateOutput (output) {
    if (typeof output === 'undefined') {
      throw Error('The provided JavaScript did not return a value or returned an undefined value.')
    }
    switch (this.input.data.type) {
      case ('bool'):
        if (typeof output !== 'boolean') {
          throw Error('The returned value must be a boolean. Returned: ' + output)
        }
        break
      case ('uint'):
      case ('uint256'):
        if (typeof output !== 'number') {
          throw Error('The returned value must be a number. Returned: ' + output)
        } if (output % 1 !== 0 || output < 0) {
          throw Error('The returned value must be a positive whole number. Returned: ' + output)
        }
        break
      case ('int'):
      case ('int256'):
        if (typeof output !== 'number') {
          throw Error('The returned value must be a number. Returned: ' + output)
        } if (output % 1 !== 0) {
          throw Error('The returned value must be a whole number. Returned: ' + output)
        }
        break
      case ('bytes32'):
        if (typeof output !== 'string') {
          throw Error('The returned value must be a string. Returned: ' + output)
        }
        if (output >= 32) {
          throw Error('The returned string is greater than 31 bytes. Returned: ' + output)
        }
        break
      case ('string'):
        if (typeof output !== 'string') {
          throw Error('The returned value must be a string. Returned: ' + output)
        }
        break
      case ('bytes'):
        break
      default:
        throw Error("Invalid value for the parameter 'type' which must be either " +
        "'bool', 'uint', 'uint256', 'int', 'int256', 'bytes32', 'string' or 'bytes'.")
    }
    return output
  }
}

module.exports.Validator = Validator
