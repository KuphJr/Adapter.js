const fs = require('fs')
const os = require('os')
const path = require('path')
const { NodeVM, VMScript } = require('vm2')

class Sandbox {
  static async evaluate (javascriptString, vars) {
    this.clearTmpDirectory()
    const vm = new NodeVM({
      console: 'off',
      sandbox: vars,
      require: {
        external: true,
        builtin: ['*']
      }
    })
    let functionScript
    try {
      functionScript = new VMScript('module.exports = async function () {' + javascriptString + '}').compile()
    } catch (compileError) {
      throw Error('Error compiling provided JavaScript: ' + compileError)
    }
    let result
    try {
      const functionInSandbox = await vm.run(functionScript)
      result = await functionInSandbox()
    } catch (runScriptError) {
      throw Error('Error evaluating provided JavaScript: ' + runScriptError)
    }
    this.clearTmpDirectory()
    return result
  }

  static clearTmpDirectory () {
    const dirents = fs.readdirSync(os.tmpdir())
    dirents.forEach(dirent => {
      try {
        if (fs.lstatSync(path.join(os.tmpdir(), dirent)).isDirectory()) {
          fs.rmdirSync(path.join(os.tmpdir(), dirent), { recursive: true })
        } else {
          fs.rmSync(path.join(os.tmpdir(), dirent))
        }
      } catch (error) {}
    })
  }
}

module.exports.Sandbox = Sandbox
