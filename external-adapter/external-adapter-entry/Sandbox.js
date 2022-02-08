const axios = require('axios')
const process = require('process')

// @TODO: Change the variable below to match the URL of the 'faas-sandbox' deployment
const sandboxUrl = process.env.SANDBOXURL

class Sandbox {
  static async evaluate (javascriptString, vars) {
    try {
      const { data } = await axios.post(sandboxUrl, {
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
