
const { createRequest } = require('./index')
const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const port = process.env.EA_PORT || 8175
const fs = require('fs')
const path = require('path')

if (!process.env.KEY) {
  require('dotenv').config()
  if (!process.env.KEY) {
    throw Error('Environmental variable "KEY" has not been set. ' +
    'Run again with command "KEY=<ENCRYPTION_KEY_HERE> <start command>"')
  }
}

const keyhashfilepath = path.join(__dirname, '..', 'keyhash.enc')

// if the node key is not set, set it now
if (!fs.existsSync(keyhashfilepath)) {
  throw Error(`The nodeKey has not been set. Run "node setNodeKey.js" in ${__dirname}`)
}

const hashedNodeKey = fs.readFileSync(keyhashfilepath).toString()

app.use(cors())

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.send()
})

app.post('/', async (req, res) => {
  for (const key in req.query) {
    req.body[key] = req.query[key]
  }
  try {
    console.log('POST Data: ', req.body)
    await createRequest(req.body, hashedNodeKey, (status, result) => {
      console.log('Result: ', result)
      res.status(status).json(result)
    })
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}!`))

app.use(bodyParser.json())