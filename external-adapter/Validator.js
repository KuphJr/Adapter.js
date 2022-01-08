const process = require('process')

export default class Validator {
  constructor (input) {
    this.input = input
  }

  validateInput () {
    if (typeof this.input.type === 'string') {
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
      throw Error("Invalid value for parameter 'id' which must be a positive whole number.")
    }
    if (typeof this.input.js === 'undefined') {
      if (typeof this.input.cid === 'undefined') {
        throw Error("Either the parameter 'js' or 'cid' must be provided.")
      }
    }
    if (typeof this.input.cid === 'undefined' && typeof this.input.js === 'undefined') {
      throw Error("Either the parameter 'js' or 'cid' must be provided.")
    }
    if (typeof this.input.cid !== 'undefined' && typeof this.input.js !== 'undefined') {
      throw Error("Both of the parameter 'js' or 'cid' cannot be provided simultaneously.")
    }
    if (typeof this.input.vars !== 'undefined' || typeof this.input.vars !== 'string') {
      throw Error("Invalid value for parameter 'vars' which must be a string")
    }
    if (typeof this.input.ref !== 'undefined' || typeof this.input.ref !== 'string') {
      throw Error("Invalid value for parameter 'ref' which must be a string")
    }
    if (typeof this.input.ref === 'string') {
      if (this.input.nodeKey !== process.env.nodeKey) {
        throw Error('The node key is invalid.')
      }
      if (this.input.contractAddress !== 'string') {
        throw Error("Invalid parameter for 'contractAddress' parameter, which is the address of the contract " +
        'the initiated the request, must be provided as a string representing the contract that initiated the request.')
      }
    }
    return this.input
  }

  static validateOutput (output) {
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
  }
}
