const axios = require('axios')

class Sandbox {
  static async evaluate (javascriptString, vars) {
    const { data } = await axios.post('http://localhost:8079/', {
      js: javascriptString,
      vars: vars
    })
    console.log('!!!!!!!!!!')
    console.log(data)
    return data.result
  }
}

module.exports.Sandbox = Sandbox
