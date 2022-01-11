class Validator {
    static validateInput(input) {
        // validate the input contract address
        if (typeof input.contractAddress === 'undefined') {
            throw new Error(`The authorized contract address was not provided.`)
        }
        input.contractAddress = input.contractAddress.toLowerCase()
        if (input.contractAddress.length !== 42 || input.contractAddress.slice(0,2) !== '0x') {
            throw new Error(`The give contract address ${input.contractAddress} is not valid.`)
        }
        for (const char in input.contractAddress.slice(2)) {
            if ((char < '0' || char > '9') && (char < 'a' || char > 'f' )) {
                throw new Error(`The give contract address ${input.contractAddress} is not valid.`)
            }
        }
        if (typeof input.referenceId === 'undefined') {
            throw new Error(`The reference ID was not provided.`)
        }
        if (input.referenceId.length > 32) {
            throw new Error('The reference ID must be 32 characters or less')
        }
        for (const char in input.referenceId) {
            if ((char < '0' || char > '9') && (char < 'a' || char > 'z' ) && (char < 'A' || char > 'Z')) {
                throw new Error('The reference ID can only contain alphabetical characters and numbers.')
            }
        }
        if (typeof input.vars !== 'object') {
            throw new Error('The variables must be provided as a JavaScript object.')
        }
        if (JSON.stringify(input.vars).length > 1048576) {
            throw new Error('The variables object must be less than 1 MB.')
        }
        return input
    }
}

module.exports.Validator = Validator