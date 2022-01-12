const process = require('process')

class Validator {
  constructor (input) {
    this.input = input
  }

  validateInput () {
    if (typeof this.input.type !== 'string') {
      throw Error("The parameter 'type' must be provided as a string.")
    }
    switch (this.input.type) {
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
    if (typeof this.input.id === 'undefined') {
      this.input.id = 1
    } else if (typeof this.input.id !== 'number' || this.input.id < 0 || this.input.id % 1 !== 0) {
      throw Error("Invalid value for the parameter 'id' which must be a positive whole number.")
    }
    if (typeof this.input.js !== 'undefined' && typeof this.input.js !== 'string') {
      throw Error("Invalid value for the parameter 'js' which must be a string.")
    }
    if (typeof this.input.cid !== 'undefined' && typeof this.input.cid !== 'string') {
      throw Error("Invalid value for the parameter 'cid' which must be a string.")
    }
    if (typeof this.input.cid !== 'undefined' && typeof this.input.js !== 'undefined') {
      throw Error("Both of the parameter 'js' or 'cid' cannot be provided simultaneously.")
    }
    if (typeof this.input.vars !== 'undefined' && typeof this.input.vars !== 'string') {
      throw Error("Invalid value for the parameter 'vars' which must be a string")
    }
    if (typeof this.input.ref !== 'undefined') {
      if (typeof this.input.ref !== 'string') {
        throw Error("Invalid value for the parameter 'ref' which must be a string")
      }
      if (typeof this.input.nodeKey === 'undefined' || this.input.nodeKey !== process.env.NODEKEY) {
        throw Error('The node key is invalid.')
      }
      if (typeof this.input.contractAddress !== 'string') {
        throw Error("Invalid value for the parameter 'contractAddress' which must be a string.")
      }
    }
    return this.input
  }

  validateOutput (output) {
    if (typeof output === 'undefined') {
      throw Error('The provided JavaScript did not return a value or returned an undefined value.')
    }
    switch (this.input.type) {
      case ('bool'):
        if (typeof output !== 'boolean') {
          throw Error('The returned value must be a boolean. Returned: ' + output)
        }
        break
      case ('uint'):
        break
      case ('uint256'):
        if (typeof output !== 'number') {
          throw Error('The returned value must be a number. Returned: ' + output)
        } if (output % 1 !== 0 || output < 0) {
          throw Error('The returned value must be a positive whole number. Returned: ' + output)
        }
        break
      case ('int'):
        break
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
