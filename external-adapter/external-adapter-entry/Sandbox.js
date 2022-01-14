const axios = require('axios')

class Sandbox {
  static async evaluate (javascriptString, vars) {
    try {
      const { data } = await axios.post('http://localhost:8079/', {
        js: javascriptString,
        vars: vars
      })
      return data.result
    } catch (error) {
      if (error.response.data.error) {
        throw error.response.data.error
      } else {
        throw error
      }
    }
  }
}

module.exports.Sandbox = Sandbox
