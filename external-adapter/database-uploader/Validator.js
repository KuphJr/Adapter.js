class Validator {
    static validateInput(input) {
        // Check if the contract address is valid
        if (typeof input.contractAddress) {
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
        // Check if the reference Id is valid
        if (typeof input.ref) {
            throw new Error(`The reference ID was not provided.`)
        }
        if (input.ref.length > 32 || input.ref.length < 4) {
            throw new Error('The reference ID must contain at least 4 and at most 32 characters')
        }
        for (const char in input.ref) {
            if ((char < '0' || char > '9') && (char < 'a' || char > 'z' ) && (char < 'A' || char > 'Z')) {
                throw new Error('The reference ID can only contain alphabetical characters and numbers.')
            }
        }
        // If JavaScript is provided, check if the JavaScript is valid 
        if (input.js && typeof input.js !== 'string') {
            throw new Error('The cached JavaScript code must be a string.')
        }
        // If variables are provided, check if they are sent as a valid JavaScript object
        if (input.vars && typeof input.vars !== 'object') {
            throw new Error('The cached variables must be provided as a JavaScript object.')
        }
        if (JSON.stringify(input).length > 8000000) {
            throw new Error('The data object must be less than 8 MB.')
        }
        return input
    }
}

module.exports.Validator = Validator
