const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const router = require('./routers')
const app = express()

//define env config
require('dotenv').config();

//initial middleware
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

//initial routers
app.use(router)
module.exports = app