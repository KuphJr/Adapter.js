// This file is for testing the external adapter locally.
// It will not be used in the final deployment to a FaaS platform

const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const port = process.env.EA_PORT || 8080

app.use(cors())

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type') // Add other headers here
  res.setHeader('Access-Control-Allow-Methods', 'POST') // Add other methods here
  res.send()
})

app.use(bodyParser.json())

app.post('/', async (req, res) => {
  for (const key in req.query) {
    req.body[key] = req.query[key]
  }
  // console.log('PARAM')
  // console.log(req.param)
  // console.log('PARAMS')
  // console.log(req.params)
  // console.log('PATH')
  // console.log(req.path)
  // console.log('ROUTE')
  // console.log(req.route)
  // console.log('QUERY')
  // console.log(req.query)
  // console.log('POST Data: ', req.body)
  try {
    await createRequest(req.body, (status, result) => {
      console.log('RESULT: ', result)
      res.status(status).json(result)
    })
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
