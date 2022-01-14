class Validator {
    static validateInput(input) {
        if (typeof input.contractAddress === 'undefined') {
            throw new Error(`The authorized contract address was not provided.`)
        }
        input.contractAddress = input.contractAddress.toLowerCase()
        if (input.contractAddress.length !== 42 || input.contractAddress.slice(0,2) !== '0x') {
            throw new Error(`The given contract address ${input.contractAddress} is not valid.`)
        }
        for (const char in input.contractAddress.slice(2)) {
            if ((char < '0' || char > '9') && (char < 'a' || char > 'f' )) {
                throw new Error(`The given contract address ${input.contractAddress} is not valid.`)
            }
        }
        if (typeof input.ref === 'undefined') {
            throw new Error(`The reference ID was not provided.`)
        }
        if (input.ref.length > 32) {
            throw new Error('The reference ID must be 32 characters or less')
        }
        for (const char in input.ref) {
            if ((char < '0' || char > '9') && (char < 'a' || char > 'z' ) && (char < 'A' || char > 'Z')) {
                throw new Error('The reference ID can only contain alphabetical characters and numbers.')
            }
        }
        if (typeof input.js !== 'undefined' && typeof input.js !== 'string') {
            throw new Error('The cached JavaScript code must be a string.')
        }
        if (typeof input.vars !== 'object') {
            throw new Error('The cached variables must be provided as a JavaScript object.')
        }
        if (JSON.stringify(input).length > 8000000) {
            throw new Error('The data object must be less than 8 MB.')
        }
        return input
    }
}

module.exports.Validator = Validator
