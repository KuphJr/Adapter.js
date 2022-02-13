class Validator {
    static validateInput(input) {
        if (typeof input.data.authAddr === 'undefined') {
            throw new Error(`The authorized contract address was not provided.`)
        }
        validatedInput.contractAddress = input.data.authAddr.toLowerCase()
        if (validatedInput.contractAddress.length !== 42 || validatedInput.contractAddress.slice(0,2) !== '0x') {
            throw new Error(`The given contract address ${validatedInput.contractAddress} is not valid.`)
        }
        for (const char in validatedInputnput.contractAddress.slice(2)) {
            if ((char < '0' || char > '9') && (char < 'a' || char > 'f' )) {
                throw new Error(`The given contract address ${validatedInput.contractAddress} is not valid.`)
            }
        }
        validatedInput.data.ref = input.ref
        if (typeof input.ref === 'undefined') {
            throw new Error(`The reference ID was not provided.`)
        }
        if (input.ref.length > 32 || input.ref.length < 4) {
            throw new Error('The reference ID must be between 4 and 32 characters.')
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
        if (JSON.stringify(input).length > 1000000) {
            throw new Error('The data object must be less than 1 MB.')
        }
        return validatedInput
    }
}

module.exports.Validator = Validator
