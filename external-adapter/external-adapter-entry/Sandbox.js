const axios = require('axios')
require('dotenv').config()
const process = require('process')

// @TODO: Change the variable below to match the URL of the 'faas-sandbox' deployment
const faasSandboxUrl = process.env.FAASSANDBOXURL

class Sandbox {
  static async evaluate (javascriptString, vars) {
    console.log(faasSandboxUrl)
    try {
      const { data } = await axios.post(faasSandboxUrl, {
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
