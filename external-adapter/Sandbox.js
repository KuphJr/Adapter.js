const { NodeVM, VMScript } = require('vm2')

class Sandbox {
  static async evaluate (javascriptString, vars) {
    const vm = new NodeVM({
      console: 'off',
      sandbox: vars,
      require: true
    })
    let functionScript
    try {
      functionScript = new VMScript('module.exports = function() {' + javascriptString + '}').compile()
    } catch (compileError) {
      throw Error('Error compiling provided JavaScript: ' + compileError)
    }
    let result
    try {
      const functionInSandbox = await vm.run(functionScript)
      result = functionInSandbox()
    } catch (runScriptError) {
      throw Error('Error evaluating provided JavaScript: ' + runScriptError)
    }
    return result
  }
}

module.exports.Sandbox = Sandbox
